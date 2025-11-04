# ADR 0006 — CI: pnpm cache for faster installs

Date: 2025-11-04T00:00:00Z

Status: Accepted

## Context

Installing dependencies in CI can be slow and causes longer feedback loops for contributors. This repository uses `pnpm` and has a lockfile (`pnpm-lock.yaml`). Caching pnpm's store between runs reduces install time significantly.

## Decision

Add restore/save cache steps around `pnpm install` in the GitHub Actions workflow `.github/workflows/test.yml`.

Implementation details:
- Use `actions/cache@v4` to cache the pnpm store directory (`~/.pnpm-store`).
- Cache key: `pnpm-store-<OS>-<hash(pnpm-lock.yaml)>`. Use restore-keys to allow partial matches.
- Restore cache before `pnpm install` and save afterwards.

## Rationale

- `pnpm` stores packages in a global store which is safe to cache between CI runs.
- Caching the store reduces network transfer and speeds up `pnpm install` on CI.
- This is non-invasive: it does not change runtime code or dev setup.

## How to verify

- Observe shorter `pnpm install` times on CI after the cache is populated.
- On first run the cache will be populated; subsequent runs should be faster.

## Migration / Rollback

- To rollback, remove the cache steps from the workflow file.

## Next steps

- Consider caching the pnpm store path and `node_modules` (if needed) for even faster runs.
- Consider adding caching for TypeScript build artifacts if build time becomes significant.

---

Generated on 2025-11-04.
