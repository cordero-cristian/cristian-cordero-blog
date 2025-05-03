---

title: "🏃️ Run: Streaming gNMI Telemetry from cEOS in Kubernetes"
date: 2025-05-02
description: Wrapping up our Crawl-Walk-Run series by enabling gNMI on Arista cEOS and streaming real-time telemetry through Kubernetes using `gnmic`.
------------------------------------------------------------------------------------------------------------------------------------------------------

> 👛 Missed the earlier phases? [Start from the beginning](https://cristian-cordero.dev/post/clabernetes_crawl/).

---

## 🚀 The Goal

In the "Run" phase, we stream real-time telemetry from an Arista cEOS container running in Kubernetes. We'll:

* Enable gNMI on cEOS
* Install and configure `gnmic`
* Query live interface stats
* Deploy the topology via Clabverter to Kubernetes
* Set up image delivery via DigitalOcean Container Registry
* Optionally configure certificate-based authentication

---

## 🐳 Step 1: Push Image to DigitalOcean Container Registry (DOCR)

If you're using a private image (like Arista cEOS), upload it to DOCR:

```bash
# Tag your local image
docker tag ceos:4.33.1F registry.digitalocean.com/<your-registry-name>/ceos:4.33.1F

# Login to DigitalOcean registry
doctl registry login

# Push the image
docker push registry.digitalocean.com/<your-registry-name>/ceos:4.33.1F
```

> 💡 Make sure your Kubernetes cluster has permission to pull from this registry. You may need to create an image pull secret.

---

## 🧬 Step 2: Deploy cEOS via Clabverter

Convert and deploy your Containerlab topology:

```bash
clabverter --stdout --naming non-prefixed --topologyFile ./ceos.lab.yaml | kubectl apply -f -
```

Verify your deployment:

```bash
kubectl get ns
kubectl get topology -n c9s-ceos-lab
kubectl get pods -n c9s-ceos-lab -o wide
```

---

## 🔐 Step 3 (Optional): Enable Certificate Authentication

To secure your telemetry setup, configure gNMI to use certificates.

### Generate Certs with Containerlab

Use `containerlab cert` to generate a valid CA and device certs:

```bash
containerlab cert generate --name ceos1 --ip 10.109.0.28
```

Copy `ceos1.key`, `ceos1.crt`, and `ca.crt` to the appropriate location.

### On the cEOS device:

```bash
conf t
management api gnmi
   transport grpc default
   gnmi certificate
   gnmi server-certificate flash:server.crt
   gnmi server-private-key flash:server.key
end
write memory
```

### On the client (gnmic):

```yaml
# gnmic.yaml
targets:
  ceos1:
    address: 10.109.0.28:6030
    username: admin
    password: admin
    tls-ca: ./ca.crt
    tls-cert: ./client.crt
    tls-key: ./client.key
```

---

## ⚖️ Step 4: Enable gNMI on cEOS

SSH into your cEOS pod:

```bash
kubectl exec -it -n c9s-ceos-lab ceos1-XXXXX -- ssh admin@ceos1
```

Inside the CLI, configure gNMI:

```bash
conf t
management api gnmi
   transport grpc default
   gnmi insecure
end
write memory
```

Verify it's on:

```bash
show management api gnmi
```

You should see something like:

```
Enabled: yes
Transports:
   grpc default (insecure)
```

---

## 🔧 Step 5: Install `gnmic`

On your local machine or another pod, install [gnmic](https://gnmic.openconfig.net/):

```bash
brew install gnmic  # or see docs for other platforms
```

Create a config file:

```yaml
# gnmic.yaml
targets:
  ceos1:
    address: 10.109.0.28:6030  # adjust to match your pod's IP
    skip-verify: true
    insecure: true
    username: admin
    password: admin
```

---

## 📊 Step 6: Stream Interface Counters

Use `gnmic` to pull data:

```bash
gnmic -c gnmic.yaml get --path "/interfaces/interface/state/counters" --encoding json_ietf
```

Sample output:

```json
{
  "/interfaces/interface[name=Ethernet1]/state/counters": {
    "in-octets": 123456,
    "out-octets": 789012
  }
}
```

You're now pulling live telemetry from your Kubernetes-native cEOS node.

---

## 🧰 What's Next?

You're now in position to:

* Set up subscriptions with `--stream` for real-time graphs
* Push data into a time series DB (e.g., InfluxDB, Prometheus)
* Build dashboards (Grafana, Streamlit, etc.)

---

## 🧠 Run Phase Recap

* Deployed cEOS to Kubernetes using Clabverter
* Uploaded images to DOCR and used them in the pod spec
* Enabled gNMI on a live cEOS pod
* Used `gnmic` to pull interface counters
* Optionally configured certificate-based authentication with `containerlab cert`

---

Next blog? We might just glue it all together in a real-time dashboard — or even automate it all with Terraform + GitHub Actions. Let's keep running 🏃️
