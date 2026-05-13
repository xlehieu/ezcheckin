# Quick Commands for Deployment

## 🚀 Quick Start

### On your local machine:

```bash
# 1. Add Docker files
git add Dockerfile .dockerignore .github/workflows/deploy-api.yml
git add DEPLOYMENT_GUIDE.md setup-vps.sh

# 2. Commit
git commit -m "ci: add CI/CD and Docker deployment setup"

# 3. Push to main
git push origin main
```

### On VPS (one time setup):

```bash
# SSH vào VPS
ssh root@your-vps-ip

# Run setup
curl -fsSL https://raw.githubusercontent.com/your-username/ezcheckin/main/setup-vps.sh | sudo bash

# Edit environment
sudo vi /home/deploy/.env_ezcheckin
```

### In GitHub (one time):

1. Go to: `Settings → Secrets and variables → Actions → New repository secret`

2. Add these secrets:
   - `VPS_HOST`: Your VPS IP/domain
   - `VPS_USER`: `deploy`
   - `VPS_PRIVATE_KEY`: Content of `/home/deploy/.ssh/deploy_key`

3. Then just push code to trigger deployment!

---

## 📋 What was created

| File | Purpose |
|------|---------|
| `api/Dockerfile` | Build Docker image |
| `api/.dockerignore` | Exclude files from image |
| `.github/workflows/deploy-api.yml` | GitHub Actions workflow |
| `setup-vps.sh` | VPS setup script |
| `DEPLOYMENT_GUIDE.md` | Full deployment guide |

---

## 🎯 Deployment Flow

```
Push to main
    ↓
GitHub Actions runs
    ↓
Tests & Build Docker image
    ↓
Push to ghcr.io registry
    ↓
SSH into VPS
    ↓
Pull new image
    ↓
Stop old container
    ↓
Run new container
    ↓
Health check ✅
```

---

## 🔗 Useful Links

- Workflow file: `.github/workflows/deploy-api.yml`
- Full guide: `DEPLOYMENT_GUIDE.md`
- Setup script: `setup-vps.sh`

---

**Bắt đầu sử dụng ngay bây giờ!** 🚀
