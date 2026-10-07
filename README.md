# DebugArena

DebugArena is an interactive production incident benchmark for testing debugging and root-cause analysis skills. It presents engineers or AI coding agents with realistic signals, logs, service context, plausible distractors, and production-safe remediations.

## What it demonstrates

- Production debugging and incident triage
- Log-driven root-cause analysis
- React + TypeScript engineering
- Deterministic scoring logic
- Automated tests with Vitest
- CI with GitHub Actions
- Reliability and secure remediation thinking

## Scenario examples

The benchmark covers retry storms, unstable React effects, refresh-token races, listener leaks, and cache-key design errors. Every incident includes evidence, an expected root cause, a safe remediation, and realistic wrong answers.

## Run locally

```bash
npm install
npm run dev
```

Tests and build:

```bash
npm test
npm run build
```

## Deploy

This project is a static React/Vite application and can be deployed directly to Vercel, Cloudflare Pages, Netlify, or GitHub Pages without a paid backend.

## Portfolio angle

DebugArena turns production-support experience into a visible engineering artifact. It shows the ability to reason from incomplete evidence, distinguish symptoms from causes, and validate the safest corrective action.

## Legacy history

This repository originally contained a weather application. Its Git history is intentionally preserved as part of the project's evolution.

## Author

Yeabsira Mesfin
