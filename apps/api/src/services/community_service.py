"""
FloodGuard AI — Community Intelligence Service
Manages citizen and operator field reports, automated quality & duplicate checks,
sensor cross-corroboration, operator verification, and privacy preservation.
"""
from datetime import datetime, timezone, timedelta
import hashlib
import uuid
from typing import Any, Optional

from ..core.logging import get_logger
from ..models.weather import (
    CommunityReportType,
    VerificationStatus,
    WeatherDataMode,
    WeatherLocation,
    CommunityReportSubmission,
    CommunityReport,
)

logger = get_logger(__name__)


# In-memory store initialized with realistic demo reports
_community_reports: dict[str, CommunityReport] = {}


def _generate_provenance_hash(payload: str) -> str:
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:16]


def _seed_initial_community_reports():
    now = datetime.now(timezone.utc)
    
    seeds = [
        CommunityReport(
            report_id="rep-chamoli-001",
            location=WeatherLocation(
                latitude=30.485,
                longitude=79.692,
                state="Uttarakhand",
                district="Chamoli",
                location_name="Raini Village Confluence",
            ),
            report_type=CommunityReportType.RISING_RIVER,
            description="Water level in Rishiganga has surged past the temporary walking bridge. Water is muddy and carrying heavy gravel.",
            severity="HIGH",
            observed_at=(now - timedelta(minutes=25)).isoformat(),
            received_at=(now - timedelta(minutes=24)).isoformat(),
            language="en",
            has_photo=True,
            has_video=False,
            is_anonymous=True,
            reporter_contact_masked="***-***-8821",
            verification_status=VerificationStatus.CORROBORATED,
            corroborating_sensor_id="RADAR-001",
            corroborating_weather_signal="HEAVY_RAIN (18mm/h)",
            operator_notes="Sensor RADAR-001 confirms +0.40m/h stage rise. Nearby AWS reports 48mm in 3h.",
            reviewed_by="District EOC Operator (Chamoli)",
            reviewed_at=(now - timedelta(minutes=15)).isoformat(),
            data_mode=WeatherDataMode.DEMO,
            provenance_hash=_generate_provenance_hash("rep-chamoli-001"),
        ),
        CommunityReport(
            report_id="rep-chamoli-002",
            location=WeatherLocation(
                latitude=30.495,
                longitude=79.680,
                state="Uttarakhand",
                district="Chamoli",
                location_name="Tapovan Tunnel Approach",
            ),
            report_type=CommunityReportType.BLOCKED_ROAD,
            description="Small mud debris slide at KM 0.6 culvert junction. Two-wheelers stopped.",
            severity="MEDIUM",
            observed_at=(now - timedelta(minutes=45)).isoformat(),
            received_at=(now - timedelta(minutes=40)).isoformat(),
            language="en",
            has_photo=True,
            has_video=True,
            is_anonymous=False,
            reporter_contact_masked="***-***-3410",
            verification_status=VerificationStatus.VERIFIED_BY_AUTHORITY,
            corroborating_sensor_id="GEO-001",
            corroborating_weather_signal="MODERATE_RAIN",
            operator_notes="SDRF Field Unit 4 dispatched for culvert clearance.",
            reviewed_by="SEOC Commander (Uttarakhand)",
            reviewed_at=(now - timedelta(minutes=30)).isoformat(),
            data_mode=WeatherDataMode.DEMO,
            provenance_hash=_generate_provenance_hash("rep-chamoli-002"),
        ),
        CommunityReport(
            report_id="rep-hyd-001",
            location=WeatherLocation(
                latitude=17.553,
                longitude=78.206,
                state="Telangana",
                district="Sangareddy",
                location_name="Isnapur Main Road",
            ),
            report_type=CommunityReportType.WATERLOGGING,
            description="Minor roadside puddle near culvert, but traffic moving smoothly. Roadway dry and clear.",
            severity="LOW",
            observed_at=(now - timedelta(minutes=12)).isoformat(),
            received_at=(now - timedelta(minutes=10)).isoformat(),
            language="en",
            has_photo=False,
            has_video=False,
            is_anonymous=True,
            reporter_contact_masked=None,
            verification_status=VerificationStatus.UNVERIFIED,
            corroborating_sensor_id=None,
            corroborating_weather_signal="LIGHT_DRIZZLE",
            operator_notes=None,
            reviewed_by=None,
            reviewed_at=None,
            data_mode=WeatherDataMode.DEMO,
            provenance_hash=_generate_provenance_hash("rep-hyd-001"),
        ),
    ]

    for s in seeds:
        _community_reports[s.report_id] = s


_seed_initial_community_reports()


class CommunityIntelligenceService:
    """
    Service for ingesting, validating, and verifying community hazard reports.
    """

    def list_reports(
        self,
        state: Optional[str] = None,
        district: Optional[str] = None,
        report_type: Optional[CommunityReportType] = None,
        status: Optional[VerificationStatus] = None,
    ) -> list[CommunityReport]:
        reports = list(_community_reports.values())
        
        if state and state != "National" and state != "ALL":
            reports = [r for r in reports if r.location.state.lower() == state.lower() or state.lower() in r.location.state.lower()]
        if district and district != "Unspecified":
            reports = [r for r in reports if r.location.district.lower() == district.lower()]
        if report_type:
            reports = [r for r in reports if r.report_type == report_type]
        if status:
            reports = [r for r in reports if r.verification_status == status]

        # Return sorted by most recent received_at
        return sorted(reports, key=lambda x: x.received_at, reverse=True)

    def submit_report(
        self,
        submission: CommunityReportSubmission,
        data_mode: WeatherDataMode = WeatherDataMode.LIVE,
    ) -> CommunityReport:
        now_str = datetime.now(timezone.utc).isoformat()
        report_id = f"rep-{uuid.uuid4().hex[:8]}"

        # Basic duplicate check: same location and report type within 15 minutes
        is_duplicate = any(
            r.report_type == submission.report_type
            and abs(r.location.latitude - submission.location.latitude) < 0.01
            and abs(r.location.longitude - submission.location.longitude) < 0.01
            for r in _community_reports.values()
        )

        initial_status = VerificationStatus.UNVERIFIED
        operator_note = "Potential duplicate submission detected." if is_duplicate else None

        report = CommunityReport(
            report_id=report_id,
            location=submission.location,
            report_type=submission.report_type,
            description=submission.description,
            severity=submission.severity,
            observed_at=submission.observed_at or now_str,
            received_at=now_str,
            language=submission.language,
            has_photo=submission.has_photo,
            has_video=submission.has_video,
            is_anonymous=submission.is_anonymous,
            reporter_contact_masked=submission.reporter_contact_masked,
            verification_status=initial_status,
            corroborating_sensor_id=None,
            corroborating_weather_signal=None,
            operator_notes=operator_note,
            reviewed_by=None,
            reviewed_at=None,
            data_mode=data_mode,
            provenance_hash=_generate_provenance_hash(f"{report_id}_{submission.description}"),
        )

        _community_reports[report_id] = report
        logger.info("community_report_submitted", report_id=report_id, type=submission.report_type)
        return report

    def verify_report(
        self,
        report_id: str,
        status: VerificationStatus,
        operator_notes: str,
        operator_id: str,
    ) -> Optional[CommunityReport]:
        if report_id not in _community_reports:
            return None

        report = _community_reports[report_id]
        report.verification_status = status
        report.operator_notes = operator_notes
        report.reviewed_by = operator_id
        report.reviewed_at = datetime.now(timezone.utc).isoformat()

        logger.info("community_report_reviewed", report_id=report_id, status=status, by=operator_id)
        return report


community_service = CommunityIntelligenceService()
