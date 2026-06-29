---

title: "Spec-Driven Network Automation, Part 2: Mock First, Lab Second"
description: "Feature 001 of the SR Linux lab project: building the first CLI lifecycle with mock data before relying on a live network lab."
pubDate: 2026-06-15
draft: false
tags:
  - Network Automation
  - Spec-Driven Development
  - SR Linux
  - netlab
  - Python
  - DuckDB

---

In the first post, I laid out the main idea behind this series: network automation needs more than scripts. It needs intent, scope, validation, and evidence.

This post is where that idea starts turning into an actual project.

The project is a reproducible Nokia SR Linux network automation lab. The end goal is to use netlab and Containerlab to stand up a small SR Linux leaf/spine topology, collect operational state, normalize the data, store it in DuckDB, and generate useful CLI reports and archive artifacts.

But Feature 001 did not start by booting SR Linux.

It started with the application contract.

That was intentional.

Feature 001, `001-srlinux-netlab`, built the first version of the Python CLI package `srl_lab`, with the command `srl-lab`.

The goal was simple:

> Prove the full lifecycle using mock data before relying on a live lab.

That may sound backwards if your first instinct is to get to the router CLI as fast as possible.

That was my instinct too.

I am a network engineer. I like seeing real devices, real interfaces, real routing state, and real failures. Show me the box, show me the state, show me the neighbor table, and we can start making sense of the world.

But starting with the live lab too early mixes too many problems together.

When something breaks, you are left asking all of these at once:

```text
Was the app broken?
Was the topology broken?
Was Containerlab broken?
Was SR Linux still booting?
Was the image missing?
Was netlab doing something I did not expect?
Was the collector wrong?
Was the database schema wrong?
Was the CLI contract unclear?
```

Those are all valid problems.

They should not all be debugged at the same time.

Feature 001 was about reducing that blast radius: building one known-good layer before stacking the next one on top.

That is not glamorous.

It is also usually how things stay maintainable.

## The Problem with Starting at the Device

A lot of network automation projects connect to the device first.

That makes sense on the surface. The network is the thing we care about. If the automation cannot talk to the device, what are we even doing?

But there is a trap there.

When you start at the device, the early shape of the tool gets coupled to whatever lab state happens to exist that day.

You write around the quirks of the first topology.

You normalize around the first output.

You make assumptions based on the first device that responds.

You let the lab accidentally design the application.

That can work for a quick helper script. I have written plenty of those. Most network engineers have.

The problem is when the helper script quietly becomes the thing everyone depends on.

That is where the pain starts.

The script worked once, so someone added a flag. Then someone else added another use case. Then another device family showed up. Then the output changed. Then the original author got busy, moved teams, or forgot why half the logic existed.

Now everyone is afraid to touch it.

That is the road I wanted to avoid.

For this project, I wanted the application to have a stable contract before SR Linux entered the picture. I wanted to know what a run looked like, what got stored, what counted as healthy, what the report should show, and what artifacts should be archived.

Those are not really SR Linux questions.

They are application questions.

That is why Feature 001 started with mock data.

## What Spec Kit Did for Feature 001

This is the part of the project where Spec Kit stopped being a concept from Post 1 and started earning its place.

The whole feature began from a single paragraph of intent:

> Build a reproducible Nokia SR Linux network lab using netlab with the Containerlab provider. The lab must deploy a simple leaf/spine topology, discover nodes, collect interface and routing metrics, normalize the data, store it in DuckDB, and provide a CLI report showing node health and interface counters.

That sounds clear at first.

It is not.

There are a lot of words in there that feel precise until you actually have to build them.

“Node health.”

“Collect metrics.”

“Routing.”

“Report.”

Every one of those hides a decision.

If I had jumped straight into code, I would have made those decisions anyway. They just would have been scattered across the implementation. Maybe in a model. Maybe in a SQL insert. Maybe in a report function. Maybe in some random conditional that future-me would hate.

Spec Kit forced those decisions into the open earlier.

Feature 001 went through the full workflow:

```text
/speckit.specify
/speckit.clarify
/speckit.plan
/speckit.tasks
/speckit.implement
```

The step that really paid for itself was:

```text
/speckit.clarify
```

## The Clarify Step Is Where the Structure Paid Off

Before any code was written, `/speckit.clarify` forced me to answer the questions buried inside that one-paragraph description.

These were the kinds of questions that mattered:

> **Q: What rule determines whether a node is healthy in the CLI report?**

> A: Reachability plus telemetry completeness — a node is healthy only if it is reachable and both interface and routing metrics are collected.

> **Q: How are collection runs identified for DuckDB storage and duplicate prevention?**

> A: Each run has a generated run ID and collection timestamp; records are unique by run ID plus entity identity.

> **Q: What determines whether routing is healthy in the lab report?**

> A: Routing is healthy only when expected routing protocol neighbor sessions are established.

That is the whole point of this post.

“Show me node health” sounds simple until something makes you define it before you write the code.

Left to my own momentum, I probably would have hand-waved health into something like “the device responded” and moved on.

That would have been easy.

It also would have been weak.

Reachability is not health. It is one part of health.

A node can respond and still fail to return the interface or routing data the workflow expects. A routing table can have routes and still not prove the expected neighbor relationships are established. A report can show a green check mark and still not mean anything useful.

That is how tools lose trust.

The clarify answers became contracts the implementation had to satisfy.

The `run_id` model, node-health definition, and routing-health definition were not things invented randomly while coding. They came from the spec. Then the implementation had to honor them.

That is the kind of structure I want in a network automation project.

Not because process is fun.

Because vague green check marks are dangerous.

## The Feature Boundary Mattered

Feature 001 had a branch:

```text
001-srlinux-netlab
```

It had a task list:

```text
specs/001-srlinux-netlab/tasks.md
```

By the end of the mock MVP slice, tasks `T001-T049` were marked complete. Tasks `T050-T056` remained follow-up SR Linux and live validation work.

That distinction matters.

The feature was not:

```text
Build the whole lab platform.
Solve SR Linux telemetry forever.
Create a dashboard.
Invent a mini-NMS.
Build a workflow platform.
Add Kubernetes because why not.
```

It was exactly this:

> Build the first version of the network automation CLI and prove the full lifecycle using mock data.

That is a much better unit of work than “automate the network.”

It is small enough to finish.

It is specific enough to test.

It is useful enough to build on.

That is the sweet spot.

## What Feature 001 Built

Feature 001 built the first CLI lifecycle for the project.

The implemented commands were:

```text
srl-lab deploy
srl-lab discover
srl-lab collect
srl-lab report
srl-lab archive
srl-lab teardown
srl-lab run
```

The important files and paths were defined early.

The network source of truth is:

```text
topology.yml
```

The local artifact root is:

```text
.srl-lab/
```

The database is a local DuckDB file:

```text
.srl-lab/srl_lab.duckdb
```

That gave the project a simple local operating model.

No external database.

No service dependency.

No platform layer.

No dashboard.

No “let me just add this one extra thing real quick” trap.

Just a CLI, a topology file, a local database, and artifacts.

Boring, but useful.

And honestly, boring is underrated.

Most infrastructure does not need to be exciting. It needs to work, fail clearly, and be easy to reason about when you are tired.

## The Lifecycle Contract

The main operator workflow is:

```bash
srl-lab run --collector mock --topology topology.yml --db .srl-lab/srl_lab.duckdb
```

For the mock path, `srl-lab run` does not boot a real lab and does not tear down real SR Linux containers.

That is the point.

The mock path generates one `run_id`, collects mock data, renders a report, archives evidence, and records mock teardown status. Mock collection performs the discovery work internally, but it is not the same thing as calling the standalone `discover` command against a real lab.

For Feature 001, the mock collector was the important part.

It let the project prove the lifecycle without needing to deal with:

```text
Docker
Containerlab
netlab
SR Linux boot time
image pulls
SSH access
gNMI access
cloud VM setup
```

Those things matter. They matter a lot.

They just were not the first thing the application needed to prove.

The first thing the application needed to prove was that the lifecycle made sense:

```text
Can the CLI accept the right inputs?
Can it parse the topology?
Can it create a run?
Can it normalize collected data?
Can it write to DuckDB?
Can it generate a report?
Can it create an archive?
Can it record teardown status?
Can tests prove that behavior?
```

That is the application contract.

Once that exists, the real collector has something to plug into.

Without that contract, live collection becomes a pile of unknowns.

## Lesson Learned: Mocking Is Not Avoiding Reality

There is a lazy version of mocking where you use fake data because the real thing is inconvenient, and then convince yourself the project works.

That is not what I wanted here.

The mock lifecycle was not the finish line.

It was a contract.

The mock collector let the app prove:

```text
CLI shape
run lifecycle
normalized data model
DuckDB persistence
report output
archive behavior
test strategy
failure handling
```

before dealing with live infrastructure.

Mocking did not prove SR Linux was reachable. It did not prove netlab could boot the topology. It did not prove Containerlab worked on the target host. It did not prove live telemetry was correct.

And that is fine.

The mock lifecycle was never supposed to prove those things.

It was supposed to prove that when a collector returns valid data, the application knows what to do with it.

That difference matters.

If you confuse those two things, you end up with fake confidence.

I do not want fake confidence.

I want boring evidence.

## Data Model Decisions

Feature 001 forced several data model decisions.

The most important one was `run_id`.

Each collection run gets grouped by a `run_id`. Stored entity records are unique by `run_id` plus entity identity where applicable. `collection_runs` uses `run_id` as the primary key, while collection errors are recorded separately.

That gives the data a clean timeline.

Instead of overwriting the world every time the CLI runs, the app can reason about a specific run and the records attached to it.

The DuckDB storage model included tables for:

```text
collection_runs
nodes
interface_metrics
routing_metrics
collection_errors
artifacts
```

This is not a complicated schema.

That is the point.

The goal was to capture enough structure to support the lifecycle without turning the MVP into a data warehouse. I like data as much as anyone, probably too much, but not every project needs to become a reporting platform on day one.

The project also defined ownership boundaries:

```text
collect  → owns persisted run creation
discover → display/validation only
```

That means `discover` can show and validate inventory, but it does not persist `nodes`.

Persistence starts with `collect`.

That boundary prevents a subtle kind of confusion.

Discovery and collection are related, but they are not the same operation. If every command writes state whenever it feels like it, the database becomes hard to reason about quickly.

I wanted boring behavior:

```text
discover shows what the topology says
collect creates the persisted run
report reads persisted run data
archive captures evidence
```

Simple systems scale better than clever ones.

That is one of those lessons I keep relearning.

Usually after making something too clever first.

## Health Needed a Definition

Defining health was one of the most important parts of Feature 001.

It is easy to say:

> Show me node health.

It is harder to define what that actually means.

That is how tools end up with green check marks nobody trusts.

For this project, node health means:

```text
node is reachable
interface metrics were collected
routing metrics were collected
```

Routing health means:

```text
expected routing protocol neighbor sessions are established
```

Those definitions came from the clarify step. They were not random report labels added at the end.

If the report says a node is healthy, the code has a reason.

If the report says routing is healthy, there is a definition behind that statement.

The definition will probably evolve as the lab gets more real. That is fine. I expect it to evolve.

But Feature 001 needed a starting point that could be tested.

Otherwise, the report is just decoration.

And I do not need decorative automation.

I need automation that can tell me what it did and why it believes the result.

## Reports and Archives

Feature 001 also built report and archive behavior.

The CLI report defaults to table output and supports JSON.

That keeps it useful for humans and automation.

Human-readable output matters because sometimes you just want to run the command and see what happened.

Machine-readable output matters because eventually another process may need to consume it.

Both are useful.

The archive is intentionally lightweight. It does not copy the live DuckDB file.

That was deliberate.

A lab archive should capture evidence from the run, not blindly scoop up the active database and pretend that is clean artifact management.

Known archive artifacts included:

```text
errors.json
inventory.json
logs.txt
manifest.json
raw_collection.json
report.json
report.txt
teardown.txt
topology.yml
```

That is the kind of evidence I want from a lab run:

```text
What happened?
What was collected?
What errors were captured?
What report was generated?
What topology was used?
What did the archive contain?
```

Not perfect.

Not final.

But enough to prove the lifecycle created useful output.

That is the recurring theme here: useful proof over pretty output.

## Testing the Contract

The tests for Feature 001 covered the core application contract:

```text
CLI contract
storage contract
Pydantic model normalization
topology inventory parsing
DuckDB storage behavior
report generation
archive generation
full mock lifecycle integration
```

The current repo validation result is:

```text
Pytest: 85 passed in 0.63s
```

That number grew as later features landed, so I do not want to pretend it was all Feature 001 work. The important point for this post is narrower: the mock lifecycle is still covered by the test suite, and the mock run path passes.

The mock lifecycle ran cleanly with:

```bash
srl-lab run --collector mock --topology topology.yml --db .srl-lab/srl_lab.duckdb
```

Archive artifacts were created successfully.

That gave the project its first real confidence point.

Not confidence that the live lab worked.

Confidence that the application lifecycle worked.

That is a different kind of confidence, but it matters.

A lot of infrastructure work goes sideways because we mix confidence levels together. A unit test passing is not the same as a lab working. A lab working is not the same as production readiness. A command succeeding once is not the same as a repeatable workflow.

Feature 001 proved one layer.

That is enough.

Then the next feature can prove the next layer.

## Lesson Learned: Passing Mock Tests Is Not the Same as Proving the Lab

This is where it is important to stay honest.

Feature 001 did not prove SR Linux connectivity.

It did not prove the netlab lifecycle.

It did not prove Containerlab behavior.

It did not prove a cloud VM had enough CPU or memory.

It did not prove image pulls.

It did not prove SSH or gNMI access.

It did not prove live telemetry.

The live SR Linux collector at this point was skeleton-level follow-up work. Fixture-based live collector tests were planned, but they were not completed as part of Feature 001.

That is not a failure of Feature 001.

That was the boundary of Feature 001.

The whole point of spec-driven work is knowing what a feature is supposed to prove and what it is not supposed to prove.

If I had claimed Feature 001 proved the full SR Linux lab, that would have been nonsense.

What it proved was smaller and cleaner:

> The application has a lifecycle contract that can be tested.

That is enough for the first slice.

## Why This Order Matters

The temptation was to start with the real lab.

Build the topology.

Boot the containers.

Connect to SR Linux.

Pull interface and routing state.

Figure out the application later.

That would have felt more satisfying at first.

It also would have created a messier debugging loop.

Every failure would have been tangled up with CLI design, persistence design, reporting design, archive design, and test design all at once.

By building the mock lifecycle first, the app had a known-good path before the live lab existed.

When the real collector gets plugged in, it has a contract to satisfy:

```text
Return normalized node data.
Return normalized interface metrics.
Return normalized routing metrics.
Return collection errors in a useful shape.
Let the rest of the app handle persistence, reports, and archives.
```

That makes live collection a focused problem instead of a pile of unknowns.

I have built enough messy tools to know where the other road goes.

It starts as a helper script and somehow turns into a thing everyone is scared to touch.

No thanks.

## What Comes Next

Feature 001 built the application lifecycle and proved it with mock data.

The next step is to prove the lab substrate.

Feature 002 moves to the disposable cloud lab host:

```text
Terraform
cloud-init
Docker
Containerlab
netlab
Python tooling
secure SSH-only access
```

Feature 003 then proves the real SR Linux topology lifecycle on that VM using netlab and Containerlab.

Only after that does live SR Linux collection become the right next slice.

That order is the whole lesson:

```text
First, prove the application contract.
Then, prove the lab substrate.
Then, collect real network state.
```

Before touching a router, prove your application knows what success looks like.

