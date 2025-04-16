---
title: "🐣 Crawl: Deploying Kubernetes on DigitalOcean"
date: 2025-04-15
---

As a Solutions Architect working with complex network automation platforms, I’ve always loved pushing the edge of what’s possible. But this series isn’t about enterprise polish or vendor demos — it’s about **getting my hands dirty**, testing real-world concepts, and sharing every step (and misstep) along the way.

In this first post, we’ll start at the “Crawl” stage: launching a managed Kubernetes cluster on [DigitalOcean](https://digitalocean.com) as the foundation for our lab. No custom controllers, no CNI tricks — just raw infrastructure and curiosity.

Let’s build this from the ground up. 🐣


---

## 🚀 Why DigitalOcean?

- ✅ **Managed K8s**: Control plane is handled for you.
- 💸 **Affordable**: Great for labs and hobby projects.
- 🔗 **GitHub Integration**: Plays well with CI/CD.
- 🧠 **Simple UX**: Clean dashboard, intuitive workflow.

---

## 🛠️ Step-by-Step Deployment

### 1. Create Your Cluster

- Log in to your [DigitalOcean dashboard](https://cloud.digitalocean.com)
- Navigate to **Kubernetes > Create Cluster**
- Choose:
  - Latest stable version
  - Node pool (3x nodes, e.g., 2 vCPUs + 4GB RAM)
  - Region (I used NYC3)
  - Enable auto-upgrades (optional but recommended)

### 2. Install and Configure `doctl`
{{< note >}}
Brew is mac native, please refer to DigitalOceans (doctl)[https://docs.digitalocean.com/reference/doctl/how-to/install/] installation for other platforms.
{{< /note >}}

```bash
brew install doctl
```
#### Authenticate your DigitalOcean account
```bash
doctl auth init
```
### 3. Get Your Kubeconfig
{{< note >}}
For `kubectl` installation, please refer to the (official kubernetes docs)[https://kubernetes.io/docs/tasks/tools/#kubectl]
{{< /note >}}

To authenticate **`kubectl`** with your new cluster, run:

```bash
doctl kubernetes cluster kubeconfig save <your-cluster-name>
```

### 4. Verify Access to the Cluster
Now test your connection to the cluster:
```bash
kubectl get nodes
```

Here is an example from my lab.

```
> kubectl get nodes
NAME                   STATUS   ROLES    AGE     VERSION
pool-42jzkx9cx-6s71k   Ready    <none>   3m34s   v1.32.2
```

### 🧠 What I Learned in the Crawl Phase
* Kubeconfig access is step zero for everything that follows.

* Managed K8s saves time — don’t overcomplicate the start.

* doctl makes cluster management smooth and scriptable.

This is your launchpad — don’t stress about perfection yet.

---

Next up: **Walk** — turning this blank canvas into a network topology playground with Containerlab running natively in Kubernetes. Stay tuned 👣
