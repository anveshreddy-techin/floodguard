"""
FloodGuard AI — Disaster Relief & Donation Models
Data contracts for official relief funds, active disaster appeals,
transparent donation ledgers, and 80G receipt certificates.
"""
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class DisasterType(str, Enum):
    FLASH_FLOOD = "FLASH_FLOOD"
    RIVER_INUNDATION = "RIVER_INUNDATION"
    GLOF = "GLOF"
    LANDSLIDE_DEBRIS_FLOW = "LANDSLIDE_DEBRIS_FLOW"
    CLOUDBURST = "CLOUDBURST"
    URBAN_WATERLOGGING = "URBAN_WATERLOGGING"
    GENERAL_DISASTER = "GENERAL_DISASTER"


class CampaignStatus(str, Enum):
    ACTIVE_EMERGENCY = "ACTIVE_EMERGENCY"
    RECOVERY_PHASE = "RECOVERY_PHASE"
    LONG_TERM_REHABILITATION = "LONG_TERM_REHABILITATION"
    COMPLETED = "COMPLETED"


class PaymentMethod(str, Enum):
    UPI = "UPI"
    NET_BANKING = "NET_BANKING"
    CARD = "CARD"
    BANK_TRANSFER = "BANK_TRANSFER"
    CRYPTO_STABLECOIN = "CRYPTO_STABLECOIN"


class ReliefCampaign(BaseModel):
    id: str
    title: str
    disaster_type: DisasterType
    state: str
    district: str
    river_basin: Optional[str] = None
    headline: str
    description: str
    target_amount_inr: float
    raised_amount_inr: float
    donors_count: int
    beneficiaries_assisted: int
    status: CampaignStatus
    is_government_fund: bool = True
    verified_authority: str
    upi_id: str
    bank_account_name: str
    bank_account_number: str
    bank_ifsc: str
    bank_branch: str
    tax_exempt_80g: bool = True
    image_badge: str
    active_since: str
    relief_breakdown: Dict[str, float] = Field(
        default_factory=lambda: {
            "food_water_rations_pct": 40.0,
            "temporary_shelter_tents_pct": 25.0,
            "medical_emergency_kits_pct": 20.0,
            "sensor_early_warning_repair_pct": 15.0,
        }
    )


class DonationSubmission(BaseModel):
    campaign_id: str
    amount_inr: float = Field(..., gt=0, description="Donation amount in INR")
    donor_name: Optional[str] = "Anonymous Benefactor"
    donor_email: Optional[str] = None
    donor_pan: Optional[str] = None
    is_anonymous: bool = False
    payment_method: PaymentMethod = PaymentMethod.UPI
    payment_ref_id: Optional[str] = None
    notes: Optional[str] = None


class DonationReceipt(BaseModel):
    receipt_id: str
    transaction_hash: str
    timestamp: str
    campaign_id: str
    campaign_title: str
    amount_inr: float
    donor_name_masked: str
    is_anonymous: bool
    verified_authority: str
    tax_exemption_80g_cert: str
    pan_provided: bool
    status: str = "CONFIRMED"
    impact_statement: str


class DonationLedgerEntry(BaseModel):
    receipt_id: str
    timestamp: str
    campaign_id: str
    campaign_title: str
    amount_inr: float
    donor_name_masked: str
    transaction_hash: str
    relief_allocation: str


class ReliefFundStats(BaseModel):
    total_raised_inr: float
    total_donors: int
    total_campaigns_active: int
    families_assisted: int
    ration_kits_dispatched: int
    emergency_shelters_built: int
    medical_camps_supported: int
    allocation_transparency: Dict[str, float]
