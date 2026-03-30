# Podman Setup Guide for RIB Safari Booking POC

## What is Podman?

Podman is a container engine that's fully compatible with Docker but doesn't require a daemon. It's:
- **Daemonless** - No background service needed
- **Rootless** - Runs without root privileges by default
- **Secure** - Better security model than Docker
- **Compatible** - Works with docker-compose files

## System Requirements

✅ **Podman installed:**
```bash
podman --version  # Should show version 4.0+
```

✅ **Podman Compose installed:**
```bash
podman-compose --version
```

Install if missing:
```bash
# macOS
brew install podman podman-compose

# Linux (Fedora/RHEL)
sudo dnf install podman podman-compose

# Linux (Ubuntu/Debian)
sudo apt-get install podman podman-compose
```

## Running with Podman

### Option 1: Rootful Podman (simplest)
```bash
podman-compose up
```

### Option 2: Rootless Podman (recommended for security)
```bash
podman-compose --podman-args "--userns=keep-id" up
```

### Option 3: Background Execution
```bash
podman-compose up -d
```

## Common Podman Commands

```bash
# Start services
podman-compose up

# Start in background
podman-compose up -d

# Stop services
podman-compose down

# View logs
podman-compose logs -f

# View specific service logs
podman-compose logs -f web
podman-compose logs -f postgres

# Execute command in container
podman-compose exec web npm run build

# Remove everything including database
podman-compose down -v

# List running containers
podman ps

# List all containers
podman ps -a

# View container details
podman inspect booking_postgres

# Build images manually
podman-compose build
```

## Troubleshooting

### Issue: "Cannot connect to Podman socket"

**Solution:** Make sure Podman socket is available. For rootless mode:
```bash
podman machine start  # If using Podman Desktop
# or
systemctl --user start podman.socket  # For systemd-based systems
```

### Issue: "Permission denied" on volume mounts

**Solution:** Use the rootless flag:
```bash
podman-compose --podman-args "--userns=keep-id" up
```

### Issue: Database won't start

**Solution:** Check logs and ensure PostgreSQL image is available:
```bash
podman-compose logs postgres
podman pull postgres:16-alpine
podman-compose up --build
```

### Issue: Port 3000 or 5432 already in use

**Solution:** Edit docker-compose.yml and change ports:
```yaml
services:
  web:
    ports:
      - "3001:3000"  # Changed from 3000
  postgres:
    ports:
      - "5433:5432"  # Changed from 5432
```

### Issue: Can't resolve 'postgres' hostname

**Solution:** Make sure the network bridge is created:
```bash
podman-compose down
podman network rm booking_network 2>/dev/null || true
podman-compose up
```

## Volume Management

### View volumes
```bash
podman volume ls
```

### Inspect volume
```bash
podman volume inspect booking_web_postgres_data
```

### Remove volume (⚠️ deletes database!)
```bash
podman volume rm booking_web_postgres_data
```

## Image Management

### List images
```bash
podman images
```

### Remove image
```bash
podman rmi booking-web:latest
```

### Clean up unused images
```bash
podman image prune
```

## Performance Optimization

### For macOS with Podman Desktop:
1. Open Podman Desktop settings
2. Go to Resources → Memory
3. Increase allocated memory (4GB+ recommended)
4. Increase CPUs (2+ recommended)

### For Linux:
- Podman runs natively, no VM overhead
- Performance is typically better than Docker

## Comparison: Podman vs Docker

| Feature | Podman | Docker |
|---------|--------|--------|
| Daemon | ✓ None needed | ✗ Required |
| Rootless | ✓ By default | ✗ Requires setup |
| Security | ✓ Better | ✓ Good |
| Compose | ✓ Compatible | ✓ Native |
| CLI | ✓ Compatible | ✓ Different |
| Images | ✓ Compatible | ✓ Same |

## Next Steps

1. Run the POC:
   ```bash
   podman-compose up
   ```

2. Test the app:
   - Homepage: http://localhost:3000
   - About: http://localhost:3000/about
   - Chat button: Bottom-right corner

3. View database:
   ```bash
   podman-compose exec postgres psql -U booking_user -d booking_db
   ```

4. Check logs:
   ```bash
   podman-compose logs -f
   ```

## Resources

- **Podman Docs:** https://docs.podman.io/
- **Podman Compose:** https://github.com/containers/podman-compose
- **Compose Spec:** https://github.com/compose-spec/compose-spec

---

**Ready to go!** Run `podman-compose up` and you're set. 🚀
