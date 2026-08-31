# FloodGuard AI — Disaster Relief & Donations Hub

## Purpose

The **Disaster Relief & Donations Hub** provides direct, transparent, and statutory pathways for citizens, organizations, and international benefactors to support relief, rescue, and rehabilitation operations during and after severe flood and multi-hazard disasters across India.

---

## 1. Verified Statutory Relief Pools & Campaigns

All campaigns listed within FloodGuard AI are directly linked to official State Disaster Management Authorities (SDMA), Chief Minister's Relief Funds (CMRF), or the Prime Minister's National Relief Fund (PMNRF).

| Campaign | State / Basin | Verified Authority | Official UPI VPA | 80G Tax Exemption |
|---|---|---|---|---|
| **Chamoli & Upper Alaknanda Cloudburst Relief** | Uttarakhand (Alaknanda Basin) | Uttarakhand SDMA (USDMA) & CMRF | `ukcmrf.chamoli@sbi` | 100% Deductible |
| **Assam Brahmaputra Inundation Relief** | Assam (Brahmaputra Mainstem) | Assam SDMA (ASDMA) & CMRF | `ascmrf.majuli@sbi` | 100% Deductible |
| **Wayanad Landslide Rehabilitation Fund** | Kerala (Kabini Basin) | CMDRF Kerala | `cmdrf.kerala@sbi` | 100% Deductible |
| **Telangana Godavari Flash Flood Response** | Telangana (Godavari Basin) | Telangana SDMA & CMRF | `tgcmrf.godavari@sbi` | 100% Deductible |
| **Himachal Beas Cloudburst Emergency Fund** | Himachal Pradesh (Beas Basin) | HP SDMA (HPSDMA) & CMRF | `hpcmrf.kullu@sbi` | 100% Deductible |
| **PM National Relief Fund (PMNRF)** | Pan-India (All Basins) | Prime Minister's Office (PMO) | `pmnrf@sbi` | 100% Deductible |

---

## 2. Relief Allocation Breakdown

To maintain complete public transparency, every rupee contributed is programmatically categorized according to standard SDRF relief unit economics:

- **40% — Emergency Food & Potable Drinking Water Rations**: Dry food packs, water purification filters, chlorine tablets, baby nutrition.
- **28% — Temporary High-Ground Shelter & Bedding**: Waterproof geodesic dome tents, emergency tarpaulins, wool blankets, solar lanterns.
- **18% — Emergency Medical & Antivenom Supplies**: First-aid trauma kits, waterborne disease prevention medicine, emergency antivenom vials.
- **14% — Early-Warning IoT Sensor & Communications Repair**: Restoring washed-out ultrasonic river gauges, automated rain gauges, and LoRaWAN repeaters.

---

## 3. Contribution Methods & Integration

### A. Instant UPI & Dynamic QR Code
- Supports all UPI apps (Google Pay, PhonePe, Paytm, BHIM, Cred, Amazon Pay).
- Scannable dynamic QR code with embedded beneficiary details.

### B. Direct Statutory Bank Transfer
- Official State Bank of India (SBI) government treasury accounts with IFSC and branch details for NEFT / RTGS / IMPS.

### C. Cryptographic Public Ledger & 80G Receipt
- Every pledge generates a unique receipt ID (`RCPT-YYYY-XXXXXX`) and a SHA-256 transaction hash stored in the public transparency ledger.
- Instant 80G tax exemption certificate with donor PAN recognition for statutory tax rebate filing.

---

## 4. API Endpoints

- `GET /api/v1/donations/campaigns`: List all active disaster relief funds (filterable by state and disaster type).
- `GET /api/v1/donations/campaigns/{id}`: Detailed campaign profile and bank accounts.
- `POST /api/v1/donations/donate`: Process pledge, record ledger entry, and return cryptographic 80G receipt.
- `GET /api/v1/donations/ledger`: Real-time public ledger with masked benefactor names and transaction hashes.
- `GET /api/v1/donations/stats`: Pan-India aggregated relief metrics.
