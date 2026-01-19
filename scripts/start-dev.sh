#!/bin/bash
set -e

echo "🚀 Starting local development environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Error: Docker is not running. Please start Docker and try again."
  exit 1
fi

# Check if .env exists
if [ ! -f .env ]; then
  echo "⚠️  No .env file found. Creating from .env.example..."
  cp .env.example .env
  echo "✅ Created .env file. Please update it with your configuration."
  echo ""
fi

# Start MongoDB
echo "📦 Starting MongoDB container..."
docker-compose up -d mongodb

# Wait for MongoDB to be healthy
echo "⏳ Waiting for MongoDB to be ready..."
timeout=60
elapsed=0
while [ $elapsed -lt $timeout ]; do
  if docker-compose ps mongodb | grep -q "healthy"; then
    echo "✅ MongoDB is ready!"
    break
  fi
  sleep 2
  elapsed=$((elapsed + 2))
done

if [ $elapsed -ge $timeout ]; then
  echo "❌ MongoDB failed to start within ${timeout} seconds"
  docker-compose logs mongodb
  exit 1
fi

echo ""
echo "🎉 Development environment is ready!"
echo ""
echo "MongoDB connection string: mongodb://localhost:27017/donation-inventory"
echo ""
echo "To start the Payload server, run:"
echo "  npm run dev"
echo ""
echo "To stop MongoDB, run:"
echo "  docker-compose down"
echo ""
