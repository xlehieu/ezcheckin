#!/bin/bash

set -e

echo "🚀 Setting up EzCheckin API deployment on VPS"
echo "================================================"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
   echo -e "${RED}Please run this script with sudo${NC}"
   exit 1
fi

echo -e "${YELLOW}Step 1: Installing Docker${NC}"
apt-get update
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

echo -e "${GREEN}✓ Docker installed${NC}"

echo -e "${YELLOW}Step 2: Setting up deployment user${NC}"
if ! id -u deploy &>/dev/null; then
    useradd -m -s /bin/bash deploy
    echo -e "${GREEN}✓ User 'deploy' created${NC}"
else
    echo -e "${GREEN}✓ User 'deploy' already exists${NC}"
fi

# Add deploy user to docker group
usermod -aG docker deploy

echo -e "${YELLOW}Step 3: Creating Docker network and volumes${NC}"
docker network create ezcheckin-network || echo "Network already exists"
docker volume create ezcheckin-api-logs || echo "Volume already exists"

echo -e "${GREEN}✓ Network and volumes ready${NC}"

echo -e "${YELLOW}Step 4: Setting up environment file${NC}"
echo "Creating /home/deploy/.env_ezcheckin"
echo "Please edit this file with your actual values:"
cat > /home/deploy/.env_ezcheckin << 'EOF'
# Database
MONGODB_URI=mongodb://mongo:27017/ezcheckin
MONGODB_REPLICA_SET=rs0

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Application
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-me
JWT_EXPIRES_IN=7d

# API Keys
API_KEY=your-api-key-here

# Email (Optional)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Other config
CORS_ORIGIN=https://yourdomain.com
EOF

chown deploy:deploy /home/deploy/.env_ezcheckin
chmod 600 /home/deploy/.env_ezcheckin

echo -e "${YELLOW}⚠️  Please edit /home/deploy/.env_ezcheckin with your actual configuration${NC}"

echo -e "${YELLOW}Step 5: Setting up MongoDB and Redis${NC}"
cat > /home/deploy/docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  mongo:
    image: mongo:7.0
    container_name: ezcheckin-mongo
    restart: unless-stopped
    command: ['--replSet', 'rs0', '--bind_ip_all', '--port', '27017']
    volumes:
      - mongo-data:/data/db
      - mongo-config:/data/configdb
    networks:
      - ezcheckin-network
    healthcheck:
      test: mongosh --quiet --eval "try { rs.initiate({_id:'rs0',members:[{_id:0,host:'127.0.0.1:27017'}]}) } catch(e) { rs.status().ok }"
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  redis:
    image: redis:7-alpine
    container_name: ezcheckin-redis
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD:-changeme}
    volumes:
      - redis-data:/data
    networks:
      - ezcheckin-network
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 3s
      retries: 5
      start_period: 10s

volumes:
  mongo-data:
  mongo-config:
  redis-data:

networks:
  ezcheckin-network:
    external: true
EOF

chown deploy:deploy /home/deploy/docker-compose.prod.yml
echo -e "${GREEN}✓ Docker Compose file created at /home/deploy/docker-compose.prod.yml${NC}"

echo -e "${YELLOW}Step 6: Starting background services${NC}"
cd /home/deploy
docker-compose -f docker-compose.prod.yml up -d

echo -e "${GREEN}✓ MongoDB and Redis are running${NC}"

echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}✅ VPS Setup Complete!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo "📝 Next steps:"
echo "1. Edit environment file: /home/deploy/.env_ezcheckin"
echo "2. Add SSH public key to GitHub secrets:"
echo "   - Copy /root/.ssh/id_rsa (private key)"
echo "   - Go to GitHub Repo → Settings → Secrets → New repository secret"
echo "   - Add VPS_PRIVATE_KEY, VPS_HOST, VPS_USER"
echo ""
echo "3. Generate SSH key for deploy user:"
echo "   sudo -u deploy ssh-keygen -t ed25519 -f /home/deploy/.ssh/deploy_key -N ''"
echo ""
echo "4. Verify MongoDB is running:"
echo "   docker ps | grep ezcheckin-mongo"
echo ""
echo "5. Run first deployment after pushing to main branch"
echo ""
