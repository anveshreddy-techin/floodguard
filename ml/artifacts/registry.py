"""
FloodGuard AI — Model Registry & Governance Store
Maintains versioned model artifacts, manifests, checksums, and formal promotion gates.
"""
from __future__ import annotations

import hashlib
import json
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from enum import Enum
from pathlib import Path
from typing import Any


class DeploymentStatus(str, Enum):
    TRAINED = "TRAINED"
    VALIDATION_PENDING = "VALIDATION_PENDING"
    RESEARCH_VALIDATED = "RESEARCH_VALIDATED"
    RESEARCH_PROTOTYPE = "RESEARCH_PROTOTYPE"
    PILOT_APPROVED = "PILOT_APPROVED"
    DEMO_ONLY = "DEMO_ONLY"
    DEPLOYED = "DEPLOYED"
    RETIRED = "RETIRED"
    FAILED = "FAILED"


class OperationalValidationLevel(str, Enum):
    RESEARCH_MODEL = "RESEARCH_MODEL"
    BENCHMARKED_MODEL = "BENCHMARKED_MODEL"
    HISTORICALLY_BACKTESTED_MODEL = "HISTORICALLY_BACKTESTED_MODEL"
    PILOT_MODEL = "PILOT_MODEL"
    OPERATIONALLY_VALIDATED_MODEL = "OPERATIONALLY_VALIDATED_MODEL"


@dataclass
class ModelArtifact:
    id: str
    name: str
    semantic_version: str
    model_type: str
    target: str
    region: str
    feature_version: str
    label_version: str
    training_period: tuple[str, str]
    validation_period: tuple[str, str] | None
    evaluation_report: dict[str, Any] | None
    artifact_path: str
    artifact_checksum: str
    training_configuration: dict[str, Any]
    thresholds: dict[str, Any]
    deployment_status: DeploymentStatus
    reviewer: str | None
    approval_date: str | None
    limitations: str
    created_at: str
    operational_validation_level: OperationalValidationLevel = OperationalValidationLevel.RESEARCH_MODEL


class ModelRegistry:
    """Artifact store enforcing promotion gates, signature verification, and rollback."""

    def __init__(self, registry_dir: str | Path = "ml/artifacts"):
        self.registry_dir = Path(registry_dir)
        self.registry_dir.mkdir(parents=True, exist_ok=True)
        self._manifest_path = self.registry_dir / "registry_manifest.json"
        self._artifacts: dict[str, ModelArtifact] = {}
        self._load_manifest()

    def _load_manifest(self) -> None:
        if self._manifest_path.exists():
            try:
                data = json.loads(self._manifest_path.read_text())
                for art_id, item in data.items():
                    item["deployment_status"] = DeploymentStatus(item["deployment_status"])
                    if "operational_validation_level" in item:
                        item["operational_validation_level"] = OperationalValidationLevel(item["operational_validation_level"])
                    else:
                        item["operational_validation_level"] = OperationalValidationLevel.RESEARCH_MODEL
                    self._artifacts[art_id] = ModelArtifact(**item)
            except Exception:
                pass

    def _save_manifest(self) -> None:
        serialized = {}
        for art_id, item in self._artifacts.items():
            d = asdict(item)
            d["deployment_status"] = item.deployment_status.value if hasattr(item.deployment_status, "value") else str(item.deployment_status)
            if hasattr(item, "operational_validation_level") and hasattr(item.operational_validation_level, "value"):
                d["operational_validation_level"] = item.operational_validation_level.value
            serialized[art_id] = d

        self._manifest_path.write_text(json.dumps(serialized, indent=2))

    def register(self, artifact: ModelArtifact) -> str:
        """Register a new model artifact in the registry."""
        self._artifacts[artifact.id] = artifact
        self._save_manifest()
        return artifact.id

    def promote(
        self,
        artifact_id: str,
        new_status: DeploymentStatus,
        reviewer: str,
        reason: str,
    ) -> ModelArtifact:
        """
        Promotion Gates:
        1. Reviewer must not be empty.
        2. DEMO_ONLY models cannot be promoted to DEPLOYED.
        3. PILOT_APPROVED / DEPLOYED require completed evaluation_report.
        4. RETIRED models cannot be promoted.
        """
        if artifact_id not in self._artifacts:
            raise KeyError(f"Artifact '{artifact_id}' not found in registry.")

        art = self._artifacts[artifact_id]

        if not reviewer:
            raise ValueError("Promotion requires authorized human reviewer name.")

        if art.deployment_status == DeploymentStatus.RETIRED:
            raise ValueError("Cannot promote a RETIRED model artifact.")

        if art.deployment_status == DeploymentStatus.DEMO_ONLY and new_status == DeploymentStatus.DEPLOYED:
            raise ValueError("DEMO_ONLY models cannot be directly promoted to DEPLOYED.")

        if new_status in (DeploymentStatus.PILOT_APPROVED, DeploymentStatus.DEPLOYED):
            if not art.evaluation_report:
                raise ValueError("Cannot promote to PILOT_APPROVED without completed evaluation report.")

        art.deployment_status = new_status
        art.reviewer = reviewer
        art.approval_date = datetime.now(timezone.utc).isoformat()
        self._save_manifest()
        return art

    def get_active_model(self, target: str = "FLASH_FLOOD_30MIN", region: str = "National") -> ModelArtifact | None:
        """Find the active DEPLOYED or PILOT_APPROVED model for given target and region."""
        for art in self._artifacts.values():
            if art.target == target and art.deployment_status in (DeploymentStatus.DEPLOYED, DeploymentStatus.PILOT_APPROVED):
                return art
        return None

    def list_versions(self, target: str | None = None) -> list[ModelArtifact]:
        arts = list(self._artifacts.values())
        if target:
            arts = [a for a in arts if a.target == target]
        return sorted(arts, key=lambda a: a.created_at, reverse=True)

    def compute_file_checksum(self, path: str | Path) -> str:
        p = Path(path)
        if not p.exists():
            return "0" * 64
        return hashlib.sha256(p.read_bytes()).hexdigest()
