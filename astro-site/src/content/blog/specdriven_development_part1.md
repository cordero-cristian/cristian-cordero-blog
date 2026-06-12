---
title: "Spec-Driven Network Automation, Part 1: Prove the Contract Before You Touch the Lab"
description: Bringing change-control discipline to network automation. Why proving the application contract with a mock lifecycle comes before live SR Linux telemetry, using Spec Kit to drive intent, plan, tests, and evidence.
pubDate: 2026-06-12
draft: false
tags:
  - Network Automation
  - Spec-Driven Development
  - SR Linux
  - netlab
  - Python
---

Most network automation projects do not fail because someone forgot how to write Python.

They fail because the intent was fuzzy, the scope kept moving, validation was an afterthought, and nobody could prove what actually worked.

I know that sounds a little harsh, but if you have spent enough time around network scripts, ticket queues, change windows, outages, and "temporary" tools that became production critical, you know exactly what I mean.

A team starts with a simple idea:

> "Let's automate this repetitive task."

Reasonable enough.

Then the script needs arguments. Then output formatting. Then state tracking. Then logging. Then error handling. Then a safe way to run it. Then someone asks for a report. Then someone wants a dashboard. Then another platform needs to consume the data. Then someone wants role-based access. Then suddenly the original problem is buried under a half-built product nobody actually designed on purpose.

The technical problem started small.

The delivery problem did not.

This series is about avoiding that trap.

## The Problem Is Not Python

Network engineers have been writing automation for years now. Some of it is excellent.

Some of it is also a folder full of scripts with names like this:

```text
backup-final.py
backup-final-v2.py
working-backup-script.py
new-prod-version-use-this-one.py
```

I am not judging too hard. I have written my share of "use this one" scripts. Most of us have.

But that is not a Python problem. That is a discipline problem.

A useful automation project needs the same things a good network change needs:

```text
Intent
Scope
Plan
Execution
Validation
Rollback
Evidence
```

Nobody serious walks into a production maintenance window and says:

> "I will just vibe it out and see what the router does."

At least, nobody you want owning the maintenance window.

But automation projects get built that way all the time. The script works once. Then it gets copied. Someone adds a flag. Another device type shows up. The assumptions change. The original author leaves. Now the team owns a tool, but not really a system.

That is the gap this project is meant to close.

I do not want another pile of clever scripts.

I want a small system that proves what it does.

## Why Spec-Driven Development Fits Network Automation

Spec-driven development is not magic. It is not a new religion. It is not some fancy software ceremony that network engineers need to worship.

To me, it is just a way to force clarity before implementation.

For this series I am using [Spec Kit](https://github.com/github/spec-kit) as the workflow around an AI-assisted development process. The point is not that AI can help write code. We already know it can. The point is that fast code generation without structure can make a messy project messy at a much higher speed.

The useful part is the sequence:

```text
Intent → Spec → Plan → Tasks → Tests → Implementation → Evidence
```

That should feel familiar if you come from networking.

It looks a lot like change control:

```text
What are we changing?
Why are we changing it?
What is in scope?
What is out of scope?
How will we know it worked?
How do we back out?
What evidence proves it succeeded?
```

That framing matters because network automation touches real systems. Even in a lab, the habits carry over. If the lab workflow is sloppy, the production workflow will probably be sloppy too.

[Spec Kit](https://github.com/github/spec-kit) gives the project a backbone.

It defines behavior before building it. It produces a plan before implementation. It turns vague ideas into tasks. It makes tests part of the work instead of something bolted on at the end when everyone is tired and just wants the thing to be done.

That is the value.

Not hype.

Just discipline.

## AI-Assisted Coding Needs Guardrails

AI coding tools move fast.

That is useful.

They also move fast in the wrong direction.

That is the part people skip over when they talk about productivity.

Without structure, AI-assisted development can produce a lot of code quickly without answering the basic engineering questions:

- What problem is this solving?
- What behavior is actually required?
- What should not be built yet?
- What counts as success?
- What evidence proves it?
- What assumptions am I making?
- What happens when the real network disagrees?

That last one matters.

Network automation has a way of humbling assumptions. Mock data looks clean. Lab data is less clean. Production data is usually worse. Device outputs vary. APIs change. Hostnames are inconsistent. Inventory is incomplete. Protocol state does not always match the diagram.

And I get humbled enough on the golf course. I do not need my automation projects doing it for free.

So the goal is not to let AI spray code into a repo and call it productivity.

The goal is to use AI inside a delivery process that has boundaries.

[Spec Kit](https://github.com/github/spec-kit) gives me that process. It does not replace engineering judgment. It gives that judgment a structure to work inside.

That distinction matters.

I am not trying to prove that AI can write a network automation tool.

I am trying to prove that a network automation tool can be built with clear intent, scoped work, tests, validation evidence, and clean boundaries while using AI as an accelerator.

That is a very different thing.

## The Project: A Reproducible SR Linux Lab

The working example for this series is a reproducible Nokia SR Linux network automation lab.

The stack:

```text
Nokia SR Linux
netlab
Containerlab
Terraform
Docker
Python
Typer
Pydantic v2
pytest
DuckDB
```

The application package is `srl_lab`.

The CLI command is:

```bash
srl-lab
```

The network source of truth is:

```text
topology.yml
```

Local artifacts live under:

```text
.srl-lab/
```

The goal is a small but real automation workflow around a leaf/spine SR Linux lab. The app should be able to deploy, discover, collect, report, archive, and tear down lab state in a way that is repeatable and testable.

That does not mean building a giant platform.

No dashboards yet.

No Kubernetes.

No Prometheus.

No Grafana.

No enterprise-architecture theater.

I like building tools, but I also know my own bad habits. It is very easy to start with a CLI and somehow end up designing a platform, a workflow engine, a dashboard, and a roadmap nobody asked for.

Not this time.

The first goal is deliberately boring:

> Can I define the lab, run the workflow, collect useful state, store it cleanly, produce reports, archive artifacts, and prove what happened?

That is enough.

Boring and testable beats impressive and fragile.

## Why the Mock Lifecycle Came First

The first completed feature was not live telemetry.

That was intentional.

The first feature built the Python CLI and the mock lifecycle:

```bash
srl-lab deploy
srl-lab discover
srl-lab collect
srl-lab report
srl-lab archive
srl-lab teardown
srl-lab run
```

The obvious criticism is fair:

> "Why build mock behavior before talking to real routers?"

Because the application needed a contract before it needed a network.

Before collecting real SR Linux state, the project had to answer questions that have nothing to do with devices:

- What does a run look like?
- What creates a `run_id`?
- What gets persisted?
- What is display-only?
- What does node health mean?
- What does routing health mean?
- What should a report show?
- What should an archive contain?
- What should never end up in one?

Those are application design questions.

The mock lifecycle made those decisions testable before real infrastructure entered the picture. That is not fake work. That is how you avoid solving every problem at once.

This is something I have had to learn the hard way.

As a network engineer, my instinct is usually to get to the real device as fast as possible. Show me the CLI. Show me the state. Show me the route table. Show me the neighbor. That instinct is useful, but it can also cause you to mix too many problems together too early.

If the live collector fails, why did it fail?

Was the app wrong?

Was the data model wrong?

Was the lab broken?

Was the topology wrong?

Was the device unreachable?

Was the parser bad?

Was the assumption bad?

If you have not proven the application contract first, every failure becomes a murder mystery.

The mock lifecycle reduces the blast radius. It lets the app prove what success looks like before the real network starts arguing with it.

## The Lab Is Part of the Product

A lot of automation projects treat the lab as an external detail.

I think that is wrong.

For this project, the lab is part of the product.

If the lab cannot be recreated, the automation cannot be trusted. If the topology only works on one laptop, on one afternoon, in one person's local environment, the project is already drifting.

I also do not want the lab depending on my Mac.

My Mac is for writing, testing, SSH, coffee-fueled debugging, and occasionally pretending I am going to organize my Downloads folder. It does not need to be the permanent home of a network lab full of containers.

The target is a disposable Ubuntu cloud VM:

```text
Cloud Ubuntu VM
  ├── Docker Engine
  ├── Containerlab
  ├── netlab
  ├── network-lab repo
  └── SR Linux containers
```

The VM is managed with Terraform. Bootstrap is handled with cloud-init. The firewall allows SSH only from my public IP. Nothing else is exposed.

That last part matters.

No public Docker.

No public SR Linux management ports.

No public gNMI.

No random lab services hanging out on the internet.

SSH only.

The boundary I care about is simple:

```text
Terraform owns the host.
netlab owns the topology.
```

Terraform builds the workbench. It should not micromanage every lab container.

The topology belongs in `topology.yml`, and netlab is responsible for bringing that topology up and down.

That gives the project a clean separation of responsibility:

```text
Terraform    → cloud host
cloud-init   → host bootstrap
netlab       → lab topology
Containerlab → container runtime integration
srl-lab      → automation workflow
DuckDB       → local run data
pytest       → validation
```

Each tool has one job.

That is the whole point.

Simple boundaries scale better than clever glue.

## Reproducibility Changes the Standard

A reproducible lab raises the quality bar.

"It worked on my machine" stops being good enough.

The better standard is a checklist you can actually run:

```text
Can I rebuild the host?
Can I verify the dependencies?
Can I boot the topology?
Can I prove the nodes are running?
Can I reach SR Linux?
Can I tear it all down cleanly?
Can I show the evidence?
```

That is the kind of standard I want for network automation.

Not because every lab will be perfect. It will not be. Labs break. Dependencies move. Images change. Tools behave differently than expected. Cloud VMs are sized wrong. Something that looked obvious locally becomes annoying on a remote host.

That is normal.

The point is that the workflow should make failures visible.

When something breaks, I want to know exactly what broke:

- Was the VM too small?
- Did cloud-init miss a dependency?
- Did netlab behavior change?
- Did Containerlab fail?
- Did the SR Linux image pull fail?
- Did the CLI make a bad assumption?
- Did a test only prove mock behavior?

Those are useful failures.

They sharpen the system instead of hiding inside it.

And to be clear, several of these are not hypothetical. This project already ran into the normal kind of lab nonsense you only find by actually building the lab. Later posts will show where it bit me.

That is part of the point of the series.

I do not want to write a clean-room success story where every decision looks obvious in hindsight.

That is not how real infrastructure work feels.

Real infrastructure work is more like:

```text
Make a plan.
Run the thing.
Find the bad assumption.
Fix the assumption.
Run it again.
Capture the evidence.
Do not pretend the first plan was perfect.
```

That is much closer to the truth.

## The Ground Rules

The rules for this project are simple:

```text
Boring over flashy.
Evidence over vibes.
Scope boundaries over platform sprawl.
Disposable infrastructure over snowflakes.
Tests before confidence.
Mock first, live second.
SSH only.
No public lab services.
No dashboards until there is data worth showing.
```

That last one matters.

A dashboard is not a foundation. It is a display surface.

If the lab cannot boot, the collector cannot collect, the data model is unclear, and the reports cannot be trusted, a dashboard just makes the mess prettier.

I do not want prettier messes.

I want a small system that works, proves it works, and can be rebuilt.

Maybe later there is a dashboard. Maybe later there is a bigger workflow. Maybe later this grows into something more platform-like.

But not before the foundation earns it.

## What This Series Will Cover

This series is going to walk through the project in the order it was built.

First, the spec-driven workflow and why I think it maps well to network automation.

Then, the design of the SR Linux lab application before live infrastructure was involved.

Then, the mock CLI lifecycle and why proving the application contract came first.

After that, the disposable cloud lab host with Terraform and cloud-init.

Then, the real SR Linux validation with netlab and Containerlab.

Finally, the bridge into live SR Linux collection.

The order matters.

I am not starting with telemetry because telemetry is not the foundation. The foundation is a reproducible environment, a clear application contract, and validation evidence.

Once those exist, live collection becomes a focused feature instead of a pile of unknowns.

The next post picks up right there: the design of the SR Linux lab before the live lab existed. The CLI shape, the role of `topology.yml`, the DuckDB storage model, and why `collect` owns persisted run creation.

The main idea is simple:

> Before touching a router, prove your application knows what success looks like.
