---
title: "🥾 Walk: Deploying Containerlab in Kubernetes with Arista cEOS"
date: 2025-04-19
description: Walking forward by transforming Containerlab topologies into live cEOS nodes inside Kubernetes using Clabverter + Clabernetes.
---

> 🐣 If you missed the Crawl phase, [start here](./clabernetes_crawl.md).

---

## 🧭 What We're Doing in the Walk Phase

In this post, I'm using [`clabverter`](https://github.com/srl-labs/clabernetes/tree/main/tools/clabverter) to deploy a Containerlab topology directly inside Kubernetes — specifically using [Arista cEOS](https://www.arista.com/en/products/eos). We'll walk through converting the topology, deploying it, and validating that everything's working — ending with a live, CLI-accessible network device.

---

## ⚙️ Step 1: Define the Containerlab Topology

Here's the `ceos.lab.yaml` file I used:

```yaml
name: ceos-lab
topology:
  nodes:
    ceos1:
      kind: ceos
      image: registry.digitalocean.com/network-analyzer-lab/ceos:4.33.1F
      startup-config: ceos1.cfg
```

{{< note >}}
The Arista cEOS image is a private image. Refer to the [Containerlab ceos documentation](https://containerlab.dev/manual/kinds/ceos/) for instructions on how to access it.
{{< /note >}}

---

## 🔁 Step 2: Convert and Deploy Using Clabverter

Now, let’s turn that topology into Kubernetes-native resources and deploy it:

```bash
clabverter --stdout --naming non-prefixed --topologyFile ./ceos.lab.yaml | kubectl apply -f -
```

⚠️ You might see a platform mismatch warning (e.g., `linux/amd64` vs `arm64`) — it's safe to ignore if the pod starts successfully.

---

## ✅ Step 3: Verify the Deployment

Make sure everything came up properly:

```bash
kubectl get namespaces
kubectl get topology -n c9s-ceos-lab
kubectl get pods -n c9s-ceos-lab -o wide
```

Here’s what I saw in my lab:

```bash
> kubectl get ns

NAME              STATUS   AGE
c9s               Active   2d23h
c9s-ceos-lab      Active   11s
default           Active   3d16h
...
```

```bash
> kubectl get --namespace c9s-ceos-lab topology
NAME       KIND           AGE   READY
ceos-lab   containerlab   43s   true
```

```bash
> kubectl get pods --namespace c9s-ceos-lab -o wide
NAME                     READY   STATUS    RESTARTS   AGE   IP            NODE
ceos1-5dc7cbc78d-rr9qd   1/1     Running   0          10m   10.109.0.28   pool-42jzkx9cx-6s71k
```

---

## 🛠️ Step 4: Inspect from Inside the Container

Start a shell in the pod:

```bash
kubectl exec -it -n c9s-ceos-lab ceos1-XXXXX -- bash
```

Then inspect the topology:

```bash
containerlab inspect
```

Sample output:

```
╭───────┬─────────────┬─────────┬────────────────╮
│  Name │ Kind/Image  │  State  │ IPv4/6 Address │
├───────┼─────────────┼─────────┼────────────────┤
│ ceos1 │ ceos        │ running │ 172.20.20.10   │
╰───────┴─────────────┴─────────┴────────────────╯
```

---

## 🔐 Step 5: SSH Into the cEOS Node

While still inside the container, connect to the actual device:

```bash
ssh admin@ceos1
```

You’ll be prompted for a password — use the default or whatever’s configured in your startup config.

---

## 🔍 Step 6: Check gNMI Status

Inside the cEOS CLI, run:

```bash
show management api gnmi
```

You’ll likely see something like:

```
Enabled: no transports enabled
```

Perfect — that means gNMI is *not* active yet, which gives us a clean slate for the Run phase.

---

## 🧠 What We Accomplished in Walk

- Converted a `.lab.yaml` topology into Kubernetes-native resources
- Deployed a real Arista cEOS instance inside Kubernetes
- Verified pod and container status with `containerlab inspect`
- SSH'd into the emulated device
- Confirmed gNMI is currently disabled — ready for the next phase

---

## 🏃 Coming Up: Run

Next up: We’ll enable gNMI on this cEOS node, hook it up to a telemetry collector like `gnmic`, and start visualizing live network metrics in a dashboard.

Stay tuned — we’re about to see the network breathe 📡📈
