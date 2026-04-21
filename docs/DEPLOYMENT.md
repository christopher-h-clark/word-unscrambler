# Deployment Guide

## Production Environment Configuration

Production deployments require environment variables to be configured securely.
This guide covers setting up environment configuration for different deployment
scenarios.

## GitHub Secrets Setup (CI/CD Deployments)

For production deployments via GitHub Actions, store sensitive environment
variables as GitHub Secrets.

### 1. Add Secrets to GitHub Repository

1. Go to your repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** for each variable:

| Secret Name      | Value                                 | Notes                                              |
| ---------------- | ------------------------------------- | -------------------------------------------------- |
| `CORS_ORIGIN`    | `https://yourdomain.com`              | Frontend domain for CORS. Required for production. |
| `WORD_LIST_PATH` | `/app/packages/server/data/words.txt` | Dictionary file path. Default works in Docker.     |
| `NODE_ENV`       | `production`                          | Always `production` for production deployments.    |
| `PORT`           | `3000`                                | Container port. Usually `3000`.                    |

### 2. Reference Secrets in CI/CD Workflow

In `.github/workflows/ci.yml` or deployment workflow, reference secrets:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Production
        env:
          NODE_ENV: production
          CORS_ORIGIN: ${{ secrets.CORS_ORIGIN }}
          WORD_LIST_PATH: ${{ secrets.WORD_LIST_PATH }}
        run: |
          # Your deployment script here
          docker-compose up -d
```

## Docker Deployment

### Using docker-compose

The project includes a `docker-compose.yml` configured for production. Override
environment variables at runtime:

```bash
# Using environment variables
CORS_ORIGIN=https://yourdomain.com docker-compose up -d

# Or set in docker-compose.override.yml
cat > docker-compose.override.yml <<EOF
services:
  word-unscrambler:
    environment:
      CORS_ORIGIN: https://yourdomain.com
      NODE_ENV: production
EOF
docker-compose up -d
```

### Building and Running Directly

```bash
# Build image
docker build -t word-unscrambler:latest .

# Run with environment overrides
docker run -d \
  -e CORS_ORIGIN=https://yourdomain.com \
  -e NODE_ENV=production \
  -p 3000:3000 \
  word-unscrambler:latest
```

### Health Check

The Docker image includes a health check on `/api/health`:

```bash
curl http://localhost:3000/api/health
# Response: {"status":"ok"}
```

## Environment Variables Reference

### Required for Production

| Variable      | Example                  | Purpose                                                                                     |
| ------------- | ------------------------ | ------------------------------------------------------------------------------------------- |
| `CORS_ORIGIN` | `https://yourdomain.com` | Controls which frontend domains can make API requests. **Must match your frontend domain.** |
| `NODE_ENV`    | `production`             | Enables production optimizations and disables debug output.                                 |

### Optional (Defaults Provided)

| Variable         | Default                            | Purpose                                                                     |
| ---------------- | ---------------------------------- | --------------------------------------------------------------------------- |
| `PORT`           | `3000`                             | Server port. Change if port 3000 is unavailable.                            |
| `WORD_LIST_PATH` | `./packages/server/data/words.txt` | Dictionary file location. In Docker: `/app/packages/server/data/words.txt`. |

## Deployment Checklist

Before deploying to production:

- [ ] **Set `CORS_ORIGIN`** to your frontend domain
- [ ] **Verify `NODE_ENV=production`** is set
- [ ] **Test API endpoint**:
      `curl https://yourdomain.com/unscrambler/v1/words?letters=abc`
- [ ] **Test health check**: `curl https://yourdomain.com/api/health`
- [ ] **Verify frontend loads** and can connect to backend
- [ ] **Monitor logs** for startup errors: `docker logs <container-id>`

## Common Issues

### CORS Errors

**Symptom**: Frontend shows "CORS error" or "Access-Control-Allow-Origin" error

**Fix**: Verify `CORS_ORIGIN` matches your frontend domain exactly

```bash
# Check current value
docker exec <container-id> env | grep CORS_ORIGIN

# Update if needed
docker exec <container-id> -e CORS_ORIGIN=https://yourdomain.com
```

### Dictionary Not Found

**Symptom**: Server fails to start with "Dictionary file not found"

**Fix**: Verify `WORD_LIST_PATH` is correct. In Docker, it should be:

```
/app/packages/server/data/words.txt
```

### Port Already in Use

**Symptom**: "Port 3000 is already in use"

**Fix**: Use a different port:

```bash
docker run -e PORT=4000 -p 4000:3000 word-unscrambler:latest
```

## Production Readiness

This deployment is suitable for:

- Small to medium workloads
- Internal deployments
- Staging environments
- Educational/learning purposes

For large-scale production, consider:

- Load balancing (multiple instances)
- Database for persistent storage
- CDN for static assets
- Monitoring and alerting
- Automated backups

## More Information

- [DEVELOPMENT.md](./DEVELOPMENT.md) — Local development setup
- [project-context.md](../project-context.md) — Technology stack and
  architecture
- [README.md](../README.md) — Quick start guide
