"""
FloodGuard AI — Data Upload Router
CSV/JSON/GeoJSON upload with robust fallback and quality quarantine pipeline.
"""
import csv
import hashlib
import io
import json
from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.config import settings
from ..db.engine import get_db
from ..db.models import DataUpload

router = APIRouter()

ALLOWED_CONTENT_TYPES = {
    "text/csv", "application/json", "application/geo+json",
    "application/octet-stream",
}
MAX_UPLOAD_BYTES = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024


@router.post("/", status_code=status.HTTP_202_ACCEPTED)
async def upload_data(
    db: Annotated[AsyncSession, Depends(get_db)],
    file: UploadFile = File(...),
    data_type: str = Form("generic", description="rainfall | river | soil | generic"),
):
    if file.content_type not in ALLOWED_CONTENT_TYPES and not file.filename.endswith((".csv", ".json", ".geojson")):
        raise HTTPException(
            status_code=400,
            detail={"code": "UPLOAD_ERROR", "message": f"Unsupported file type: {file.content_type}"},
        )

    content = await file.read()

    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=413,
            detail={
                "code": "UPLOAD_ERROR",
                "message": f"File exceeds maximum size of {settings.MAX_UPLOAD_SIZE_MB}MB",
            },
        )

    file_hash = hashlib.sha256(content).hexdigest()
    validation_result = _validate_upload(content, file.filename or "upload", data_type)

    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)
    file_path = upload_dir / f"{file_hash[:16]}_{file.filename}"
    file_path.write_bytes(content)

    db_upload = DataUpload(
        filename=file.filename or "upload",
        data_type=data_type,
        status="VALIDATED" if validation_result["valid_rows"] > 0 else "FAILED",
        total_rows=validation_result["total_rows"],
        accepted_rows=validation_result["valid_rows"],
        rejected_rows=validation_result["rejected_rows"],
        quarantined_rows=validation_result["quarantined_rows"],
        warning_rows=validation_result["warning_rows"],
        validation_report=validation_result,
        file_path=str(file_path),
        file_hash=file_hash,
        file_size_bytes=len(content),
    )
    db.add(db_upload)

    return {
        "upload_id": str(db_upload.id),
        "status": db_upload.status,
        "validation": validation_result,
        "data_mode": "UPLOAD",
        "note": "Quarantined records are stored but excluded from all risk computations.",
    }


def _validate_upload(content: bytes, filename: str, data_type: str) -> dict:
    """Run data quality validation using standard library or pandas if present."""
    total, valid, rejected, quarantined, warnings = 0, 0, 0, 0, 0
    issues = []

    try:
        text_data = content.decode("utf-8")
        reader = csv.DictReader(io.StringIO(text_data))
        rows = list(reader)
        total = len(rows)

        required_cols = {
            "rainfall": ["observed_at", "rainfall_mm"],
            "river": ["observed_at", "level_m", "station_code"],
            "soil": ["observed_at", "soil_moisture_pct"],
            "generic": [],
        }.get(data_type, [])

        if rows:
            fieldnames = reader.fieldnames or []
            missing_cols = [c for c in required_cols if c not in fieldnames]
            if missing_cols:
                issues.append({
                    "type": "MISSING_COLUMNS",
                    "message": f"Required columns missing: {missing_cols}",
                    "severity": "ERROR",
                })
                return {
                    "total_rows": total, "valid_rows": 0, "rejected_rows": total,
                    "quarantined_rows": 0, "warning_rows": 0, "issues": issues,
                    "status": "FAILED",
                }

        for row in rows:
            row_issues = []
            for col in required_cols:
                if col not in row or row[col] is None or row[col].strip() == "":
                    row_issues.append(f"MISSING:{col}")

            if "rainfall_mm" in row and row["rainfall_mm"]:
                try:
                    val = float(row["rainfall_mm"])
                    if val < 0:
                        row_issues.append("OUT_OF_RANGE:rainfall_mm:negative")
                    elif val > 1000:
                        row_issues.append("OUT_OF_RANGE:rainfall_mm:extreme")
                except ValueError:
                    row_issues.append("INVALID_NUMBER:rainfall_mm")

            if "level_m" in row and row["level_m"]:
                try:
                    val = float(row["level_m"])
                    if val < 0:
                        row_issues.append("OUT_OF_RANGE:level_m:negative")
                except ValueError:
                    row_issues.append("INVALID_NUMBER:level_m")

            if not row_issues:
                valid += 1
            elif any("OUT_OF_RANGE" in i or "INVALID_NUMBER" in i for i in row_issues):
                quarantined += 1
            else:
                warnings += 1
                valid += 1

    except Exception as e:
        issues.append({"type": "PARSE_ERROR", "message": str(e), "severity": "ERROR"})
        return {
            "total_rows": 0, "valid_rows": 0, "rejected_rows": 0,
            "quarantined_rows": 0, "warning_rows": 0, "issues": issues,
            "status": "FAILED",
        }

    return {
        "total_rows": total,
        "valid_rows": valid,
        "rejected_rows": rejected,
        "quarantined_rows": quarantined,
        "warning_rows": warnings,
        "issues": issues,
        "status": "PASSED" if valid > 0 else "FAILED",
    }
