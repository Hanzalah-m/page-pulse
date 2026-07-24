# Page Pulse

A lightweight website auditing tool. Enter a URL, and the backend fetches the page, parses the HTML, and returns a report covering HTTP status, response time, page title, meta description, H1 count, images missing alt text, and approximate word count.

Built for the Digital Heroes internship qualification task.

**Live frontend:** [https://page-pulse-neon-pi.vercel.app](https://page-pulse-neon-pi.vercel.app)
**Live backend:** [https://page-pulse-98rl.onrender.com](https://page-pulse-98rl.onrender.com)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Deployment](#deployment)
- [API Contract](#api-contract)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Design Decisions](#design-decisions)
- [Known Limitations / Future Work](#known-limitations--future-work)

---

## Overview

Page Pulse is a small full-stack application split into two parts:

- **Backend** — an Express API that accepts a URL, fetches it server-side, parses the resulting HTML with Cheerio, and returns a structured JSON report.
- **Frontend** — a single-page React interface where a user submits a URL and views the report.

The project intentionally has no database. Every request is stateless: a URL comes in, a report goes out. Nothing needs to persist between requests.

---

## Tech Stack

| Layer      | Choice                              |
|------------|--------------------------------------|
| Frontend   | React (Vite), Tailwind CSS, Axios     |
| Backend    | Node.js, Express, Cheerio             |
| Testing    | Vitest, Supertest                     |
| Linting    | ESLint, Prettier                      |
| Deployment | Vercel (frontend), Render (backend)   |

---

## Project Structure

```
page-pulse/
├── client/                  React frontend
│   └── src/
│       ├── api/             Axios client for the backend
│       ├── components/      UI components (form, report, error banner, footer)
│       └── hooks/           useAudit hook wrapping the API call and state
│
└── server/                  Express backend
    └── src/
        ├── routes/          Route definitions
        ├── controllers/     Request/response handling
        ├── services/        fetchPage (network) and parseHtml (parsing)
        ├── utils/           URL validation, SSRF guard, error classes
        ├── middleware/       Centralized error handler
        └── tests/           Unit and integration tests
```

---

## Setup

### Prerequisites

- Node.js 18 or later
- npm

### Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

The server starts on `http://localhost:5000` by default (configurable via `.env`).

### Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

The frontend starts on `http://localhost:5173` and expects `VITE_API_URL` in `.env` to point at the backend, for example:

```
VITE_API_URL=http://localhost:5000
```

### Running tests

```bash
cd server
npm run test
```

---

## Deployment

### Backend — Render

1. Push the repository to GitHub.
2. On Render, create a new **Web Service** and connect the repo.
3. Set the root directory to `server`.
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables from `server/.env.example` (e.g. `PORT`, `REQUEST_TIMEOUT_MS`, `ALLOWED_ORIGIN`) under the Render dashboard's Environment tab.
7. Render assigns a public URL — for this project, `https://page-pulse-98rl.onrender.com` — which becomes the backend's live URL.

Note: on Render's free tier, the service spins down after inactivity, so the first request after idle time may take 20–30 seconds while it cold-starts. This is expected and does not indicate an error in the audit flow itself.

### Frontend — Vercel

1. On Vercel, import the same GitHub repository.
2. Set the root directory to `client`.
3. Framework preset: Vite.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add the environment variable `VITE_API_URL` pointing to the deployed Render backend URL, e.g.:
   ```
   VITE_API_URL=https://page-pulse-98rl.onrender.com
   ```
7. Deploy. Vercel assigns a public URL — for this project, `https://page-pulse-neon-pi.vercel.app`.

### CORS

Because the frontend and backend are deployed on different domains, the backend must explicitly allow the Vercel origin. This is configured in `server/src/app.js` via the `cors` middleware, reading the allowed origin from the `ALLOWED_ORIGIN` environment variable rather than hardcoding it, so local development and production can use different values.

---

## API Contract

### `POST /api/audit`

**Request body**

```json
{
  "url": "https://example.com"
}
```

**Success response — `200 OK`**

```json
{
  "url": "https://example.com",
  "status": 200,
  "responseTime": 342,
  "title": "Example Domain",
  "metaDescription": "This domain is for use in illustrative examples.",
  "h1Count": 1,
  "imagesMissingAlt": 3,
  "wordCount": 527
}
```

If the target page has no title or no meta description, those fields are returned as `null` rather than causing a failure.

**Error response shape**

All errors follow the same structure, differing only in HTTP status code and `error` value:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable explanation."
}
```

| Error code                 | HTTP status | Meaning                                                          |
|-----------------------------|-------------|-------------------------------------------------------------------|
| `INVALID_URL`               | 400         | The submitted string is not a valid HTTP/HTTPS URL                 |
| `BLOCKED_TARGET`            | 400         | The URL resolves to a private, loopback, or link-local address    |
| `REQUEST_TIMEOUT`           | 504         | The target site did not respond within 8 seconds                  |
| `UNSUPPORTED_CONTENT_TYPE`  | 415         | The response was not HTML (e.g. PDF, image, JSON)                 |
| `UNREACHABLE`               | 502         | DNS resolution failed or the connection was refused                |
| `INTERNAL_ERROR`            | 500         | An unexpected failure occurred while processing the request        |

---

## Error Handling

The application is built on the assumption that user input cannot be trusted and that external websites are unreliable. Specifically, it handles:

- Malformed or non-HTTP(S) URLs, rejected before any network call is made
- Requests to localhost, loopback, and private/internal IP ranges, rejected as a basic SSRF protection
- Slow or unresponsive target sites, aborted after a fixed timeout
- Non-HTML responses, detected via the `Content-Type` header before parsing is attempted
- DNS failures and connection refusals
- Pages missing a title or meta description, handled gracefully rather than treated as errors

No input is expected to crash the server. Every failure path returns a structured JSON error rather than an unhandled exception or a raw stack trace.

---

## Testing

Tests live in `server/src/tests/` and cover both the parsing logic and the API layer:

1. **Happy path (`parseHtml.test.js`)** — a fixture HTML document is passed directly into the parser, and the test asserts the correct title, H1 count, missing-alt count, and word count are extracted.
2. **Invalid URL (`validateUrl.test.js`)** — malformed and non-HTTP(S) URLs are rejected before any network request occurs.
3. **Timeout / non-HTML response (`audit.integration.test.js`)** — the `/api/audit` endpoint is tested end-to-end with Supertest against a mocked slow or non-HTML response, confirming the API returns a structured error instead of throwing.

Run the suite with:

```bash
npm run test
```

---

## Design Decisions

**1. Fetching happens on the backend, not the browser.**
Auditing an arbitrary third-party website from the browser would run into CORS restrictions and would also expose the user's own IP address to the target site. Doing the fetch server-side keeps the browser sandboxed to talking only to the Page Pulse API, and gives one place to enforce timeouts and SSRF checks.

**2. Parsing is isolated from networking.**
`fetchPage.js` is responsible only for making the request, checking the status code and content type, and handling timeouts. `parseHtml.js` takes a raw HTML string and returns the report fields, with no knowledge of HTTP at all. This means the parsing logic — the part most likely to have edge cases — can be unit tested against fixture HTML without needing a real network call or a mock server.

**3. A single error-handling middleware, rather than scattered try/catch blocks.**
Custom error classes are thrown from the validation and fetch layers, and a single Express error-handling middleware converts them into a consistent JSON shape. This avoids duplicating error-formatting logic across the route and controller, and guarantees that every failure — expected or not — results in a predictable response rather than a crash.

---

## Known Limitations / Future Work

- SSRF protection currently checks the resolved IP against known private ranges but does not fully protect against DNS rebinding attacks, where a domain resolves to a public IP at check time and a private one at fetch time. A production version would re-validate the IP at the point of connection.
- Word count is approximate and based on whitespace-splitting the visible text content; it does not account for scripts, styles, or hidden elements beyond basic exclusion.
- The tool does not follow more than one redirect chain depth for content-type detection; deeply nested redirects to non-HTML content may not be caught.
- The Render free-tier backend cold-starts after inactivity, so the first audit request after idle time may take longer than subsequent ones. A production deployment would use a paid tier or a keep-alive ping to avoid this.