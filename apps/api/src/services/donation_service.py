"""
FloodGuard AI — Disaster Relief & Donation Service
Manages verified government & community disaster relief funds,
processes simulated/live donation pledges, generates SHA-256 receipts with 80G tax certificates,
and maintains a transparent public donation ledger.
"""
import hashlib
import uuid
from datetime import datetime, timezone
from typing import List, Optional

from ..models.donations import (
    CampaignStatus,
    DisasterType,
    DonationLedgerEntry,
    DonationReceipt,
    DonationSubmission,
    ReliefCampaign,
    ReliefFundStats,
)


class DonationService:
    def __init__(self):
        self._campaigns: dict[str, ReliefCampaign] = {}
        self._ledger: List[DonationLedgerEntry] = []
        self._seed_initial_campaigns()
        self._seed_initial_ledger()

    def _seed_initial_campaigns(self):
        campaigns_data = [
            ReliefCampaign(
                id="camp-uk-chamoli-2026",
                title="Chamoli & Upper Alaknanda Cloudburst Disaster Relief Fund",
                disaster_type=DisasterType.CLOUDBURST,
                state="Uttarakhand",
                district="Chamoli",
                river_basin="Alaknanda & Dhauliganga Basin",
                headline="Emergency high-ground shelters, food rations & early-warning sensor restoration in flood-hit valleys.",
                description="Heavy flash flood torrents damaged 4 village connector bridges and displaced 650 families across Tapovan, Raini, and Joshimath sectors. Funds provide waterproof dome tents, solar lamps, potable water purification filters, and medical antivenom supplies.",
                target_amount_inr=50000000.0,
                raised_amount_inr=34280000.0,
                donors_count=4120,
                beneficiaries_assisted=2850,
                status=CampaignStatus.ACTIVE_EMERGENCY,
                is_government_fund=True,
                verified_authority="Uttarakhand State Disaster Management Authority (USDMA) & CMRF",
                upi_id="ukcmrf.chamoli@sbi",
                bank_account_name="Chief Minister Relief Fund Uttarakhand - Chamoli Disaster",
                bank_account_number="30894512984",
                bank_ifsc="SBIN0001058",
                bank_branch="Dehradun Main Branch",
                tax_exempt_80g=True,
                image_badge="🏔️",
                active_since="2026-08-15T00:00:00Z",
                relief_breakdown={
                    "food_water_rations_pct": 40.0,
                    "temporary_shelter_tents_pct": 30.0,
                    "medical_emergency_kits_pct": 18.0,
                    "sensor_early_warning_repair_pct": 12.0,
                }
            ),
            ReliefCampaign(
                id="camp-as-brahmaputra-2026",
                title="Assam Brahmaputra Inundation & Majuli Flood Relief Drive",
                disaster_type=DisasterType.RIVER_INUNDATION,
                state="Assam",
                district="Majuli & Dhemaji",
                river_basin="Brahmaputra Mainstem",
                headline="Rescue boats, water purification tablets & livestock feed for marooned island villages.",
                description="Severe monsoon river surge submerged over 140 char settlements across Majuli and Dhemaji. SDRF rescue boats, mobile medical units, and temporary embankment sandbags are being deployed around the clock.",
                target_amount_inr=80000000.0,
                raised_amount_inr=61500000.0,
                donors_count=7890,
                beneficiaries_assisted=8400,
                status=CampaignStatus.ACTIVE_EMERGENCY,
                is_government_fund=True,
                verified_authority="Assam State Disaster Management Authority (ASDMA) & Assam CMRF",
                upi_id="ascmrf.majuli@sbi",
                bank_account_name="Chief Minister Relief Fund Assam - Flood Relief Pool",
                bank_account_number="39482019482",
                bank_ifsc="SBIN0000078",
                bank_branch="Guwahati Secretariat Branch",
                tax_exempt_80g=True,
                image_badge="🌊",
                active_since="2026-07-20T00:00:00Z",
                relief_breakdown={
                    "food_water_rations_pct": 45.0,
                    "temporary_shelter_tents_pct": 20.0,
                    "medical_emergency_kits_pct": 20.0,
                    "sensor_early_warning_repair_pct": 15.0,
                }
            ),
            ReliefCampaign(
                id="camp-kl-wayanad-2026",
                title="Wayanad Western Ghats Debris Flow Rehabilitation Fund",
                disaster_type=DisasterType.LANDSLIDE_DEBRIS_FLOW,
                state="Kerala",
                district="Wayanad",
                river_basin="Kabini Basin",
                headline="Geo-stable housing rebuild, family resettlement & trauma counseling in Chooralmala & Meppadi.",
                description="Catastrophic hill slope debris flow impacted tea estate settlements. Long-term relief fund supports permanent geo-safe housing construction, children education rehabilitation, and community psychosocial counseling.",
                target_amount_inr=100000000.0,
                raised_amount_inr=89200000.0,
                donors_count=12450,
                beneficiaries_assisted=5200,
                status=CampaignStatus.RECOVERY_PHASE,
                is_government_fund=True,
                verified_authority="Chief Minister's Distress Relief Fund (CMDRF) Kerala",
                upi_id="cmdrf.kerala@sbi",
                bank_account_name="Chief Minister's Distress Relief Fund Kerala",
                bank_account_number="67319948201",
                bank_ifsc="SBIN0070028",
                bank_branch="Thiruvananthapuram Main",
                tax_exempt_80g=True,
                image_badge="⛰️",
                active_since="2026-08-01T00:00:00Z",
                relief_breakdown={
                    "food_water_rations_pct": 25.0,
                    "temporary_shelter_tents_pct": 45.0,
                    "medical_emergency_kits_pct": 15.0,
                    "sensor_early_warning_repair_pct": 15.0,
                }
            ),
            ReliefCampaign(
                id="camp-ts-godavari-2026",
                title="Telangana Godavari Urban & Rural Flash Flood Response",
                disaster_type=DisasterType.URBAN_WATERLOGGING,
                state="Telangana",
                district="Bhadradri Kothagudem & Warangal",
                river_basin="Godavari River Basin",
                headline="High-capacity dewatering pumps, chlorination drives & emergency grocery supplies.",
                description="Heavy downpours caused flash flooding in Bhadrachalam temple town and Warangal low-lying colonies. Funds support urban slum hygiene sanitization, school rehabilitation, and vulnerable elder support.",
                target_amount_inr=45000000.0,
                raised_amount_inr=28400000.0,
                donors_count=3600,
                beneficiaries_assisted=4100,
                status=CampaignStatus.ACTIVE_EMERGENCY,
                is_government_fund=True,
                verified_authority="Telangana State Disaster Management Authority & CMRF",
                upi_id="tgcmrf.godavari@sbi",
                bank_account_name="Chief Minister Relief Fund Telangana",
                bank_account_number="48192049182",
                bank_ifsc="SBIN0020087",
                bank_branch="Hyderabad Gunfoundry Branch",
                tax_exempt_80g=True,
                image_badge="⛈️",
                active_since="2026-08-18T00:00:00Z",
                relief_breakdown={
                    "food_water_rations_pct": 35.0,
                    "temporary_shelter_tents_pct": 25.0,
                    "medical_emergency_kits_pct": 25.0,
                    "sensor_early_warning_repair_pct": 15.0,
                }
            ),
            ReliefCampaign(
                id="camp-national-pmnrf",
                title="Prime Minister's National Relief Fund (PMNRF) - Disaster Pool",
                disaster_type=DisasterType.GENERAL_DISASTER,
                state="National",
                district="Pan-India",
                river_basin="All Basins",
                headline="National ex-gratia assistance, immediate disaster relief & pan-India disaster response.",
                description="National statutory relief fund dedicated to providing immediate relief to families affected by natural calamities such as floods, cyclones, and landslides across all Indian states.",
                target_amount_inr=250000000.0,
                raised_amount_inr=198000000.0,
                donors_count=34200,
                beneficiaries_assisted=24500,
                status=CampaignStatus.ACTIVE_EMERGENCY,
                is_government_fund=True,
                verified_authority="Prime Minister's Office (PMO) Government of India",
                upi_id="pmnrf@sbi",
                bank_account_name="Prime Minister's National Relief Fund",
                bank_account_number="100010001000",
                bank_ifsc="SBIN0000691",
                bank_branch="New Delhi Main Branch",
                tax_exempt_80g=True,
                image_badge="🏛️",
                active_since="2026-01-01T00:00:00Z",
                relief_breakdown={
                    "food_water_rations_pct": 40.0,
                    "temporary_shelter_tents_pct": 30.0,
                    "medical_emergency_kits_pct": 20.0,
                    "sensor_early_warning_repair_pct": 10.0,
                }
            ),
        ]
        for c in campaigns_data:
            self._campaigns[c.id] = c

    def _seed_initial_ledger(self):
        self._ledger = [
            DonationLedgerEntry(
                receipt_id="RCPT-2026-89412",
                timestamp=datetime.now(timezone.utc).isoformat(),
                campaign_id="camp-uk-chamoli-2026",
                campaign_title="Chamoli & Upper Alaknanda Cloudburst Disaster Relief Fund",
                amount_inr=5000.0,
                donor_name_masked="R****h S***a",
                transaction_hash=hashlib.sha256(b"RCPT-2026-89412").hexdigest(),
                relief_allocation="2 Family Food & Water Kits + 1 High-Ground Tarp",
            ),
            DonationLedgerEntry(
                receipt_id="RCPT-2026-89411",
                timestamp=datetime.now(timezone.utc).isoformat(),
                campaign_id="camp-as-brahmaputra-2026",
                campaign_title="Assam Brahmaputra Inundation & Majuli Flood Relief Drive",
                amount_inr=10000.0,
                donor_name_masked="A****a N***r",
                transaction_hash=hashlib.sha256(b"RCPT-2026-89411").hexdigest(),
                relief_allocation="4 Life Jackets + 200 Water Purification Tablets",
            ),
            DonationLedgerEntry(
                receipt_id="RCPT-2026-89410",
                timestamp=datetime.now(timezone.utc).isoformat(),
                campaign_id="camp-kl-wayanad-2026",
                campaign_title="Wayanad Western Ghats Debris Flow Rehabilitation Fund",
                amount_inr=2500.0,
                donor_name_masked="Anonymous Benefactor",
                transaction_hash=hashlib.sha256(b"RCPT-2026-89410").hexdigest(),
                relief_allocation="Emergency First-Aid & Trauma Care Support",
            ),
        ]

    def list_campaigns(
        self,
        state: Optional[str] = None,
        disaster_type: Optional[DisasterType] = None,
        status: Optional[CampaignStatus] = None,
    ) -> List[ReliefCampaign]:
        res = list(self._campaigns.values())
        if state and state.upper() != "ALL":
            res = [c for c in res if c.state.lower() == state.lower() or c.state == "National"]
        if disaster_type:
            res = [c for c in res if c.disaster_type == disaster_type]
        if status:
            res = [c for c in res if c.status == status]
        return res

    def get_campaign(self, campaign_id: str) -> Optional[ReliefCampaign]:
        return self._campaigns.get(campaign_id)

    def process_donation(self, submission: DonationSubmission) -> DonationReceipt:
        campaign = self._campaigns.get(submission.campaign_id)
        if not campaign:
            campaign = self._campaigns["camp-national-pmnrf"]

        # Update campaign metrics
        campaign.raised_amount_inr += submission.amount_inr
        campaign.donors_count += 1
        # 1 family assisted per approx 1500 INR
        new_beneficiaries = max(1, int(submission.amount_inr / 1500))
        campaign.beneficiaries_assisted += new_beneficiaries

        receipt_id = f"RCPT-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        now_iso = datetime.now(timezone.utc).isoformat()

        # Compute cryptographic receipt hash for ledger provenance
        hash_payload = f"{receipt_id}|{now_iso}|{submission.campaign_id}|{submission.amount_inr}|{submission.donor_name}"
        tx_hash = hashlib.sha256(hash_payload.encode("utf-8")).hexdigest()

        # Mask donor name for public ledger transparency & privacy
        if submission.is_anonymous or not submission.donor_name:
            masked_name = "Anonymous Benefactor"
        else:
            parts = submission.donor_name.strip().split()
            if len(parts) == 1:
                masked_name = f"{parts[0][0]}***"
            else:
                masked_name = f"{parts[0][0]}**** {parts[-1][0]}***"

        # Impact statement
        if submission.amount_inr < 1000:
            impact_desc = "Provides 1 Emergency Drinking Water & Dry Ration Kit (3-Day Supply)"
        elif submission.amount_inr < 3000:
            impact_desc = f"Provides Clean Potable Water & Medical First-Aid for {new_beneficiaries} Families"
        elif submission.amount_inr < 10000:
            impact_desc = f"Supplies {new_beneficiaries} Waterproof High-Ground Tents & Solar Flashlight Kits"
        else:
            impact_desc = f"Funds Community Dewatering Pump & {new_beneficiaries * 2} Emergency Shelter Kits"

        receipt = DonationReceipt(
            receipt_id=receipt_id,
            transaction_hash=tx_hash,
            timestamp=now_iso,
            campaign_id=campaign.id,
            campaign_title=campaign.title,
            amount_inr=submission.amount_inr,
            donor_name_masked=masked_name,
            is_anonymous=submission.is_anonymous,
            verified_authority=campaign.verified_authority,
            tax_exemption_80g_cert=f"80G/IT/NDMA/{datetime.now(timezone.utc).year}/{uuid.uuid4().hex[:8].upper()}",
            pan_provided=bool(submission.donor_pan),
            status="CONFIRMED",
            impact_statement=impact_desc,
        )

        # Add to public ledger
        ledger_entry = DonationLedgerEntry(
            receipt_id=receipt_id,
            timestamp=now_iso,
            campaign_id=campaign.id,
            campaign_title=campaign.title,
            amount_inr=submission.amount_inr,
            donor_name_masked=masked_name,
            transaction_hash=tx_hash,
            relief_allocation=impact_desc,
        )
        self._ledger.insert(0, ledger_entry)
        if len(self._ledger) > 100:
            self._ledger = self._ledger[:100]

        return receipt

    def get_ledger(self, limit: int = 25) -> List[DonationLedgerEntry]:
        return self._ledger[:limit]

    def get_stats(self) -> ReliefFundStats:
        total_raised = sum(c.raised_amount_inr for c in self._campaigns.values())
        total_donors = sum(c.donors_count for c in self._campaigns.values())
        total_assisted = sum(c.beneficiaries_assisted for c in self._campaigns.values())

        return ReliefFundStats(
            total_raised_inr=total_raised,
            total_donors=total_donors,
            total_campaigns_active=len(self._campaigns),
            families_assisted=total_assisted,
            ration_kits_dispatched=int(total_assisted * 1.8),
            emergency_shelters_built=int(total_assisted * 0.35),
            medical_camps_supported=42,
            allocation_transparency={
                "Food & Drinking Water Rations": 40.0,
                "Emergency Shelter & Tarpaulins": 28.0,
                "Medical & Antivenom Supplies": 18.0,
                "Early-Warning Sensor Restoration": 14.0,
            }
        )


donation_service = DonationService()
