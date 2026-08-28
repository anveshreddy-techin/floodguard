# Data Dictionary

### Key Entities:
- **`AdminRegion`**: Administrative polygon (District, Block, Village, Ward).
- **`Watershed`**: Hydrological catchment polygon with Strahler hierarchy.
- **`RainfallObservation`**: Point precipitation measurement (`rainfall_mm`, `intensity_mmph`).
- **`RiverLevelObservation`**: Stage height (`level_m`, `rate_of_rise_mph`).
- **`SoilMoistureObservation`**: Saturation index ($0.0\text{--}1.0$).
- **`RiskAssessment`**: Holistic score ($0\text{--}100$), level (`LOW`, `MODERATE`, `HIGH`, `EXTREME`), confidence, uncertainty, contributors list.
- **`Alert`**: Emergency notification record (`DRAFT`, `ACTIVE`, `ACKNOWLEDGED`, `RESOLVED`).
- **`Incident`**: Incident command entity linked to action tasks and designated shelters.
