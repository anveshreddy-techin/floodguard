"""
FloodGuard AI — Community Intelligence Router
Citizen and field responder incident submissions, moderation, sensor corroboration, and verification workflows.
"""
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status

from ..models.weather import (
    CommunityReportType,
    VerificationStatus,
    CommunityReportSubmission,
    CommunityReport,
    CommunityReportVerificationRequest,
)
from ..services.community_service import community_service

router = APIRouter(prefix="/api/v1/community", tags=["community"])


@router.get("/reports", response_model=list[CommunityReport])
async def list_community_reports(
    state: Optional[str] = Query(None, description="Filter by state name"),
    district: Optional[str] = Query(None, description="Filter by district name"),
    report_type: Optional[CommunityReportType] = Query(None, description="Filter by report type"),
    status: Optional[VerificationStatus] = Query(None, description="Filter by verification status"),
):
    """
    List citizen and field responder community reports.
    Always includes clear verification status and source attribution.
    """
    return community_service.list_reports(
        state=state,
        district=district,
        report_type=report_type,
        status=status,
    )


@router.post("/reports", response_model=CommunityReport, status_code=status.HTTP_201_CREATED)
async def submit_community_report(submission: CommunityReportSubmission):
    """
    Submit a new citizen or field hazard observation.
    Initial status is UNVERIFIED until audited by an authorized operator or corroborated by IoT sensors.
    """
    return community_service.submit_report(submission)


@router.post("/reports/{report_id}/verify", response_model=CommunityReport)
async def verify_community_report(
    report_id: str,
    payload: CommunityReportVerificationRequest,
):
    """
    Authorized operator verification or status update of a community report.
    """
    updated = community_service.verify_report(
        report_id=report_id,
        status=payload.status,
        operator_notes=payload.operator_notes,
        operator_id=payload.operator_id,
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Community report not found")
    return updated


@router.post("/reports/{report_id}/reject", response_model=CommunityReport)
async def reject_community_report(
    report_id: str,
    operator_notes: str = Query(..., description="Reason for rejection"),
    operator_id: str = Query("operator-eoc-01", description="Operator ID"),
):
    """
    Reject an ungrounded or spam community report.
    """
    updated = community_service.verify_report(
        report_id=report_id,
        status=VerificationStatus.REJECTED,
        operator_notes=operator_notes,
        operator_id=operator_id,
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Community report not found")
    return updated
