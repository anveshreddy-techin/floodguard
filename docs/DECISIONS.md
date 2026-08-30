# Architectural Decision Records (ADRs)

## ADR-001: Next.js Static Export (`output: 'export'`)
- **Context**: Disaster management tools must be deployable to edge CDNs with near-zero cold-start latency and work under intermittent connectivity.
- **Decision**: Next.js configured with `output: 'export'`. Dynamic routes (`/village/[id]`, `/state/[id]`) use `generateStaticParams()` with pure TypeScript data files.

## ADR-002: BaseProvider Contract with Honest NOT_CONFIGURED Status
- **Context**: External institutional APIs (IMD, CWC, ISRO) require bureaucratic MoUs and static IP whitelisting not available in hackathon environments.
- **Decision**: Avoid fake live APIs. Implement complete adapter code with clean fallbacks to deterministic DEMO datasets, clearly labeled with `data_mode: "DEMO"`.

## ADR-003: Candidate Evacuation Routes (Safety Disclaimer)
- **Context**: Real-time terrain safety cannot be guaranteed without physical field verification.
- **Decision**: Routes are labeled **"Candidate Lower-Exposure Routes — Safety Not Surface Verified"**. Never claim a route is guaranteed safe.

## ADR-004: Multi-Tiered Hazard Cascade Modeling
- **Context**: Himalayan flash floods are compound disasters triggered by cloudbursts, moraine breaches, or rockfalls.
- **Decision**: Implemented 13-stage physics and hazard detector modules rather than single-variable rainfall thresholding.
