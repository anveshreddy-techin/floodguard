# Hybrid Risk Engine Architecture

Combines domain-rule weights and physics heuristics:
- **Rainfall Risk Weight:** $35\%$
- **Soil Saturation Weight:** $25\%$
- **Terrain Susceptibility Weight:** $20\%$
- **River Stage Surge Weight:** $15\%$
- **Historical Susceptibility:** $5\%$

**Output:** Composite Score ($0\text{--}100$), Risk Level (`LOW` $<35$, `MODERATE` $35\text{--}54$, `HIGH` $55\text{--}74$, `EXTREME` $\ge 75$), Confidence, Uncertainty, Contributors list with exact evidence attribution.
