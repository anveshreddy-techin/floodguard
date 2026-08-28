#!/usr/bin/env python3
"""
FloodGuard AI — Automated System & Preflight Health Check
Checks project directories, files, unit tests, and environment readiness.
"""
import os
import subprocess
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent


def check(name: str, condition: bool, detail: str = "") -> bool:
    status = "✅ PASS" if condition else "❌ FAIL"
    print(f"[{status}] {name} {f'({detail})' if detail else ''}")
    return condition


def run_healthcheck():
    print("=" * 70)
    print("         FLOODGUARD AI (SIH26192) — SYSTEM HEALTH CHECK")
    print("=" * 70)

    results = []

    # 1. Directory Structure Checks
    dirs = [
        "apps/api/src",
        "apps/web/src",
        "docs/research",
        "tests/unit",
        "ml/models",
        "data/uploads",
        ".agent",
    ]
    for d in dirs:
        results.append(check(f"Directory: {d}", (ROOT_DIR / d).is_dir()))

    # 2. Critical Files Checks
    files = [
        "docs/research/01_official_sih.md",
        "docs/research/02_existing_ecosystem.md",
        ".agent/PROJECT_STATE.md",
        ".agent/ARCHITECTURE.md",
        ".agent/DECISIONS.md",
        ".agent/KNOWN_LIMITATIONS.md",
        ".env.example",
        "docker-compose.yml",
        "Makefile",
    ]
    for f in files:
        results.append(check(f"File: {f}", (ROOT_DIR / f).is_file()))

    # 3. Unit Tests Execution
    print("\n[-] Running Automated Unit Test Suite...")
    test_run = subprocess.run(
        [sys.executable, "-m", "pytest", "tests/unit", "-q"],
        cwd=str(ROOT_DIR),
        capture_output=True,
        text=True,
    )
    test_passed = test_run.returncode == 0
    results.append(check("Automated Unit Test Suite", test_passed, test_run.stdout.strip()))

    print("=" * 70)
    all_ok = all(results)
    if all_ok:
        print("🌟 SYSTEM STATUS: ALL CHECKS PASSED. READY FOR DEMO EXECUTION.")
    else:
        print("⚠️ SYSTEM STATUS: SOME CHECKS FAILED. REVIEW OUTPUT ABOVE.")
    print("=" * 70)
    return 0 if all_ok else 1


if __name__ == "__main__":
    sys.exit(run_healthcheck())
