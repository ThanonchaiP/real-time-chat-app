# Kubernetes Deployment Setup

## Overview

This project uses GitHub Actions to automatically deploy to DigitalOcean Kubernetes cluster when a release is published.

## Architecture

```
Release → Build Docker Images → Push to ECR → Deploy to K8s
```

## Workflow Files

- **`.github/workflows/release.yaml`** - Main release workflow
- **`.github/workflows/deploy-k8s.yaml`** - Reusable deployment workflow
- **`k8s/`** - Kubernetes manifests

## Required GitHub Secrets

### AWS ECR

```
AWS_ACCESS_KEY_ID           # AWS Access Key
AWS_SECRET_ACCESS_KEY       # AWS Secret Key
AWS_REGION                  # e.g., ap-southeast-1
ECR_REGISTRY                # e.g., 123456789012.dkr.ecr.region.amazonaws.com
```

### DigitalOcean

```
DIGITALOCEAN_ACCESS_TOKEN   # DigitalOcean API Token
DO_CLUSTER_ID              # Kubernetes Cluster ID
```

## Setup Steps

### 1. Create DigitalOcean Kubernetes Cluster

```bash
# Using doctl (optional)
doctl kubernetes cluster create my-cluster \
  --count 3 \
  --size s-2vcpu-2gb \
  --region sgp1
```

### 2. Setup Namespaces

```bash
kubectl apply -f k8s/namespaces.yaml
```

### 3. Deploy Initial Manifests (First Time)

```bash
# Update image URLs in deployment files first
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
```

### 4. Configure GitHub Secrets

Go to Repository Settings → Secrets and variables → Actions

## Release Patterns

### Tag Patterns and Behavior:

- **`v1.0.0`** → Builds and deploys both frontend and backend

  - Frontend image: `frontend-v1.0.0`
  - Backend image: `backend-v1.0.0`

- **`frontend-v1.0.0`** → Builds and deploys only frontend

  - Frontend image: `frontend-v1.0.0`

- **`backend-v1.0.0`** → Builds and deploys only backend
  - Backend image: `backend-v1.0.0`

## Workflow Steps

### 1. Build Stage

- Checkout code
- Build Docker images
- Push to AWS ECR

### 2. Deploy Stage

- Configure kubectl for DigitalOcean
- Update Kubernetes deployments
- Wait for rollout completion
- Verify deployment status

## Monitoring

### Check Deployment Status

```bash
# Check deployments
kubectl get deployments -n production

# Check pods
kubectl get pods -n production

# Check logs
kubectl logs -f deployment/frontend-production -n production
kubectl logs -f deployment/backend-production -n production
```

### Rollback (if needed)

```bash
# Rollback to previous version
kubectl rollout undo deployment/frontend-production -n production
kubectl rollout undo deployment/backend-production -n production
```

## Troubleshooting

### Common Issues:

1. **Image pull errors** - Check ECR permissions and image tags
2. **Deployment timeout** - Check resource limits and health checks
3. **Service not accessible** - Verify ingress and DNS configuration

### Debug Commands:

```bash
# Describe deployment
kubectl describe deployment frontend-production -n production

# Check events
kubectl get events -n production --sort-by=.metadata.creationTimestamp

# Port forward for testing
kubectl port-forward deployment/frontend-production 3000:3000 -n production
```
