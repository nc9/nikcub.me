---
title: How I Run Coding Agents Unattended Without Merging Garbage
date: 2026-07-26T00:00:00+0000
excerpt: An autonomous loop that grinds through an issue backlog and deploys via deterministic checks, and the context discipline that makes it affordable.
summary:
  - A deterministic loop turns an issue backlog into reviewed, merged PRs autonomously — issues in, deploys out.
  - Every issue runs in its own git worktree with a fresh headless agent session, so nothing touches your checkout.
  - The merge decision is code, not a prompt — use the model for judgement, code for decisions.
  - Picking the right model per task and keeping each session's context small enabled cost savings.
status: draft
---

I'm going to go over the software development loop I use across projects using coding agents. It allows me to implement features and fixes safely, under supervision, and is implemented in a way that saves tokens by picking the right model for each task.

I have abstracted this process into a tool that I wrote which I'll introduce at the end - but I'm not asking you to use it, or even follow my own process exactly. Use your own coding agent to set up your own loop that suits you, or your team.

The key is to have a process and to enforce it with deterministic tooling.

## Overview

Here is how it works:

1. I use my coding agent to create issues - tagged as features, bug fixes, security issues, etc. I don't use built in plan modes but rather have planning sessions where the issue is the plan, with everything required for an agent to implement it. Each issue has acceptance criteria that are checked by the parent loop on review and merge.
2. I assign a harness, model and effort level to the task as well as priority, etc.
3. Once an issue is marked ready, my primary agent loop picks it up and spins up a subagent (claude can fire up codex, or opencode, and vice-versa) and runs the implementation from the plan. It operates in a worktree in one of a fixed pool of lanes.
4. Local review skill is run in a loop until satisfied by the parent monitoring agent, at which point a pull request is created
5. CI is run on the server along with cloud review (claude, greptile, bugbot, etc.)
6. Pull request is reviewed by a human and any comments or feedback left are polled by the implementing agent and updated
7. Once review is satisfied, the parent agent checks the work against the acceptance criteria and, if the issue isn't marked as sensitive, it is auto-merged
8. Sensitive issues (designated security, auth, payments, etc. - all options specified via labels) are human merged

I use a coding agent with a smart model (Fable/Sol class) at a high thinking level (high or xhigh) to instantiate and then monitor the loop. I use a separate session to manage the issues and docs that feed into the loop.

<div data-diagram="loop-sessions"></div>

The agent can work through the backlog unattended and continuously deploy into a development environment autonomously. Production deploys are still human managed, as are the designated sensitive tasks - but otherwise most work is engineering management with issues.

Delegating issues to specific models and effort levels means we can save a lot on costs - up to 80% or so, and implement faster without projects becoming a token inferno. 

I use Github issues and a private project board. I previously used Linear but found that native Github was fine and the cli worked better than the Linear MCP server[^1] - but that comes down to user preference.


## What a loop actually is

Not a chat that runs long. A loop is:

<div data-diagram="agent-loop"></div>

The important word is **headless**. Each issue gets a cold session with a tight prompt, and the session ends. Nothing accumulates. That single structural choice is the largest cost difference between "I let Claude work on my backlog" and a loop, and I'll come back to it.

State lives in three places that all survive a crash: the issue (the spec), the project board (what's claimed), the PR (the work). The loop process holds nothing important.

## Step 0: Engineering hygiene

Projects need a solid foundation to build on. It ensures quality and prevents drift. A good project setup contains:

- Worktree setup - this allows you to work on more than one issue at once 
- Repo docs in `{CLAUDE,AGENTS}.md` (symlink them) that set out the purpose of the project and the overall structure
- A solid architecture (layout, schemas, types, interfaces, etc.)[^2]
- Extensive unit testing and e2e tests 
- Both local hook and CI that run formatting / linting, typechecking, unit tests 
- Docs on how acceptance testing works (browser testing, cli testing, etc.)

Spinning up a fresh worktree per issue is heavy — a cold `bun install` every time, and none of your local env. So my loop tool keeps a small pool of persistent **lanes** (`lane-0`, `lane-1`, …) and reuses them: `node_modules` and build caches stay warm, and per-issue prep is salvage-anything-left-behind → reset → branch off the fresh base → incremental install. `worktree_lanes` in the config sizes the pool.

The agent loop knows a lane (a worktree) is free for the next issue when it's back on main.

<div data-diagram="worktree-lanes"></div>

## Step 1: The board is the control plane

Setup an issue board with status levels as the primary control plane for the issue loop.

<div data-diagram="audit-board"></div>

Each issue moves through these states, and the loop only ever pushes it downward:

<div data-diagram="issue-states"></div>

Draft issues is where our planning and research sessions take notes and we work to get them to ready. We provide metadata to the main loop with issue sections and labels. 

Here is what a ready issue looks like:

```markdown
# oauth: refresh-token grace window (#1055)

Expired access tokens inside the grace window currently 401. Planning session
notes: the check lives in `packages/auth/src/verify.ts`, the window constant
in `packages/auth/src/config.ts`. Approach agreed: compare against
`issued_at + ttl + grace`, no schema change.

## Acceptance Criteria

- [ ] a refresh inside the 60s grace window returns a new access token
- [ ] a refresh outside the window 401s with `token_expired`
- [ ] unit tests cover both paths

Depends on #1042
```

**If your issue can't fit on your screen then it is too detailed and should be broken up**. Using epics and sub-issues is an ideal way of breaking issues up in a sequence with dependencies.

The title is scoped and imperative. The body is the plan — everything the implementing session needs, because that session starts cold and reads nothing else. The checklist is graded verbatim at merge time, so every box is something a reviewer can settle by reading the diff — "tests pass" belongs to CI, "the code is more robust" belongs nowhere.

Labels carry everything else:

- **Type** — `bug`, `enhancement`, `security`, `tech-debt`, `documentation` — for humans and reporting; the loop doesn't route on these
- **Priority** — `P0`–`P3` — required; sets queue order
- **Size** — `size:XS`–`size:XL` — required; an unsized issue defaults to the expensive model, which is the right way round
- **Routing** — `loop:impl-runner-*` (claude/codex/opencode), `loop:impl-model-*`, `loop:impl-effort-*`, plus the matching `loop:review-*` trio for the rubric grader — six independent axes, all optional, each overriding the config default for just that issue
- **Sensitivity** — `security`, `auth`, `payments`, or anything else you name in config — parks the merge for a human no matter how green everything is (more on this in the gate section)

The contract each issue must satisfy:

- an `## Acceptance Criteria` checklist — these become the merge rubric verbatim
- optional `Depends on #N` for ordering
- `loop:*` labels for model, effort and runner policy (see brlow)

An issue sitting in `Ready` without acceptance criteria is automatically moved to `Blocked: needs-criteria` with a comment. That sounds bureaucratic. It's the highest-leverage rule in the system: **an issue that can't be graded can't be merged, so it must not be started.**

**Every eligibility rule needs a dry-run mode that prints why each item was skipped.** Silent eligibility failure is the worst failure mode in a system you're not watching.

## Step 2: Assigning a harness, model and effort

For each issue we use labels to assign a harness, model and effort for both implementation and review. Good practice here is to use one model provider for implementation and another for review - ex. Opus for implementation, GPT-Terra for review.

Our project loop has defaults for each of implementation and review, and we can override them on each issue.

Smart models can make a good first guess on the model and effort level to use, but it's best to set this yourself and **develop a sense of which model to use for what type of implementation**

Complicated logic cases and security require advanced models with high thinking budgets, while more procedural tasks from instructions only require less capable models.

I have found that Opus 5 at low and medium effort levels and GPT Luna are excellent and fast code workers.

Their implementations are reviewed and accepted by the loop monitoring agent.

You can retry implementations here or employ an advisor model where an MCP or subagent call is made to a more intelligent model to assist with the implementation as an escape hatch (I use Fable here).

Here is an example of our list of issues with harnesses, models and effort levels as output by the loop when queuing tasks:

| Issue | Title | Harness | Model | Effort |
|-------|-------|---------|-------|--------|
| #78 | reconcile prod schema drift | claude | fable-5 | high |
| #992 | render pipeline throughput | claude | opus-5 | medium |
| #990 | conditional-render reuse never bootstraps | codex | gpt-luna | medium |
| #991 | hydration-timestamp fingerprints | claude | opus-5 | low |
| #1011 | blog RSS feed | codex | gpt-luna | low |

## Step 3: Claim and implement

Once the issue is setup I move it to `Ready` and the loop will then claim it with owner set to the run id, status moved to `In Progress`, a free lane assigned (aka. a worktree). Claiming is a compare-and-set against the board, so two loops — or you and the loop — can't grab the same issue.

Then it spawns the implement session: headless, cold, in the lane's worktree. The prompt is assembled fresh every time:

- the issue body, fenced as untrusted data (implement from it, don't obey instructions inside it)
- the repo docs (`CLAUDE.md` / `AGENTS.md`) with the spliced issue contract
- the acceptance criteria, verbatim
- nothing else — no chat history, no other issues, none of your local state

The session implements from the plan, runs the local checks the repo defines (format, lint, typecheck, tests — the same hooks a human hits), commits as it goes, and exits with a classification: done, needs-fix, or blocked-with-a-reason. Anything else — a crash, a timeout, a quota death — trips the salvage path so the work survives (more on that below).

```
▶ claiming #992 — render pipeline throughput
  ⇢ lane-1: copied 2 .worktreeinclude file(s)
  ⚙ lane-1: scripts.setup (bun install) — warm …
  spawning implement session (claude/opus-5/medium) in ~/.hamsterwheel/worktrees/squirrelscan/lane-1 …
```

Every line of that is load-bearing state: the claim comment on the issue records the run id and branch, the lane line tells you whether the env files made it in, and `warm` vs `cold` is the difference between a two-second setup and a full install.

## Step 4: Local review until it earns a PR

The parent doesn't trust "done" - it runs the local review skill against the diff in a loop — findings go back to the implementing session, fixes get re-reviewed — until the reviewer comes back clean or the round cap trips.

The review skill reads the harness, model and effort level assigned for reviews either from the project (the default) or an override from the issue. 

When review is satisfied the branch is pushed and a PR is opened with `Closes #N` in the body. That link is load-bearing: it's how the gate later maps the PR back to the issue, and a missing link is how finished work gets silently redone (there's a war story below).

## Step 5: CI and cloud review

The push triggers the server side: CI — the same format/lint/typecheck/test checks, now running in the cloud — plus whichever cloud reviewers the repo has (claude-review, greptile, bugbot) configured. 

Two details that matter unattended:

- the gate reads one configured bot's PR comment for blocking findings — severity tags, not vibes; a `(high)` finding blocks, a nit doesn't
- ask reviewers for structured output where the CLI supports a schema — a JSON verdict beats parsing prose

<div data-diagram="pr-checks"></div>

## Step 6: Human review, polled

Any human can comment on the PR while all this is happening. The implementing agent polls for new comments, applies the feedback, and pushes — which re-triggers CI and a re-review of the new diff.

A mechanic worth knowing: **a PR comment doesn't trigger re-review, only a push does.** So rebutting a finding with a `file:line` citation is free — no push, no new round, the loop terminates. [MOVE? this also lives in "The reviewer never converges" — keep it in one place.]

Here's the cycle on a real finding — the footer regression from the batch at the end. The cheap-tier session had narrowed a `Record<string, …>` and deleted the runtime fallback covering for it; all twelve CI checks were green. The reviewer's comment:

> **(high)** `SOCIAL_DISPLAY` is typed `Record<SocialName, number>`, but `siteConfig.socials` has no `as const`, so `SocialName` widens back to `string` — the narrowing checks nothing, and this PR removed the runtime fallback that was masking it. Add `as const` and derive the key union, or restore the fallback.

The loop feeds it back to the implementing session and pushes the fix:

```
  review round 1/4: 2 blocking finding(s) — fixing…
  spawning implement session (claude/haiku-4.5/low) in ~/.hamsterwheel/worktrees/squirrelscan/lane-0 …
  gate #1086 PR #1099: waiting for CI…
```

The push re-triggers CI and a fresh review of the new diff — the same signal that raised the finding is what clears it. A human's comment rides the identical cycle; the only difference is who typed it.

## Step 7: The gate is code, not a prompt

This is the biggest takeaway of this process. The final merge decision is a pure function over a handful of signals:

```ts
mergeDecision({
  ciGreen,          // CI conclusion on the head commit
  humanRules,       // fired [[human]] rules — any entry parks the PR for a human
  changesRequested, // a reviewer's standing "Request changes" — outranks config
  reviewRequired,   // review.mode === "required"
  reviewObserved,   // a review actually covers the head — silence is not approval
  blockingReview,   // count of (high)/(critical) findings
  rubricPass,       // the criteria grade, credited from CI where CI owns them
})
```

No model is ever asked "should this merge?" Models grade the rubric — a judgement call over English acceptance criteria, which is a genuinely good use for them. 

But reconciling that grade with CI, human-review rules and review findings is deterministic, unit-tested code, evaluated in a fixed order — CI → human rules → changes-requested → review provenance → findings → rubric — every heuristic erring toward blocking. 

A false positive costs a human a glance. A false negative merges a bad PR.

Never auto-merged regardless of how green things look:

- anything matching a `[[human]]` rule in the loop config — named tripwires on changed paths and/or issue labels. The canonical (and required) one is a DB-migration path rule (a human applies prod schema; auto-deploying code ahead of the schema breaks prod); add label rules for security/auth/payments or path rules for crypto code and the same parking applies
- anything with a high or critical review finding (nits don't block) - such as security, auth, payment modules, etc. 

### The lesson underneath: if a decision must hold, it cannot live in a prompt

The rubric grader runs read-only — it can't execute tests. So it started failing criteria like "typecheck passes" for lack of execution evidence, even when CI had already proven them green. My favourite artifact from the whole project is a grader marking a criterion unmet with the evidence:

> "execution blocked in grader env — no concrete pass evidence"

while in the same verdict conceding:

> "static analysis strongly suggests clean."

Telling it not to do that in the prompt did not work. It reduced the frequency, which is worse than not working, because it looks fixed.

The actual fix has two layers and the second is the point:

1. Tell the grader what CI already verified and instruct it not to re-judge those criteria.
2. **Also** apply that correction deterministically in code afterward.

Layer 1 is advisory — you're asking a non-deterministic system to remember an instruction. Layer 2 makes it true. Any time correctness depends on a model following an instruction, rather than the quality of its output depending on it, a deterministic backstop is missing.

## Step 8: Sensitive work is merged by a human

Auto-merge is the default, not the rule. Anything matching a `[[human]]` rule parks as `Blocked: needs-human` with the PR green and waiting: DB migrations (the canonical one — a human applies prod schema), security/auth/payments labels, crypto paths, whatever you name in config. The loop did all the work; a person does the last click.

Production deploys are the same shape. The loop continuously deploys into a development environment; promotion to prod is a human action on a green build.

## Splitting this out as an app

I split my loop implementation and config out as a separate app called `hamsterwheel` so that I can use it across projects. I've published it on npm at `hamsterwheel` and on Github at [https://github.com/nc9/hamsterwheel](https://github.com/nc9/hamsterwheel)

It is everything in this post as a CLI over a repo and a board: the driver (claim → lane → implement → PR → review rounds → gate → merge or Blocked-with-a-reason), the merge gate as pure tested code, the runner abstraction (claude/codex/opencode with per-issue model and effort routing), the salvage paths so no work is ever lost, an optional Docker sandbox, and an operator skill so your agent knows how to drive it. Everything mutating hides behind `--execute`, every command takes `--json` (one object on stdout, logs on stderr), and nothing is interactive — it's built to be operated by an agent, not a human at a keyboard.

To install:

```bash
npm i -g hamsterwheel              # node or bun, no runtime lock-in
npx skills add nc9/hamsterwheel    # the operator skill, for the supervising agent
```

Then set it up inside the project. `init` is idempotent and prints every mutation before making it (`--dry-run` to preview):

```
$ hamster init
🐹 hamster init

Prerequisites:
  ✓ git                repo, origin github.com/acme/backend
  ✓ gh auth            logged in, project scope present
  ✓ runners            claude, codex on PATH
  ✓ docker             available (--sandbox ready)

Board (acme):
  + CREATE Projects v2 board "backend Loop" under acme
  + fields: Status (Draft…Done) · Owner · Blocked reason

Labels (acme/backend):
  + CREATE 27 label(s): P0, P1, P2, P3, size: XS, size: S …

Setup script: "bun install" (detected from bun.lock)

Config:
  + WRITE /work/backend/hamsterwheel.toml

.worktreeinclude: scaffolded (.env, .dev.vars detected)
CLAUDE.md / AGENTS.md: issue contract spliced

Next: edit the `[[human]]` rules in hamsterwheel.toml for your repo, move an
issue to Ready, then run `hamster plan`.
```

(The contract is spliced into both doc files deliberately: Claude reads `CLAUDE.md`, Codex reads `AGENTS.md`, and a contract only one of them can see is a contract only one of them follows.)

Everything repo-specific lives in that one file. The part worth thinking hardest about is the `[[human]]` rules — the named tripwires that no amount of green can auto-merge past. Err wide: a false positive costs you a glance, a false negative merges something a human should have seen.

```toml
repo = "acme/backend"
base_branch = "main"
worktree_lanes = 2                # the persistent lane pool from Step 0

[scripts]
setup = "./scripts/setup.sh"      # runs in the lane on every acquire; argv-exec'd, NOT a shell

# ---- never auto-merged: any hit parks the PR as Blocked: needs-human ----
[[human]]
name = "prod-migration"           # a human applies prod schema; code must not outrun it
paths = "(^|/)(migrations|drizzle)/"

[[human]]
name = "ci-and-deploy"            # workflow edits can rewrite the gate that guards them
paths = "^\\.github/(workflows|actions)/"

[[human]]
name = "auth-and-billing"         # by changed path…
paths = "(^|/)(auth|billing|payments|crypto)/"

[[human]]
name = "sensitive-domain"         # …or by issue label, whichever fires first
labels = ["security", "auth", "payments"]

[project]
number = 1

[runners.implement]
runner = "claude"                 # claude | codex | opencode
strong_model = "opus"             # P0/P1 or size >= M
cheap_model  = "sonnet"           # XS, or docs/test/chore-shaped
effort = "high"

[review]
mode = "optional"                 # CI + rubric carry the gate; a review is honoured, not required
bot = "claude[bot]"               # whose PR comment is read for (high)/(critical) findings
```

Then fire up the supervisor — the smart-model session from the diagram at the top. The skill teaches it the commands, the board vocabulary, and the failure playbook, so the prompt is just intent:

```bash
$ claude
> Work the backlog with hamsterwheel. Start with `hamster plan` and tell me
> what it would pick and why. Then `hamster run --execute --json` and watch
> it: for every Blocked item, tell me the reason and what I'd need to decide.
> If the driver dies, reconcile from repo state — never re-run a mid-gate
> issue. Don't touch anything a [[human]] rule parked.
```

The loop init above is implemented as a slash command.

The supervisor narrates claims and merges as they happen, and everything it reports comes from the structured `--json` events, not vibes. The read-only commands are its instruments: `plan` (the queue and every skip reason), `triage` (what needs a human), `reconcile` (in-flight items with no live session behind them). Start a new repo with `--pr-only` — the identical pipeline, stopped at the open PR, so you inspect real output before the merge path runs unsupervised.

## The actual lesson

Every expensive thing in an agent loop has a cheap deterministic equivalent, and the engineering is finding them:

| expensive | cheap |
|---|---|
| asking a model to decide the merge | a pure function over a handful of signals |
| a long conversation | a cold session and files on disk |
| re-deriving the repo layout | 30 tokens of written-down fact |
| the frontier model on a typo fix | a size label and a heuristic |
| an unbounded review loop | a cap of four |

Use the model for judgement. Use code for decisions. A good loop is mostly the second thing.

## The Human Role

With the software factory loop setup, the human role becomes:

1. Writing issues alongside a coding agent - research, spec, and file
2. Move issues to ready on the board so they can be picked up by the loop
3. Review PRs when necassery 
4. human acceptance tasks when prompted by the loop
5. Production deployments

The role is now software management.

[^1]: This is a rare example of where I've found a cli option to work better than the MCP

[^2]: An environment of good code usually leads to agents writing better code.
