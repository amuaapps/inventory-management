#!/bin/bash
set -e

echo "🛑 Stopping local development environment..."

# Stop and remove containers
docker-compose down

echo "✅ Development environment stopped."
echo ""
echo "Note: MongoDB data is preserved in Docker volumes."
echo "To remove all data, run: docker-compose down -v"
echo ""
