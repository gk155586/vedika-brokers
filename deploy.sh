#!/bin/bash
# ==============================================================================
# Vedika Brokers — Automated VPS / Docker Deployment Script
# ==============================================================================
set -e

echo "🚀 Starting Vedika Brokers Deployment..."

# Verify Docker installation
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   curl -fsSL https://get.docker.com | sh"
    exit 1
fi

# Build and start container
echo "📦 Building and launching Docker container..."
docker compose down || true
docker compose up -d --build

# Verify container is running
echo "🔍 Checking container status..."
sleep 3
if docker ps | grep -q "vedika_brokers_web"; then
    echo "✅ Vedika Brokers is LIVE and running successfully!"
    echo "🌐 Access your site at http://$(curl -s ifconfig.me || echo 'YOUR_SERVER_IP')"
else
    echo "⚠️ Container failed to start. Viewing logs:"
    docker compose logs
    exit 1
fi

# Clean up dangling build cache
echo "🧹 Pruning dangling docker images..."
docker image prune -f

echo "🎉 Deployment completed successfully!"
