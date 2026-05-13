# 🚀 Hướng dẫn Deploy API lên VPS với GitHub Actions

## 📋 Tổng quan

Setup này sẽ giúp bạn tự động deploy API NestJS lên VPS mỗi khi push code lên GitHub.

**Công nghệ sử dụng:**
- GitHub Actions (CI/CD)
- Docker (containerization)
- GitHub Container Registry (image storage)
- SSH (secure deployment)

---

## 🔧 Bước 1: Chuẩn bị VPS

### 1.1 Chạy script setup (khuyên cáo)

```bash
# SSH vào VPS
ssh root@your-vps-ip

# Download và chạy script setup
curl -fsSL https://raw.githubusercontent.com/your-username/ezcheckin/main/setup-vps.sh | sudo bash
```

### 1.2 Setup thủ công (nếu không dùng script)

```bash
# 1. Cập nhật hệ thống
sudo apt-get update && sudo apt-get upgrade -y

# 2. Cài Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 3. Tạo network và volume
docker network create ezcheckin-network
docker volume create ezcheckin-api-logs

# 4. Tạo file environment
sudo vi /home/deploy/.env_ezcheckin
```

### 1.3 File environment (.env_ezcheckin)

```env
# Database
MONGODB_URI=mongodb://mongo:27017/ezcheckin
MONGODB_REPLICA_SET=rs0

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your-secure-redis-password

# Application
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# JWT
JWT_SECRET=your-very-secure-jwt-secret-key-min-32-chars
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://yourdomain.com

# Email (Optional)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### 1.4 Khởi động MongoDB và Redis

```bash
# Sử dụng docker-compose.prod.yml nếu đã tạo
docker-compose -f docker-compose.prod.yml up -d

# Hoặc chạy container riêng lẻ
docker run -d --name ezcheckin-mongo \
  --network ezcheckin-network \
  -v mongo-data:/data/db \
  mongo:7.0 \
  --replSet rs0

docker run -d --name ezcheckin-redis \
  --network ezcheckin-network \
  -v redis-data:/data \
  redis:7-alpine
```

---

## 🔐 Bước 2: Cấu hình GitHub Secrets

### 2.1 Tạo SSH Key

```bash
# SSH vào VPS và tạo key cho deploy
ssh root@your-vps-ip
ssh-keygen -t ed25519 -f /home/deploy/.ssh/deploy_key -N ''
cat /home/deploy/.ssh/deploy_key.pub >> /home/deploy/.ssh/authorized_keys
```

### 2.2 Copy private key

```bash
# Lấy nội dung private key (trên VPS)
cat /home/deploy/.ssh/deploy_key
# Copy toàn bộ output, bao gồm -----BEGIN... và -----END...
```

### 2.3 Thêm vào GitHub Secrets

1. Vào GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Tạo các secrets sau:

| Secret Name | Giá trị |
|------------|--------|
| `VPS_HOST` | IP hoặc domain của VPS (vd: 123.45.67.89) |
| `VPS_USER` | SSH username (thường là `deploy`) |
| `VPS_PRIVATE_KEY` | Nội dung của private key vừa tạo |

**Ví dụ:**
- VPS_HOST: `your-server.com`
- VPS_USER: `deploy`
- VPS_PRIVATE_KEY: (toàn bộ nội dung file)

---

## 📤 Bước 3: GitHub Actions Workflow

File workflow đã được tạo tại `.github/workflows/deploy-api.yml`

**Quy trình tự động:**

1. **Push code** → main hoặc develop branch
2. **GitHub Actions triggers**
3. **Build Docker image** → test & build
4. **Push to Registry** → GitHub Container Registry
5. **Deploy to VPS** via SSH
6. **Run container** → tự động restart

### Cách thức hoạt động:

```
push code
    ↓
GitHub Actions
    ↓
Build Docker image
    ↓
Push to ghcr.io
    ↓
SSH vào VPS
    ↓
Pull image mới
    ↓
Stop container cũ
    ↓
Run container mới
    ↓
Health check
```

---

## 🚀 Bước 4: Thực hiện deployment đầu tiên

### 4.1 Push code lên GitHub

```bash
git add .
git commit -m "feat: add CI/CD setup"
git push origin main
```

### 4.2 Theo dõi GitHub Actions

1. Vào GitHub repo → **Actions**
2. Xem log của workflow "Deploy API to VPS"
3. Chờ đến khi hoàn tất

### 4.3 Kiểm tra trên VPS

```bash
ssh deploy@your-vps-ip

# Xem container đang chạy
docker ps | grep ezcheckin-api

# Xem logs
docker logs -f ezcheckin-api

# Kiểm tra health check
curl -I http://localhost:3000
```

---

## 📊 Monitoring & Logs

### Xem logs trên VPS

```bash
# Real-time logs
docker logs -f ezcheckin-api

# Last 100 lines
docker logs --tail 100 ezcheckin-api

# Logs từ ngày hôm qua
docker logs --since 24h ezcheckin-api
```

### Kiểm tra container status

```bash
# Tất cả container ezcheckin
docker ps -a | grep ezcheckin

# Chi tiết container
docker inspect ezcheckin-api

# Stats CPU/Memory
docker stats ezcheckin-api
```

---

## 🔄 Update/Redeploy

### Tự động (khuyên cáo)

```bash
# Chỉ cần push code
git push origin main
# GitHub Actions tự động deploy
```

### Thủ công

```bash
ssh deploy@your-vps-ip

# Pull image mới
docker pull ghcr.io/your-username/ezcheckin/api:main

# Restart container
docker stop ezcheckin-api
docker rm ezcheckin-api
docker run -d \
  --name ezcheckin-api \
  --restart unless-stopped \
  -p 3000:3000 \
  --network ezcheckin-network \
  --env-file ~/.env_ezcheckin \
  -v ezcheckin-api-logs:/app/logs \
  ghcr.io/your-username/ezcheckin/api:main
```

---

## 🆘 Troubleshooting

### 1. GitHub Actions fails with SSH error

**Lỗi:** `Permission denied (publickey)`

**Giải pháp:**
- Kiểm tra VPS_PRIVATE_KEY trong GitHub Secrets
- Đảm bảo key có format đúng (bao gồm BEGIN/END)
- Thử tạo key mới: `ssh-keygen -t ed25519 -f ~/.ssh/deploy_key`

### 2. Container fails to start

**Lỗi:** `docker: Error response from daemon`

**Kiểm tra:**
```bash
docker logs ezcheckin-api
docker ps -a | grep ezcheckin-api
```

### 3. MongoDB connection failed

**Lỗi:** `ECONNREFUSED` hoặc `connection timed out`

**Giải pháp:**
```bash
# Kiểm tra MongoDB container
docker ps | grep mongo

# Khởi động MongoDB
docker-compose -f docker-compose.prod.yml up -d mongo

# Kiểm tra network
docker network ls
docker network inspect ezcheckin-network
```

### 4. Xóa cũ và deploy lại

```bash
ssh deploy@your-vps-ip

# Dừng container
docker stop ezcheckin-api ezcheckin-mongo ezcheckin-redis
docker rm ezcheckin-api ezcheckin-mongo ezcheckin-redis

# Xóa volume (⚠️ sẽ mất dữ liệu)
docker volume rm mongo-data redis-data ezcheckin-api-logs

# Sau đó push code để GitHub Actions deploy lại
```

---

## 🔒 Best Practices

### 1. Security
- ✅ Sử dụng SSH key authentication
- ✅ Giữ `.env` file safe (không commit)
- ✅ Rotate secrets thường xuyên
- ✅ Sử dụng read-only SSH key nếu có thể

### 2. Deployment
- ✅ Luôn test trên develop branch trước
- ✅ Kiểm tra logs sau mỗi deployment
- ✅ Keep backups của database
- ✅ Sử dụng health checks

### 3. Monitoring
- ✅ Thiết lập alerts cho container crashes
- ✅ Monitor disk space, CPU, memory
- ✅ Keep logs để debug issues
- ✅ Regular health checks

---

## 📝 Cheat Sheet

```bash
# SSH vào VPS
ssh deploy@your-vps-ip

# Xem container đang chạy
docker ps

# Xem logs
docker logs -f ezcheckin-api

# Restart container
docker restart ezcheckin-api

# Dừng container
docker stop ezcheckin-api

# Xóa container
docker rm ezcheckin-api

# Pull image mới
docker pull ghcr.io/username/ezcheckin/api:main

# Kiểm tra disk usage
df -h

# Kiểm tra Docker volumes
docker volume ls

# Clear unused images
docker image prune -a
```

---

## 📞 Support

Nếu gặp vấn đề:

1. Kiểm tra GitHub Actions logs
2. SSH vào VPS và kiểm tra container logs
3. Đảm bảo environment variables đúng
4. Kiểm tra network connectivity
5. Xem MongoDB/Redis status

---

**Happy Deploying! 🎉**
