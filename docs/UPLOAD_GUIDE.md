# Data Upload & Integration Guide

### Supported Formats
- CSV (`observed_at,rainfall_mm` or `observed_at,level_m,station_code`)
- JSON / GeoJSON

### Execution Steps
1. Navigate to `/upload` in the operational dashboard.
2. Download the sample schema template.
3. Upload CSV file $\rightarrow$ System triggers automated validation.
4. Review valid vs. quarantined record counts on the validation report.
