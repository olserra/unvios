# ADR 0007 — CI: Build job in GitHub Actions

Date: 2025-11-04T00:00:00Z

Status: Accepted

## Context

Unit tests are useful, but a PR may still introduce changes that break the production build (for example: invalid Next.js pages, missing imports, or package changes). Running `pnpm build` in CI provides a stronger safety net by verifying the site compiles successfully.

## Decision

Add a `build` job to the GitHub Actions workflow `.github/workflows/test.yml` that:
- Runs after the `test` job (declared with `needs: test`).
- Restores the pnpm store cache and `.next/cache` to speed the build.
- Installs dependencies (`pnpm install --frozen-lockfile`) and runs a TypeScript check.
- Runs `pnpm build` (Next.js build).
- Saves caches for the pnpm store and `.next/cache` for future runs.

The job is intentionally separate from the unit-test job to keep quick feedback from tests while still ensuring compilation correctness.

## Rationale

- Running `pnpm build` on CI ensures PRs won't break production builds.
- Keeping the job separate allows parallelization and faster test feedback for contributors.
- Caching `.next/cache` and pnpm store reduces subsequent build time.

## How to verify

- Open a PR with a deliberate build-breaking change and confirm the `build` job fails while tests may pass.
- Check that `.next/cache` is restored on subsequent runs (build times should decrease).

## Migration / Rollback

- To rollback, remove the `build` job from the workflow.

## Next steps

- Consider adding environment configuration for production-like checks where needed (e.g., environment variables used at build-time).
- Add an optional deployment step that runs only when builds succeed on `main`.

---

Generated on 2025-11-04.
