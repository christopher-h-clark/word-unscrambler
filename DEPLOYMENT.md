# Deployment Guide

Complete guide for deploying word-unscrambler to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Docker Testing](#local-docker-testing)
3. [Production Deployment](#production-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Health Checks & Monitoring](#health-checks--monitoring)
6. [Rollback Procedures](#rollback-procedures)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

- Docker installed and running
- Docker Compose (usually comes with Docker)
- Production domain and SSL certificate (if using HTTPS)
- GitHub Secrets configured for CI/CD

## Local Docker Testing

### Build Docker Image

```bash
docker build -t word-unscrambler:latest .
```

### Run with Docker Compose

```bash
docker-compose up -d
```

### Verify Application

```bash
# Check container status
docker ps | grep word-unscrambler

# Test API
curl http://localhost:3000/unscrambler/v1/words?letters=abc

# Open frontend
open http://localhost:3000

# View logs
docker logs word-unscrambler

# Stop container
docker-compose down
```

## Production Deployment

### Option 1: Docker Registry (Recommended)

Replace `<your-registry>` with your registry URL (e.g., `ghcr.io/yourusername`,
`docker.io/yourusername`, or your private registry).

1. **Build and tag image:**

   ```bash
   docker build -t <your-registry>/word-unscrambler:v1.0.0 .
   ```

2. **Push to registry:**

   ```bash
   docker push <your-registry>/word-unscrambler:v1.0.0
   ```

3. **Deploy to production:**

   ```bash
   docker run \
     --name word-unscrambler \
     -p 3000:3000 \
     -e NODE_ENV=production \
     -e CORS_ORIGIN=https://yourdomain.com \
     <your-registry>/word-unscrambler:v1.0.0
   ```

   **Example:** `docker run ... ghcr.io/myusername/word-unscrambler:v1.0.0`

### Option 2: Kubernetes (Advanced)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: word-unscrambler
spec:
  containers:
    - name: word-unscrambler
      image: your-registry/word-unscrambler:latest
      ports:
        - containerPort: 3000
      env:
        - name: NODE_ENV
          value: 'production'
        - name: CORS_ORIGIN
          value: 'https://yourdomain.com'
```

### Option 3: Heroku / Cloud Platform

```bash
# Deploy using platform-specific instructions
# Usually involves:
# 1. Push to Heroku Git remote
# 2. Set environment variables via UI or CLI
# 3. Platform builds and deploys automatically
```

## Environment Configuration

### Required Variables (Production)

```env
NODE_ENV=production
PORT=3000
WORD_LIST_PATH=./packages/server/data/words.txt
CORS_ORIGIN=https://yourdomain.com
REACT_APP_API_URL=https://api.yourdomain.com
```

### Set Variables

**Via Docker:**

```bash
docker run \
  -e NODE_ENV=production \
  -e CORS_ORIGIN=https://yourdomain.com \
  word-unscrambler:latest
```

**Via docker-compose.yml:**

```yaml
services:
  word-unscrambler:
    environment:
      NODE_ENV: production
      CORS_ORIGIN: https://yourdomain.com
```

**Via GitHub Secrets (CI/CD):**

1. Go to repository Settings → Secrets
2. Add secrets:
   - `BACKEND_NODE_ENV`: production
   - `BACKEND_CORS_ORIGIN`: https://yourdomain.com
   - `FRONTEND_API_URL`: https://api.yourdomain.com

## Health Checks & Monitoring

### Built-in Health Check

Docker compose includes HTTP health check:

```bash
curl http://localhost:3000
```

Should return HTML (frontend page).

### Monitor Logs

```bash
docker logs -f word-unscrambler
```

Watch for:

- `[INFO] Dictionary loaded` - Dictionary ready
- `[INFO] Server running on port` - Server started
- `[FATAL]` - Critical errors (server will exit)

### Performance Monitoring

**API Response Time:**

```bash
time curl http://localhost:3000/unscrambler/v1/words?letters=abc
```

Should be < 1 second.

**Dictionary Load Time:**

Check logs on startup:

```
[INFO] Dictionary loaded in 892ms
```

Should be < 5 seconds.

### CPU/Memory Monitoring

```bash
docker stats word-unscrambler
```

Expected:

- CPU: < 5% at rest
- Memory: ~100-200MB

## Rollback Procedures

### Docker Rollback

```bash
# If new deployment has issues, use previous image
docker-compose down
docker run \
  -d \
  --name word-unscrambler \
  your-registry/word-unscrambler:v1.0.0  # Previous version
```

### Git Rollback

```bash
# If deployment code is bad, roll back commits
git revert <bad-commit-hash>
git push
# Re-deploy from main branch
```

### Database Rollback

N/A - This app doesn't use a database. No data to restore.

## Scaling

### Horizontal Scaling

For high traffic, run multiple instances behind load balancer:

```yaml
version: '3.8'
services:
  word-unscrambler-1:
    image: word-unscrambler:latest
    port: 3001:3000

  word-unscrambler-2:
    image: word-unscrambler:latest
    port: 3002:3000

  load-balancer:
    image: nginx:latest
    ports:
      - '3000:80'
    # Configure to round-robin to instances
```

### Vertical Scaling

For memory/CPU bottlenecks, increase container resources:

```bash
docker run \
  --memory=512m \
  --cpus=2 \
  word-unscrambler:latest
```

## Troubleshooting

### Container Won't Start

**Check logs:**

```bash
docker logs word-unscrambler
```

**Common issues:**

- Dictionary file missing: Rebuild image
- Wrong environment variables: Check docker-compose.yml
- Port already in use: Change port mapping

### 404 Error When Accessing App

**Problem:** Frontend not being served by Express

**Solution:** Verify in `packages/server/src/app.ts`:

```typescript
app.use(express.static(path.join(__dirname, '../client/dist')));
```

### CORS Errors in Browser

**Problem:** `CORS_ORIGIN` environment variable doesn't match frontend origin

**Solution:** Set correct origin:

```bash
CORS_ORIGIN=https://yourdomain.com
```

### API Returns Empty Results for All Inputs

**Problem:** Dictionary file not loaded properly

**Solution:**

```bash
# Verify file exists in container
docker exec word-unscrambler ls -la /app/packages/server/data/

# Check logs
docker logs word-unscrambler | grep -i dictionary
```

## Monitoring & Alerts

### Log Aggregation

Collect Docker logs to centralized service:

```bash
docker logs word-unscrambler | tee /var/log/word-unscrambler.log
```

### Performance Metrics

Track over time:

- API response times (target: < 1s)
- Dictionary load time (target: < 5s)
- Error rate (target: < 0.1%)

### Alerts to Set Up

- Container exits unexpectedly
- Memory usage > 500MB
- API response time > 5 seconds
- Health check fails

---

**Next:** See [DEVELOPMENT.md](DEVELOPMENT.md) for local development setup.
