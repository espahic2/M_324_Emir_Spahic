# 11e – CI/CD and GitHub Actions

## Setup and action security

Every external action is fixed to a complete commit SHA instead of a moving tag.
Before selecting an action, I review the source repository, its maintainer and
recent releases, the permissions it needs, its documentation and runtime
dependencies. A tag can be retargeted, whereas the full SHA fixes the exact action
code that GitHub executes.

I checked the selected release references with `git ls-remote` before adding them:

- `actions/checkout` v4.2.2: `11bd71901bbe5b1630ceea73d27597364c9af683`
- `actions/setup-node` v4.4.0: `49933ea5288caeca8642d1e84afbd3f7d6820020`
- Comment Pull Request v3:
  `24bffb9b452ba05a4f3f77933840a6a841d1b32b`
- `actions/cache` v4.2.3: `5a3ec84eff668545956fd18022155c47e93e2684`
- Scan Virus v0.20.1: `99c81e8991ad1074a14e5f22a21bce9be035e14e`

## Task 1 – Continuous integration

`.github/workflows/ci.yml` runs for pull requests targeting `main`, manually with
`workflow_dispatch`, and every Wednesday at 18:30 UTC. The scheduled check catches
changes that appear without a new pull request, while manual dispatch is useful for
testing the workflow.

The workflow grants only `contents: read` and uses GitHub's `ubuntu-latest` runner.
Checkout makes the repository available to the job; setup-node installs Node.js
22.13.0, which is compatible with the Docker-based Node 22 project environment.
All `run` commands operate in `Exercise2`: `npm ci` installs the lockfile-defined
dependency tree, then ESLint, Prettier and Mocha check the source code and tests.

`npm ci` is better for CI than `npm install` because it makes a clean, repeatable
installation from `package-lock.json` and never changes the lockfile. It fails when
the lockfile is absent or inconsistent with `package.json`, preventing unnoticed
dependency drift.

The workflow passed on [pull request #1](https://github.com/espahic2/M_324_Emir_Spahic/pull/1):
[CI run 44718542246](https://github.com/espahic2/M_324_Emir_Spahic/actions/runs/44718542246).
Before submission, test one lint failure, one formatting failure and one test
failure in separate commits before fixing each one.

## Task 2 – Automatic pull-request comment

`.github/workflows/pr-comment.yml` runs when a pull request is opened. Comment Pull
Request adds one acknowledgement message. The job receives only
`pull-requests: write`, the permission needed to create that comment, and does not
check out or run code from the pull request. It completed successfully for
[pull request #1](https://github.com/espahic2/M_324_Emir_Spahic/pull/1):
[workflow run 44718542216](https://github.com/espahic2/M_324_Emir_Spahic/actions/runs/44718542216).

## Task 3 – Gollum event

`.github/workflows/gollum.yml` is triggered by wiki page changes. It reads the
event payload and writes the page titles, URLs and action (created or edited) to the
workflow summary. This makes wiki changes visible in Actions. It requires the
repository wiki to be enabled; an empty page list is handled by a fallback summary.

## Task 4 – Marketplace action

The manual workflow `.github/workflows/custom_action.yml` uses the
[actions/cache](https://github.com/actions/cache) Marketplace action to restore npm's
download cache. This is relevant to development work because repeated dependency
installs can be much faster while `node_modules` is still installed cleanly with
`npm ci`. The workflow displays whether the cache was used and then runs the Mocha
tests. Run it via **Actions → Package cache check → Run workflow** and add the
verified workflow-run URL here.

## Task 5 – Malware scan

`.github/workflows/virus_scan.yml` is set for pushes and pull requests to `main`
and for manual execution. It checks out the repository and uses Scan Virus with
ClamAV updates to inspect the checked-out files. The final job has
`if: ${{ false }}`, so it is intentionally skipped after the initial scan test;
the skipped job is confirmed by
[workflow run 44718542268](https://github.com/espahic2/M_324_Emir_Spahic/actions/runs/44718542268).
Run the scan once before the job condition is added, then record the scan output.

A malware scanner looks for known patterns and signatures, so it cannot guarantee
that all malicious content is found. New, obfuscated, encrypted or external content
may evade detection, and false positives are possible. Use the harmless EICAR test
string in a temporary branch to test detection without using actual malware, then
remove it instead of merging it into `main`.
