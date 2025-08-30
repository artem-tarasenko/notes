# Docker Setup for Notes App

This document explains how to containerize and run the Notes application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Quick Start

### Production Build

1. **Build the production image:**

   ```bash
   ./docker-scripts.sh build
   ```

2. **Run the production container:**

   ```bash
   ./docker-scripts.sh run
   ```

3. **Access the application:**
   Open your browser and go to `http://localhost:4173`

### Development Build

1. **Build the development image:**

   ```bash
   ./docker-scripts.sh build-dev
   ```

2. **Run the development container:**

   ```bash
   ./docker-scripts.sh run-dev
   ```

3. **Access the development server:**
   Open your browser and go to `http://localhost:5173`

## Docker Commands

### Using the Script

```bash
# Build images
./docker-scripts.sh build        # Production
./docker-scripts.sh build-dev    # Development

# Run containers
./docker-scripts.sh run          # Production
./docker-scripts.sh run-dev      # Development

# Stop containers
./docker-scripts.sh stop

# View logs
./docker-scripts.sh logs         # Production
./docker-scripts.sh logs-dev     # Development

# Clean up
./docker-scripts.sh clean

# Access container shell
./docker-scripts.sh shell        # Production
./docker-scripts.sh shell-dev    # Development
```

### Manual Docker Commands

```bash
# Build production image
docker build -t notes-app:latest .

# Build development image
docker build -f Dockerfile.dev -t notes-app:dev .

# Run with docker-compose
docker-compose up -d              # Production
docker-compose -f docker-compose.dev.yml up -d  # Development

# Stop containers
docker-compose down
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose logs -f
docker-compose -f docker-compose.dev.yml logs -f
```

## Architecture

### Production Setup

- **Multi-stage build**: Node.js build stage + nginx serving stage
- **Nginx server**: Optimized for serving React SPA
- **Port**: 4173 (mapped to container port 80)
- **Health check**: Available at `/health` endpoint

### Development Setup

- **Single stage**: Node.js with all dependencies
- **Vite dev server**: Hot reloading enabled
- **Port**: 5173 (Vite default)
- **Volume mounting**: Source code mounted for live updates

## Configuration

### Nginx Configuration (`nginx.conf`)

- Gzip compression enabled
- Security headers added
- SPA routing support (fallback to index.html)
- Static asset caching
- Health check endpoint

### Environment Variables

- `NODE_ENV`: Set to `production` or `development`
- `CHOKIDAR_USEPOLLING`: Enabled for development file watching

## Health Checks

The production container includes a health check endpoint:

```bash
curl http://localhost:4173/health
```

## Troubleshooting

### Common Issues

1. **Port already in use:**

   ```bash
   # Check what's using the port
   lsof -i :4173
   # or
   netstat -tulpn | grep :4173
   ```

2. **Permission denied on script:**

   ```bash
   chmod +x docker-scripts.sh
   ```

3. **Container won't start:**

   ```bash
   # Check logs
   docker-compose logs
   # or
   docker logs notes-app
   ```

4. **Build fails:**
   ```bash
   # Clean and rebuild
   ./docker-scripts.sh clean
   ./docker-scripts.sh build
   ```

### Development Tips

- Use `./docker-scripts.sh logs-dev` to monitor development logs
- The development container supports hot reloading
- Source code changes are reflected immediately
- Use `./docker-scripts.sh shell-dev` to access the development container

## Production Deployment

For production deployment, consider:

1. **Environment variables**: Use `.env` files or Docker secrets
2. **Reverse proxy**: Use nginx or traefik in front of the container
3. **SSL/TLS**: Configure HTTPS termination
4. **Monitoring**: Add logging and monitoring solutions
5. **Scaling**: Use Docker Swarm or Kubernetes for orchestration

## Security Considerations

- The nginx configuration includes security headers
- Production build uses multi-stage to reduce attack surface
- Health check endpoint is available for monitoring
- Consider adding rate limiting and additional security measures for production use
