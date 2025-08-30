#!/bin/bash

# Docker management scripts for Notes App

case "$1" in
  "build")
    echo "Building production Docker image..."
    docker build -t notes-app:latest .
    ;;
  "build-dev")
    echo "Building development Docker image..."
    docker build -f Dockerfile.dev -t notes-app:dev .
    ;;
  "run")
    echo "Running production container..."
    docker-compose up -d
    ;;
  "run-dev")
    echo "Running development container..."
    docker-compose -f docker-compose.dev.yml up -d
    ;;
  "stop")
    echo "Stopping containers..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    ;;
  "logs")
    echo "Showing production logs..."
    docker-compose logs -f
    ;;
  "logs-dev")
    echo "Showing development logs..."
    docker-compose -f docker-compose.dev.yml logs -f
    ;;
  "clean")
    echo "Cleaning up Docker resources..."
    docker-compose down --rmi all --volumes --remove-orphans
    docker-compose -f docker-compose.dev.yml down --rmi all --volumes --remove-orphans
    docker system prune -f
    ;;
  "shell")
    echo "Opening shell in production container..."
    docker-compose exec notes-app sh
    ;;
  "shell-dev")
    echo "Opening shell in development container..."
    docker-compose -f docker-compose.dev.yml exec notes-app-dev sh
    ;;
  *)
    echo "Usage: $0 {build|build-dev|run|run-dev|stop|logs|logs-dev|clean|shell|shell-dev}"
    echo ""
    echo "Commands:"
    echo "  build      - Build production Docker image"
    echo "  build-dev  - Build development Docker image"
    echo "  run        - Run production container"
    echo "  run-dev    - Run development container"
    echo "  stop       - Stop all containers"
    echo "  logs       - Show production logs"
    echo "  logs-dev   - Show development logs"
    echo "  clean      - Clean up Docker resources"
    echo "  shell      - Open shell in production container"
    echo "  shell-dev  - Open shell in development container"
    exit 1
    ;;
esac
