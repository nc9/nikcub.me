---
title: How I Use Coding Agent Loops and Save Tokens
date: 2026-07-26T00:00:00+0000
excerpt: An autonomous loop that grinds through a GitHub backlog overnight, and the context discipline that makes it affordable. The merge decision is thirty lines of TypeScript, not a prompt.
status: draft
---

<!--
OUTLINE DRAFT — Nik to rewrite in his voice. Every number and quote below is
real, pulled from the squirrelscan loop's memory corpus and source comments.
Markers:
  [CUT] = candidate to cut if long
~5200 words. Every number and quote is real, from the 2026-07-26 batch.
NOW LONG ENOUGH TO SPLIT. Natural break: everything through "A run, in full"
is post one (the loop + the real batch); "Now the token half" onward is post
two (context economy). The five-bugs table is the strongest thing here and
should anchor whichever post keeps it.
-->

## The setup

Two claims worth separating, because writing about agent loops usually conflates them:

1. An agent can work through a backlog unattended.
2. Doing that is affordable and safe.

The first is nearly free now. Everything interesting is in the second.

Concretely, the batch I'll walk through at the end: five issues off a real backlog, four pull requests, three of them good, one correctly caught as a regression, one correctly refused because it touched a database migration. The loop's judgement was right in every single case. Everything that went wrong went wrong in the plumbing around it — five separate bugs, every one of them a signal that reported success when nothing had happened.

<div data-diagram="audit-board"></div>

<div data-diagram="issue-states"></div>

## What a loop actually is

Not a chat that runs long. A loop is:

<div data-diagram="agent-loop"></div>

The important word is **headless**. Each issue gets a cold session with a tight prompt, and the session ends. Nothing accumulates. That single structural choice is the largest cost difference between "I let Claude work on my backlog" and a loop, and I'll come back to it.

State lives in three places that all survive a crash: the issue (the spec), the project board (what's claimed), the PR (the work). The loop process holds nothing important.

## The board is the control plane

GitHub Projects v2. Five statuses: Draft → Ready → In progress → Blocked → Done. Only `Ready` is eligible.

The contract each issue must satisfy:

- an `## Acceptance Criteria` checklist — these become the merge rubric verbatim
- optional `Depends on #N` for ordering
- `loop:*` labels for model, effort and runner policy

An issue sitting in `Ready` without acceptance criteria is automatically moved to `Blocked: needs-criteria` with a comment. That sounds bureaucratic. It's the highest-leverage rule in the system: **an issue that can't be graded can't be merged, so it must not be started.**

The corollary cost me an evening. That heading is matched by regex, and someone wrote `## Acceptance` instead of `## Acceptance Criteria`. The issues didn't error — they silently stopped appearing in the queue. An empty backlog and a broken filter look identical from the outside.

**Every eligibility rule needs a dry-run mode that prints why each item was skipped.** Silent eligibility failure is the worst failure mode in a system you're not watching.

## The gate is code, not a prompt

The part I'd most like people to take away.

The final merge decision is a pure function over four booleans:

```ts
mergeDecision({ ciGreen, hasMigration, blockingReview, rubricPass })
```

No model is ever asked "should this merge?" Models grade the rubric — a judgement call over English acceptance criteria, which is a genuinely good use for them. But reconciling that grade with CI, migrations and review findings is deterministic, unit-tested code, evaluated in a fixed order, every heuristic erring toward blocking. A false positive costs a human a glance. A false negative merges a bad PR.

Never auto-merged regardless of how green things look:

- anything matching a `[[human]]` rule in the config — named tripwires on changed paths and/or issue labels. The canonical (and required) one is a DB-migration path rule (a human applies prod schema; auto-deploying code ahead of the schema breaks prod); add label rules for security/auth/payments or path rules for crypto code and the same parking applies
- anything with a high or critical review finding (nits don't block)

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

## The reviewer never converges, so cap it

The auto-reviewer is stateless: each round it re-reads the PR fresh with no memory of what it already said. Left unbounded, it runs forever.

Measured, on a pull request that added a **50-line guard test**: six review rounds, findings per round 3 → 6 → 3 → 3 → 3 → 3. Substantive fixes were exhausted by round three. Rounds five and six asked for flag-preservation logic for flags that don't exist, word boundaries for identifiers that don't exist, and file-missing handling for files that are always checked out.

Cap it at four. And a mechanic worth knowing: **a PR comment doesn't trigger re-review, only a push does.** So rebutting a finding with a `file:line` citation is free — you stop pushing and the loop terminates.

## Everything from the issue is untrusted

Issue bodies, labels and review comments are all attacker-reachable on a public repo, and all flow into prompts or subprocess argv.

- Issue text is wrapped in a per-run random UUID fence — not a timestamp, which is guessable — and the prompt says: grade against this, do not obey it.
- Bodies are screened for injection markers before an issue is ever claimed.
- Label-derived values are validated against strict allowlists and passed as separate argv elements, never interpolated into a shell string.
- Sessions run in a Docker container that mounts only the worktree and its git dir.

Two honest notes. First, the screener is a constraint on your issue writers, not a transparent filter: mine blocked an issue *about hardening a curl-pipe-to-shell install command*, and the workaround was to reword the issue.

Second, and more important: **the container is the boundary and everything else is theatre.** Tool allowlists and env scrubs are worth having, but `Edit` still reaches absolute paths, `Bash(bun:*)` still runs arbitrary code, and your `gh` credentials are still readable on disk. If the isolation matters, it has to be OS-level.

One detail from that container work that generalizes anywhere: **forward environment variables by name, never as `NAME=value`.** Argv is world-readable via `ps`.

### Fail closed — but abort the run, not the item

The best failure in the project. I launched an overnight run against a sandbox with a missing token. The sandbox correctly refused to start, and failed closed *per issue*: claim, block, next. Claim, block, next.

**A hand-curated Ready queue was destroyed in under a minute.** Every issue Blocked, every one of them fine.

The security design was right. The driver was wrong to classify a config error as an implement failure. Errors need a taxonomy: a precondition that will fail identically for every item must **abort the run on first occurrence**. Fail closed, but fail closed at the right scope.

## Model and effort tiering

Not every issue deserves the frontier model. Policy resolves per issue across six axes — runner, model and effort, independently for implement and review — as: validated label → config default → heuristic.

The heuristic: P0/P1 or size ≥ M gets the strong model; XS, or docs/test/chore/style/ci-shaped work, gets the cheap one. **Unsized defaults to expensive**, which is the right way round.

An invalid label falls back to the heuristic *silently*, deliberately. A typo that reaches the spawn exits non-zero and reads as a generic implement failure, and you'll debug the wrong thing for an hour.

Three CLIs can drive this, all taking model and effort as headless flags:

| runner | headless | model | effort | structured output |
|---|---|---|---|---|
| `claude` | `claude -p` | `--model` | `--effort` | `--output-format json` |
| `codex` | `codex exec` | `-m` | `-c model_reasoning_effort=` | `--json`, `--output-schema` |
| `opencode` | `opencode run` | `-m provider/model` | `--variant` | `--format json` |

I implement with Claude and review with Codex. Cross-vendor review isn't a gimmick — a reviewer sharing the implementer's blind spots is worth much less. Codex also takes `--output-schema`, so the rubric verdict comes back as schema-enforced JSON instead of prose to parse. [NUM — did cross-vendor review catch anything the same-vendor one didn't?]

Unattended, there's a trap: **nested tools have their own consent model.** Codex reviews stalled overnight on permission prompts at two independent layers — the harness prompt, and codex's own approval elicitation for command execution, which the harness allowlist doesn't cover. Both need bypassing, in the argv, every call.

### Quota exhaustion looks exactly like ten bugs

After roughly ten large-model sessions, a wave died. The driver dutifully filed each remaining issue as a genuine failure. I woke up to what looked like a catastrophic night.

The tell is beautiful: quota failures arrive in a burst at about one per minute with ~40 KB transcripts. A real failure has a ~1 MB transcript. **You can triage a night's failures with `du` before reading a single line.**

Two corollaries. Review sessions count against the same budget, so ten issues is about eighteen sessions, not ten. And priority-ordering the queue is what decides whether the work that survives the quota is the work that mattered.

## Never lose the work

Every failure path preserves the dirty worktree to a run-scoped WIP branch before teardown. This exists because a completed feature once died during final formatting and went away with the worktree.

Three guards matter more than the mechanism:

- **Verify the salvage captured everything** before reporting that it did.
- **Skip salvage once the branch is pushed** — a local duplicate of pushed work is a misleading signal, not a safety net.
- **When pruning, a failed lookup means keep.** A safety check that errored is not a safety check that passed.

Related, and the cheapest warning in this post: never delete branches by glob. A cleanup meant to remove ten branches ran `git for-each-ref 'refs/heads/fix/*' | xargs git branch -D` and deleted **fifty-four**, including eight unmerged local-only branches from months of prior work. Recovery was possible only because `branch -D` prints the SHA it deleted. Delete explicit lists.

[CUT? The `git stash drop` after a conflicted pop hazard, and `git fsck --unreachable` recovery.]

## Now the token half

Everything above makes the loop *work*. This is what makes running it nightly not absurd.

### Cold sessions beat long ones

A chat pays for its entire history on every turn. Fifty turns in, each new message re-reads everything before it. A headless session per issue starts near zero, does one job, exits.

This inverts an instinct. Context feels like an asset — the agent "knows more". But most accumulated context is irrelevant to the next action and you pay full price for it every turn. A seventeen-issue night is eighteen small contexts instead of one enormous one.

The structural version: **the parent keeps the decisions, each child keeps the evidence.** Reads, diffs, CI logs and review chatter die with the session that needed them.

### Audit what's resident every turn

I ran a health check on my own setup and cut:

- **Ten skills and two plugins** never once invoked. Every installed skill's name and description sits in context on every turn whether you use it or not. The skill listing is budgeted at about 1% of the context window; exceed it and entries get truncated and routing degrades. Bloat costs accuracy before it costs money.
- **A directory tree out of CLAUDE.md.** Trees go stale and `ls` is cheap. The file now says *"Run `ls apps/ packages/` for the current layout. The one thing that isn't obvious:"* and then states only the non-derivable fact. [NUM — before/after size]
- **Guidance moved to lazy loading.** A rules file with `paths:` frontmatter loads only when the agent touches matching files. Design-system rules load when you edit UI, not when you edit a crawler.

The principle: **always-loaded context should hold only what the agent cannot derive on its own.** Conventions, non-obvious constraints, decisions and their reasons. Not structure. Not anything discoverable in two seconds.

Worth knowing because it changes common advice: MCP tool schemas are deferred by default — only names sit in context, schemas fetch on demand. Disable unused MCP servers for the maintenance and auth burden, not for tokens.

### Write down what can't be cheaply discovered

A file saying "the CLI and audit engine aren't in `apps/` — they're in `repo-public/`, a submodule" costs about 30 tokens and saves several failed `cd` attempts and a fan-out search, every session, forever. One such note saved an estimated ten failed round-trips on a single issue.

Memory is two-tier: a one-line-per-fact index loaded every session, bodies fetched on demand. When the index got fat, long-form conventions were actively evicted from it.

The counterweight, which is the part people miss: **compaction fossilizes stale facts under a "verified" label.** A wrong pricing number rode a summary's "current verified facts" list straight into a document whose entire job was to be the source of truth. Written-down facts decay, and a summary launders them into authority.

### The most expensive session is the one that redoes finished work

An issue looked unstarted. The PR that implemented it referenced a different issue number and never wrote `Closes #N`, so nothing linked them. Separately, a board said Draft while three of its issues had already shipped; readying them burned three full sessions producing duplicates.

Before implementing anything: `grep -rn "#N"` and `git log -S "<key symbol>"`. And **cross-check issue state, never board state** — the board is a view, and views drift.

### Truncate the expensive inputs

The rubric grader gets the PR diff capped at 60k characters. There's no code review where character 60,001 changes the verdict, and unbounded inputs are how a routine run becomes a surprising bill. Read-only graders get exactly three tools.

## Setting it up

The whole thing is a CLI over a repo and a board. Adoption is three commands:

```bash
hamster doctor           # git, gh auth + project scope, docker, which runner CLIs exist
hamster init --dry-run   # print every mutation it would make, apply none of them
hamster init             # provision the board + labels, write hamsterwheel.toml,
                              # splice the issue contract into CLAUDE.md and AGENTS.md
```

Splice it into both if your implement and review runners are different vendors: Claude reads `CLAUDE.md`, Codex reads `AGENTS.md`, and a contract only one of them can see is a contract only one of them follows.

Then the working loop:

```bash
hamster plan                       # READ-ONLY: queue, skip reasons, resolved runner/model/effort
hamster triage                     # what needs a human: no criteria, no size, injection-flagged
hamster once --execute --issue 42  # one issue, claim → PR → gate → merge or Blocked
hamster run  --execute             # keep going until the Ready queue is empty
hamster reconcile                  # in-flight items with no live session behind them
hamster prune --delete             # stale WIP salvage branches
```

Two defaults worth knowing. `once` and `run` mutate the board **only** with `--execute` — without it they narrate. And `--pr-only` runs the identical pipeline but stops at the open PR, skipping the merge gate, which is how you should start in a new repo.

Everything repo-specific lives in one file:

```toml
repo = "acme/backend"
install_cmd = "bun run loop:install"                  # argv-split, NOT a shell

[[human]]                     # never auto-merged: parks as Blocked: needs-human
name = "prod-migration"
paths = "(^|/)(drizzle|migrations)/"

[[human]]
name = "sensitive-domain"
labels = ["security", "auth", "payments"]

[project]
number = 1

[runners.implement]
runner = "claude"        # claude | codex | opencode
strong_model = "opus"    # P0/P1 or size >= M
cheap_model  = "sonnet"  # XS, or docs/test/chore-shaped
effort = "high"

[review]
bot = "claude[bot]"      # whose PR comment the gate reads for blocking findings
```

Two footguns in that file, both of which cost me a run. `install_cmd` is argv-split and never goes through a shell, so `a && b` silently doesn't work — anything compound ships as a script in the repo. And the loop builds its worktrees from `origin/<base_branch>`, so that script has to be **merged to main** before the first run; a version sitting on your feature branch is invisible to every session.

## A run, in full

Enough principle. Here is one actual batch, five issues out of a real backlog, with nothing tidied up afterwards.

The queue, as the dry run printed it. Note the three-letter source key on each line: where the runner, model and effort each came from — `l`abel, `c`onfig, `h`euristic, or the `r`unner's own default.

```
1. #1339 [P1 sz1] fix(api): finalize PATCH stamps publish-failure error
      implement claude/opus/high (chc) · review codex/default/high (crc)
2. #1086 [P3 sz0] web: footer SOCIAL_DISPLAY keyed as Record<string,...>
      implement claude/haiku/low (cll) · review codex/default/high (crc)
3. #1161 [P3 sz0] AnnouncementEmail hero image width overflows content column
      implement codex/default/high (lrc) · review codex/default/high (crc)
4. #1227 [P3 sz0] perf(api): partial index on agent_runs(report_id)
      implement claude/sonnet/xhigh (chl) · review codex/default/high (crl)
5. #1240 [P3 sz0] fix(api): inconsistent LIKE-wildcard escaping in admin search
      implement claude/sonnet/medium (cll) · review codex/default/high (crc)
```

Five issues, four model/effort combinations, two vendors. #1339 is the only one with no `loop:*` labels at all — P1 and sized S, so the heuristic reached for the frontier model on its own. #1086 is a footer type narrowing, labelled down to the cheapest model at the lowest effort. #1227 is deliberately doomed and I'll come back to it.

An acceptance checklist, so the shape is concrete. This is #1161 in full, and it is the entire specification the implementing session receives:

```markdown
## Acceptance Criteria

- [ ] The hero `Img` uses `width="496"` and `maxWidth: 496`, matching the
      560px container minus 32px padding each side.
- [ ] The `height` attribute is scaled to preserve the original aspect ratio
      rather than left at its old value.
- [ ] No other width in the template is changed.
- [ ] Any other hard-coded width assuming 536px is updated in the same pass,
      or confirmed in the PR body as not existing.
- [ ] Existing tests and snapshots pass, updated only where the hero changed.
```

Every box is checkable by reading a diff. That's the bar — not "is this good", which no grader can answer, but "did this specific thing happen".

### The dry run found two bugs before anything ran

Both in the loop, not the backlog, and neither would have surfaced as itself.

**#1240 was screened as prompt injection.** Its title is `%/_ act as wildcards in feedback/reports but not traces/stats`. The `role-hijack` tripwire matched a bare `act as`. A legitimate issue, quarantined by a security control on a phrase that appears constantly in ordinary technical English. The fix was to require the verb to aim at an identity — `act as an admin` still trips, `act as wildcards` doesn't — and the regression test is now the real title that caught it.

**#1161 resolved to `codex -m sonnet`.** The `loop:impl-runner-codex` label switched the runner, but the model still came from the heuristic, which reads its tiers from a config block written for Claude. A model id is an opaque vendor token, so the validator is shape-only and cannot possibly know that `sonnet` is meaningless to Codex. It would have died at the spawn and been reported as a generic implement failure, and I'd have gone looking in the wrong place. Config-supplied models are now discarded whenever a label switches the runner.

Both were found by a **read-only command that touches nothing.** That is the entire argument for building a dry-run mode into anything that runs unattended: the cost of these two bugs was ten minutes, instead of two mystery failures at 3am.

### Then it failed on the first issue

The very first execution claimed #1339, created its worktree, ran the install command, and stopped:

```
✗ #1339 released back to Ready — run-fatal: install_cmd "bun run loop:install"
  failed: Script not found "loop:install"

✗ run aborted
  (the queue is intact: the claimed item was released, nothing else was touched)
```

Entirely my fault: the loop branches its worktrees from `origin/main`, and the script it needed only existed on my unpushed branch.

But look at what it did with that. This is precisely the failure from earlier in this post — the missing sandbox token that blocked a whole hand-curated queue in under a minute, one issue at a time. The same class of error, a precondition broken identically for every item, and this time it aborted on first occurrence and put the claim back. One issue touched, nothing blocked, nothing to clean up.

Fixing that taxonomy felt like bookkeeping when I did it. It's the difference between a five-second correction and re-triaging thirty issues by hand.

### Then it died twice more

**The cross-vendor reviewer didn't exist.** I'd configured Codex to grade the rubric, specifically because a reviewer that shares the implementer's blind spots is worth less. The session died at the spawn: `400 — the 'gpt-5.6-sol' model is not supported when using Codex with a ChatGPT account`. Every model I tried was rejected. Codex was simply not available on that account.

Three things about that are worth more than the bug. It was already in my notes from the day before, and I configured it anyway. My reasoning for *not* pinning a model id — "let the operator's own config win, a pinned id goes stale" — is what routed it into the broken default. And my first verification said all four models worked, because I probed with `codex exec "say ok" | grep ok` and Codex **echoes the prompt back**, so I was matching my own input. A failure that reads as a pass, in my own test harness, while I was writing a post about failures that read as passes.

The lucky part: `--pr-only` meant the grader never ran. Under the full gate all five issues would have done their work, opened their PRs, waited for CI, and *then* died identically at the last step.

**Then GitHub's GraphQL quota ran out, two issues in.** Serial, one lane. The loop rebuilt its queue every tick — a full board read plus an issue fetch per Ready item — and one board read on a 385-item board costs **517 points against a 5,000/hour budget**. Nine reads and you're done. Building the queue once and re-reading only the single item about to be claimed took a three-issue run down to about 980 points total.

I'd filed that lesson under "problems you get when you run parallel lanes." It isn't. It's a problem you get when your board is big.

### The bug that had never once worked

Restarting the batch, the loop skipped an issue: `already claimed by run loop-ms2f5trj-1339`. The aborted run had released it — status back to `Ready`, exactly as designed — but the owner field still held a dead run id, and the claim guard skips anything owned.

The release code looked right:

```ts
await setStatus(gh, ctx, iss.itemId, cfg.board.status.ready).catch(() => {});
await clearOwner(gh, ctx, iss.itemId).catch(() => {});
```

`clearOwner` set the field to an empty string. GitHub rejects that outright — `no changes to make` — so the call always threw, and the `.catch(() => {})` ate it. **It had never worked, in any run, ever.** Clearing a field is a different mutation entirely. Every rolled-back claim in the project's history had quietly leaked an issue out of the queue forever, and nothing anywhere said so.

Two characters of error handling. The status half of the release worked, so the board always *looked* released.

### And then the CI bill

Second batch: three issues, three PRs, no failures. Then every PR came back red — `format`, `release-tooling`, `claude-review`. Re-running changed nothing.

The jobs had **zero steps and finished in one second.** The annotation:

> The job was not started because an Actions budget is preventing further use.

The Actions spending limit was exhausted. At the API level that is `conclusion: FAILURE`, identical to a test suite that genuinely failed. So the gate — whose first arm is CI — would have parked every issue in the queue as `ci-red`, summoned a human, and been wrong about all of them, for a billing problem.

That's the run-fatal case again, in a costume I hadn't anticipated. It now reads the failing checks' annotations and aborts the run instead.

### What the loop actually produced

| PR | model / effort | outcome |
|---|---|---|
| footer type narrowing | haiku / low | **regression, caught by review** |
| lost publish response | opus / high | clean, tests added, merged |
| partial index | sonnet / xhigh | **refused: touches a migration** |
| LIKE-wildcard escaping | sonnet / medium | clean, tests added, merged |

The caught regression is the one I'd point at. The cheap-tier session narrowed a `Record<string, …>` to a type derived from the config object — and then deleted the runtime fallback that had been covering for it. But the config object has no `as const`, so the derived type widens straight back to `string`, and the narrowing buys exactly nothing. It traded a graceful degradation for a crash on every page render, and **all twelve CI checks passed**, because nothing in it is a type error. I confirmed it by hand afterwards: `Record<SocialName, number> = { GitHub: 1 }` compiles clean, missing two keys.

The reviewer caught it, tagged two findings `(high)`, and supplied the fix. That is the adversarial review pass earning its entire existence in one PR.

Meanwhile the migration PR was refused by a deterministic path check that never consulted a model at all, and the two good PRs both shipped with tests the sessions wrote themselves.

### The tally that matters

Five bugs in one evening, and they are all the same bug:

| looked like | actually was |
|---|---|
| zero blocking review findings | nobody ever reviewed |
| a green review check | the action refused to run |
| a successful field clear | an API call that always errors, swallowed |
| a narrowed type | a type that widened back to `string` |
| CI failing | jobs GitHub never scheduled |

Each one is a signal whose "everything is fine" value and its "nothing happened" value are **the same value**. None was caught by tests, because each one's code was doing precisely what it was written to do.

If you take one thing from this post, take that. For every check your automation trusts, ask what it returns when it never runs — and whether you could tell the difference. Where you can't, you don't have a check. You have a comment.

## What didn't work

- **Looping the reviewer to convergence.** Covered above: six rounds on a 50-line test.
- **Trusting an LLM's prose as a machine-readable signal.** Parse JSON by scanning back from the last `}`; better, force a schema.
- **`cancel-in-progress` on a workflow that also deploys.** Six PRs merged back-to-back. Each merge's CI run cancelled the previous one, so five intermediate deploy jobs were cancelled before executing. Only the last merge deployed, and only for the paths it happened to touch — five services silently ran pre-batch code. Correct for tests, catastrophic for deploys: **if a merge has side effects, it can't share a cancellable concurrency group with CI.**
- **A fix loop that re-checks a different signal than it gates on.** It was fed typecheck errors and review findings but only re-ran the typechecker between rounds, then exited on green and returned stale pre-fix findings. A semantic bug doesn't move a typechecker. **Whatever produced a signal must be what re-verifies it.**
- **Re-running the loop after a mid-gate death.** The issue is already In Review so a re-run skips it; forcing it spawns a fresh session that redoes finished work or collides with the open branch. Mid-gate deaths are finished by hand.
- **Diff-based review against a shared ref.** Linked worktrees share one object store. When a peer lane fetches, `refs/remotes/origin/main` advances past your base, and a review pointed at `git diff origin/main` reported HIGH-severity "guard was removed" findings in files the branch never touched — other lanes' merged fixes, shown reversed. I nearly acted on them. Diff against the merge-base.

[CUT candidate, but it's the best git story I have: `push.default=upstream` plus `git worktree add -b <br> origin/main` sets upstream to `origin/main`, so a bare `git push -u origin <branch>` writes `refs/heads/main`. Seven separate accidental direct-to-main pushes over three weeks, two via agents. `-u` doesn't save you — it applies after refspec resolution. Only a refspec containing `:` pins the destination. The protect-main pre-push hook printed "Passed" every time. Recovery is revert-forward, never force-push a shared main.]

## The tooling

The loop is [hamsterwheel](https://github.com/nc9/hamsterwheel) — sandbox runner, merge-gate kit and driver, MIT. It ships a skill covering the issue contract, the label vocabulary, and a pre-first-run checklist whose items are mostly things that fail *silently*, for the reason the whole post is about.

The backlog it grinds is [squirrelscan](https://squirrelscan.com), a website audit CLI. The batch above was ordinary API and web maintenance: a bug in a PATCH handler, a wildcard-escaping fix across admin search, a database index, a type narrowing. Nothing glamorous, which is the point — this is the work that accumulates faster than anyone schedules time for it.

One caveat that cost me an evening's assumption. Issues whose fix lands in a **submodule** can't be worked at all: the change needs a commit and PR in that repo *plus* a gitlink bump in the parent, and one merge gate can't land both atomically. Grep your candidate issues for the submodule path before promoting them. The fix is a second config pointed at the submodule's own repo, with the pointer bump batched separately afterwards — which is just how submodules are supposed to work.

## The actual lesson

Every expensive thing in an agent loop has a cheap deterministic equivalent, and the engineering is finding them:

| expensive | cheap |
|---|---|
| asking a model to decide the merge | a pure function over four booleans |
| a long conversation | a cold session and files on disk |
| re-deriving the repo layout | 30 tokens of written-down fact |
| the frontier model on a typo fix | a size label and a heuristic |
| an unbounded review loop | a cap of four |

Use the model for judgement. Use code for decisions. A good loop is mostly the second thing.
