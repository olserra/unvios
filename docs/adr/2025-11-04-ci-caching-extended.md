# ADR 0008 — CI: Extended pnpm caching paths

Date: 2025-11-04T00:00:00Z

Status: Accepted

## Context

The initial CI caching added pnpm store caching (`~/.pnpm-store` / `.pnpm-store`) and `.next/cache`. To further improve cache hits and cover different pnpm configurations across runners and OSes, we extend cached paths to include the pnpm virtual store and an alternate pnpm store location.

## Decision

Extend the GitHub Actions cache paths to include:
- `node_modules/.pnpm` — pnpm virtual store linked inside `node_modules` (project-local store)
- `~/.local/share/pnpm/store` — alternate global pnpm store location used by some pnpm setups

These paths are added to both the `test` and `build` jobs' cache restore/save steps.

## Rationale

- Some CI runs and pnpm versions populate packages in different store locations. Caching the virtual store (`node_modules/.pnpm`) improves cacheability for project-local installs and speeds up installs.
- Adding `~/.local/share/pnpm/store` increases the chance of cache hit for environments where pnpm uses that global store path.

## How to verify

- Run CI and observe `pnpm install` times after the first run; subsequent runs should be noticeably faster.
- Inspect the Actions job logs to confirm caches are restored and saved with keys matching the lockfile hash.

## Migration / Rollback

- Remove the extra paths from the workflow to rollback.

## Next steps

- Monitor CI for cache effectiveness and adjust cached paths if CI runner changes or pnpm defaults evolve.

---

Generated on 2025-11-04.
