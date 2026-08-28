"""
Unit tests for Data Upload and Quality Quarantine logic.
"""
from apps.api.src.routers.uploads import _validate_upload


def test_valid_rainfall_csv_validation():
    csv_content = b"observed_at,rainfall_mm\n2026-08-28T00:00:00Z,12.5\n2026-08-28T01:00:00Z,24.0\n"
    res = _validate_upload(csv_content, "rainfall.csv", "rainfall")
    assert res["total_rows"] == 2
    assert res["valid_rows"] == 2
    assert res["quarantined_rows"] == 0
    assert res["rejected_rows"] == 0


def test_out_of_range_quarantine():
    # Negative rainfall or extreme rainfall (>1000mm) must be quarantined
    csv_content = b"observed_at,rainfall_mm\n2026-08-28T00:00:00Z,-5.0\n2026-08-28T01:00:00Z,1500.0\n"
    res = _validate_upload(csv_content, "rainfall.csv", "rainfall")
    assert res["total_rows"] == 2
    assert res["quarantined_rows"] == 2


def test_missing_required_column_failure():
    csv_content = b"random_col_1,random_col_2\n10,20\n"
    res = _validate_upload(csv_content, "rainfall.csv", "rainfall")
    assert res["status"] == "FAILED"
    assert len(res["issues"]) > 0
