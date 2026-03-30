# Minikube Testing Guide

This guide explains how to validate FeedPulse on Minikube for local Kubernetes testing.

## Scope
Current repository ships Docker Compose assets by default. This guide provides a practical Minikube testing flow and sample approach. If you add Kubernetes manifests, store them under `k8s/` and update this file with exact commands.

## Prerequisites
- Minikube
- kubectl
- Docker

## 1) Start Minikube
```bash
minikube start
```

## 2) Build images for Minikube Docker daemon
```bash
eval "$(minikube docker-env)"
docker build -t feedpulse-frontend:local ./frontend
docker build -t feedpulse-gateway:local ./services/gateway
docker build -t feedpulse-auth:local ./services/auth-service
docker build -t feedpulse-feedback:local ./services/feedback-service
docker build -t feedpulse-ai:local ./services/ai-service
```

## 3) Apply Kubernetes manifests
Example (if you create manifests):
```bash
kubectl apply -f k8s/
```

## 4) Check pods and services
```bash
kubectl get pods -A
kubectl get svc -A
```

## 5) Access app
If using NodePort or LoadBalancer emulation:
```bash
minikube service <frontend-service-name>
```

## 6) Smoke tests
- Submit feedback from UI.
- Login to dashboard.
- Verify list/filter/status update.
- Verify summary endpoint via gateway.

## 7) Debug commands
```bash
kubectl logs deployment/gateway
kubectl logs deployment/feedback-service
kubectl logs deployment/ai-service
```

## Suggested next step
Add concrete Kubernetes manifests (`Deployment`, `Service`, optional `Ingress`, `ConfigMap`, `Secret`) and update this guide with exact names and health probes.

