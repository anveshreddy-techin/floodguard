"""
FloodGuard AI — Disaster Relief & Donations Router
Endpoints to list verified disaster relief campaigns, record donations,
retrieve transparent utilization stats, and query the public donation ledger.
"""
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status

from ..models.donations import (
    CampaignStatus,
    DisasterType,
    DonationLedgerEntry,
    DonationReceipt,
    DonationSubmission,
    ReliefCampaign,
    ReliefFundStats,
)
from ..services.donation_service import donation_service

router = APIRouter(prefix="/api/v1/donations", tags=["Disaster Relief & Donations"])


@router.get("/campaigns", response_model=List[ReliefCampaign])
async def list_relief_campaigns(
    state: Optional[str] = Query(None, description="Filter by state name"),
    disaster_type: Optional[DisasterType] = Query(None, description="Filter by disaster type"),
    status: Optional[CampaignStatus] = Query(None, description="Filter by campaign status"),
):
    """
    List all active and recovery disaster relief funds and campaigns.
    Always includes verified government authority, UPI ID, and bank details.
    """
    return donation_service.list_campaigns(
        state=state,
        disaster_type=disaster_type,
        status=status,
    )


@router.get("/campaigns/{campaign_id}", response_model=ReliefCampaign)
async def get_relief_campaign(campaign_id: str):
    """
    Get detailed information about a specific disaster relief campaign.
    """
    campaign = donation_service.get_campaign(campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Relief campaign not found")
    return campaign


@router.post("/donate", response_model=DonationReceipt, status_code=status.HTTP_201_CREATED)
async def process_disaster_donation(submission: DonationSubmission):
    """
    Process a pledge/donation for disaster relief.
    Generates a cryptographically hashed receipt and 80G tax exemption certificate.
    """
    return donation_service.process_donation(submission)


@router.get("/ledger", response_model=List[DonationLedgerEntry])
async def get_donation_ledger(
    limit: int = Query(25, ge=1, le=100, description="Max entries to return"),
):
    """
    Retrieve the transparent public donation ledger with cryptographic transaction hashes.
    """
    return donation_service.get_ledger(limit=limit)


@router.get("/stats", response_model=ReliefFundStats)
async def get_relief_fund_stats():
    """
    Retrieve aggregated pan-India disaster relief fund statistics and transparent allocation percentages.
    """
    return donation_service.get_stats()
