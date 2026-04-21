# Word Unscrambler

A fast, accessible word lookup application that finds all valid English words
you can form from a set of letters.

## Features

- 🔤 **Quick Lookup** - Enter 3-10 letters and get instant results
- 🎯 **Organized Results** - Words grouped by length (3-10 characters),
  alphabetically sorted
- 🌙 **Dark Theme** - Modern, easy-on-the-eyes interface
- ♿ **Accessible** - WCAG AA compliance, keyboard and screen reader friendly
- ⚡ **Fast** - Response times < 10 seconds maximum (typical < 1 second)
- 📦 **Lightweight** - Frontend bundle < 100KB gzipped

## Quick Start

### Prerequisites

- Node.js 18+ LTS
- npm 8+
- Git

> **Want to understand the architecture first?** See
> [ARCHITECTURE.md](docs/ARCHITECTURE.md) for system design, technology choices,
> and component structure.

### 5-Minute Setup

> **Setup time varies by network speed.** The steps below take ~5 minutes on
> typical broadband. On slower connections, `npm install` may take 10+ minutes.

```bash
# 1. Clone repository
git clone <repo-url>
cd word-unscrambler

# 2. Configure frontend environment (REQUIRED before npm install)
cd packages/client
cp .env.example .env.local
# Edit if needed, but defaults usually work

# 3. Configure backend environment (REQUIRED before npm install)
cd ../server
cp .env.example .env.local
# Edit if needed, but defaults usually work

# 4. Return to root and install dependencies
cd ../..
npm install

# 5. Start development servers
npm run dev

# 6. Open in browser
# Frontend: http://localhost:5173
# API: http://localhost:3000
```

The app is now running! Enter letters in the input field to see results.

### Expected Startup Output

```
$ npm run dev
npm run dev:client & npm run dev:server

VITE v5.0.0  ready in 234 ms
➜  local:   http://localhost:5173/
➜  press h + enter to show help

[INFO] Dictionary loaded in 892ms
[INFO] Starting server on port 3000
[INFO] CORS configured for http://localhost:5173
```

## Usage

The app finds all valid English words (3-10 letters) that can be formed from
your input letters.

1. **Enter Letters**: Type 3-10 letters in the input field (a-z,
   case-insensitive)
   - Only letters a-z are accepted; numbers and special characters are ignored
   - Results limited to words 3-10 characters long (shorter and longer words not
     in dictionary)
2. **Optional Wildcard**: Use `?` to match any single letter (e.g., `h?llo`
   matches "hello" and "hullo")
3. **Submit**: Press Enter or click "Unscramble!" button
4. **View Results**: Words appear grouped by length, sorted alphabetically
   - If no words found: "No words match your letters. Try different letters!"
5. **Try Again**: Click the input field to clear and start a new search

### Example

Input: `abc` Output:

```
3-Letter Words
abc  bac  cab

No other words found
```

Input: `h?llo` Output:

```
5-Letter Words
hello  hullo
```

## Tech Stack

### Frontend

- **React 18+** - UI components
- **TypeScript 5.0+** - Type safety
- **Vite 5+** - Fast build tool with HMR
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Vitest** - Unit testing
- **Playwright** - E2E testing

### Backend

- **Node.js 18+ LTS** - Runtime
- **Express 4.18+** - Web framework
- **TypeScript 5.0+** - Type safety
- **Vitest** - Unit testing
- **Supertest** - API testing

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Local orchestration

## Project Structure

```
word-unscrambler/
├── packages/
│   ├── client/          # React frontend
│   └── server/          # Express backend
├── e2e/                 # Playwright tests
├── docs/                # Documentation
├── Dockerfile           # Multi-stage Docker build
├── docker-compose.yml   # Local development
├── README.md            # This file
├── DEVELOPMENT.md       # Dev setup & workflow
└── DEPLOYMENT.md        # Production deployment
```

## Commands

### Development

```bash
npm run dev              # Start both frontend and backend
npm run dev:client      # Frontend only (port 5173)
npm run dev:server      # Backend only (port 3000)
```

### Testing

```bash
npm run test            # Run all tests
npm run test:client     # Client tests only
npm run test:server     # Server tests only
npm run test:e2e        # E2E tests (Playwright)
```

### Building

```bash
npm run build           # Build both frontend and backend
npm run build:client    # Frontend build only
npm run build:server    # Backend build only
```

### Docker

```bash
docker build -t word-unscrambler:latest .
docker-compose up      # Start containerized app
docker-compose down     # Stop and remove containers
```

## Documentation

- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Local setup, workflow, testing
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment steps
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Tech decisions and patterns
- **[API.md](docs/API.md)** - API endpoint documentation
- **[openapi.yaml](packages/server/openapi.yaml)** - OpenAPI 3.1 specification

## Performance

- **Frontend Bundle**: < 100KB gzipped (target met)
- **API Response**: < 1 second typical, < 10 seconds maximum
- **Dictionary Load**: < 5 seconds at startup

See [PERFORMANCE_BASELINE.md](PERFORMANCE_BASELINE.md) for detailed metrics.

## Accessibility

- ✅ WCAG AA compliant
- ✅ All interactive elements keyboard accessible
- ✅ Screen reader friendly
- ✅ Color contrast 7:1 (WCAG AAA standard)
- ✅ Touch targets minimum 44×44px

## Support & Issues

- Found a bug?
  [Open an issue](https://github.com/yourname/word-unscrambler/issues)
- Have a question? Check [DEVELOPMENT.md](DEVELOPMENT.md) or
  [DEPLOYMENT.md](DEPLOYMENT.md)

## License

MIT

---

**Get started in 5 minutes:** [Quick Start](#quick-start) above, then check
[DEVELOPMENT.md](DEVELOPMENT.md) for the full workflow.
