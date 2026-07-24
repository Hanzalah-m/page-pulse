# Page Pulse

Page Pulse is a full-stack website auditing tool built with React, Vite, Tailwind, Express, Cheerio, and Axios.

## Setup

### 1. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Run the backend

```bash
cd server
cp .env.example .env
npm run dev
```

### 3. Run the frontend

```bash
cd client
cp .env.example .env
npm run dev
```

## API contract

### POST /api/audit

Request:

```json
{ "url": "https://example.com" }
```

Success response:

```json
{
  "url": "https://example.com",
  "status": 200,
  "responseTime": 342,
  "title": "Example Domain",
  "metaDescription": "...",
  "h1Count": 1,
  "imagesMissingAlt": 3,
  "wordCount": 527
}
```

Error response:

```json
{ "error": "ERROR_CODE", "message": "human readable" }
```

Error codes:

- INVALID_URL: malformed URL or unsupported protocol
- REQUEST_TIMEOUT: fetch exceeded the 8 second timeout
- UNSUPPORTED_CONTENT_TYPE: response was not HTML
- DNS_ERROR: host resolution failed
- UNREACHABLE: connection refused or remote target unavailable

## Design decisions

1. Fetching happens server-side because the backend can safely access remote pages, enforce SSRF protections, and keep secrets off the client.
2. The fetch layer includes a timeout because slow or hanging requests would otherwise make the app unresponsive and degrade user experience.
3. Parsing is isolated from networking so the HTML analysis can be unit tested with fixture HTML without any HTTP mocking.

## Testing

```bash
cd server && npm test
```
