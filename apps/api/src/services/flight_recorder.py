"""
FloodGuard AI V9 — Flight Recorder Service
Maintains immutable chronological log of data arrivals, model executions,
risk updates, alert triggers, and operator actions.
"""
from datetime import datetime
from typing import Dict, Any, List, Optional
import uuid


class FlightRecorderService:
    def __init__(self):
        self._events: List[Dict[str, Any]] = [
            {
                "event_index": 1,
                "event_type": "DATA_ARRIVED",
                "timestamp": "2026-08-28T13:45:00Z",
                "title": "AWS-001 Telemetry Ingested",
                "description": "Ground station reported 48mm/3h precipitation on upper ridge.",
                "data_mode": "DEMO",
                "trace_id": "tr-flt-01",
                "evidence": ["AWS-001 rain gauge 48.0mm", "Barometric drop -2.4 hPa"],
            },
            {
                "event_index": 2,
                "event_type": "MODEL_RAN",
                "timestamp": "2026-08-28T13:45:05Z",
                "title": "Hybrid Risk Engine Execution",
                "description": "Multi-source fusion computed composite risk score 68.5/100.",
                "data_mode": "DEMO",
                "prediction_id": "pred-sunderbans-001",
                "risk_before": "MODERATE",
                "risk_after": "HIGH",
                "trace_id": "tr-flt-02",
                "evidence": ["Precipitation weight 0.35", "Soil saturation 82% weight 0.25"],
            },
            {
                "event_index": 3,
                "event_type": "ALERT_FIRED",
                "timestamp": "2026-08-28T13:46:00Z",
                "title": "Flash Flood Watch Dispatched",
                "description": "Automated alert generated for Sunderbans Nagar micro-watershed.",
                "data_mode": "DEMO",
                "alert_id": "alt-sunderbans-01",
                "trace_id": "tr-flt-03",
            },
            {
                "event_index": 4,
                "event_type": "GUIDANCE_ISSUED",
                "timestamp": "2026-08-28T13:46:30Z",
                "title": "User Exposure Safety Guidance",
                "description": "Evaluated demo user location at 0.9km from channel. Guidance Level 2 generated.",
                "data_mode": "DEMO",
                "trace_id": "tr-flt-04",
                "evidence": ["Candidate route: North Ridge Trail", "Blocked route: Riverbed NH Link"],
            },
            {
                "event_index": 5,
                "event_type": "OPERATOR_ACTED",
                "timestamp": "2026-08-28T13:50:12Z",
                "title": "Operator Acknowledgment & Shelter Standby",
                "description": "Duty Officer confirmed watch; placed Community High School on standby.",
                "data_mode": "DEMO",
                "operator_action": "ACKNOWLEDGE_AND_DISPATCH_STAGE1",
                "trace_id": "tr-flt-05",
            },
        ]

    def get_all_events(self) -> List[Dict[str, Any]]:
        return self._events

    def record_event(
        self,
        event_type: str,
        title: str,
        description: str,
        data_mode: str = "DEMO",
        prediction_id: Optional[str] = None,
        alert_id: Optional[str] = None,
        risk_before: Optional[str] = None,
        risk_after: Optional[str] = None,
        operator_action: Optional[str] = None,
        evidence: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        evt = {
            "event_index": len(self._events) + 1,
            "event_type": event_type,
            "timestamp": datetime.utcnow().isoformat(),
            "title": title,
            "description": description,
            "data_mode": data_mode,
            "prediction_id": prediction_id,
            "alert_id": alert_id,
            "risk_before": risk_before,
            "risk_after": risk_after,
            "operator_action": operator_action,
            "evidence": evidence or [],
            "trace_id": f"tr-flt-{uuid.uuid4().hex[:6]}",
        }
        self._events.append(evt)
        return evt
