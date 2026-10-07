# DebugArena

A production-incident debugging benchmark for evaluating whether engineers and AI coding agents can diagnose failures from logs, telemetry, code context, and infrastructure clues.

## What it demonstrates

DebugArena is intentionally designed around the type of ambiguous, multi-step engineering work used in technical evaluations: identify the likely root cause, choose the safest fix, and explain why competing hypotheses are weaker.

- React + TypeScript incident console
- TypeScript/Express scoring API
- 8 incident scenarios across backend, frontend, databases, auth, networking, and third-party APIs
- Evidence-first diagnosis workflow
- Weighted root-cause and remediation rubrics
- Deterministic scoring suitable for a public demo
- Docker and CI configuration

## Example incident

```text
Symptom: API p95 latency increases from 180 ms to 6.4 s
Evidence: PostgreSQL sequential scan on 4.8M rows
Change: new ORDER BY created_at DESC with tenant filter
Task: identify the root cause and remediation
```

Candidates are scored on diagnosis, remediation, verification, rollback safety, and explanation quality.

## Architecture

```text
React incident console
        |
        v
Express + TypeScript API
        |
        +--> incident registry
        +--> diagnosis rubric
        +--> scoring engine
```

## Run locally

```bash
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```

Backend defaults to `http://localhost:8080`; frontend to `http://localhost:5173`.

## Public-demo safety

DebugArena does not execute arbitrary shell commands or uploaded code. Incident evidence is curated and scoring is deterministic.

## Author

**Yeabsira Mesfin**  
Full Stack Software Engineer | M.S. Cybersecurity in Computer Science
