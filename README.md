# ASDM Official Website

## Overview
ASDM (AI Powered System Development Methodology) is a comprehensive framework that helps teams intentionally leverage AI across the entire software development lifecycle — from planning and design to implementation, testing, delivery, and ongoing improvement.

- ASDM values
  - Efficiency: streamline workflows and reduce repetitive effort with intelligent automation
  - Quality: improve reliability through AI-assisted testing, reviews, and analysis
  - Innovation: enable faster exploration and iteration with AI as a creative partner
  - Scalability: design systems and processes that adapt as AI capabilities evolve
  - Human–AI collaboration: keep humans in control while using AI for high-leverage support
  - Outcome-driven: measure what matters and continuously optimize for results
  - Continuous learning: build feedback loops so people, processes, and models improve over time
  - Ethical AI: ensure transparency, fairness, privacy, and accountability in AI use

- Website values
  - Accessibility and clarity: concepts explained plainly with practical examples
  - Transparency: documentation is versioned and easy to trace
  - Practicality: hands-on guides, core principles, and best practices you can adopt today
  - Community-friendly: structured to grow as contributions and ideas mature
  - Stability: URLs and content organization designed to remain predictable over time

## Project Architecture
This website is a single-page application built with Vite + React + TypeScript and Tailwind CSS. It provides a Home page and a Documents page that renders Markdown content at runtime. Markdown is parsed with react-markdown (GitHub-flavored Markdown via remark-gfm) and code blocks are highlighted with Prism.

- src/
  - pages/
    - Home.tsx – Landing page UI
    - Documents.tsx – Loads and renders docs, manages sidebar and current selection
  - components/
    - Header.tsx, Footer.tsx – Layout components
    - MarkdownRenderer.tsx – react-markdown + remark-gfm + Prism integration and styling
- public/
  - docs/content/ – Markdown files served as static assets (available at /docs/content/*.md)
- Config & build
  - vite.config.ts, tsconfig*.json, tailwind.config.js, postcss.config.js, index.html

## Development
- Prerequisites: Node.js 18+ (recommended)
- Install dependencies: npm install
- Start dev server: npm run dev (opens http://localhost:5173/)
- Build for production: npm run build (outputs dist/)
- Preview build locally: npm run preview

## Docker and Docker Compose

Build and run the production stack, then open http://localhost:8080 (via Nginx) or http://localhost:6174 (direct to app):

```bash
docker compose up -d --build
```

Check status and logs:

```bash
docker compose ps
docker compose logs -f
```

Stop and remove the container:

```bash
docker compose down
```

Rebuild after code changes:

```bash
docker compose up -d --build
# or
docker compose build --no-cache asdm-web && docker compose up -d
```

Open a shell in the running container:

```bash
docker compose exec asdm-web sh
```

Notes:
- The container serves the static production build from dist using serve on port 3000, mapped to host port 6174 (configured in docker-compose.yml).
- Nginx reverse proxy (service: asdm-nginx) exposes http://localhost:8080 and forwards to the internal asdm-web:3000.
- For local development with HMR, prefer running npm run dev directly; the Docker image is optimized for production serving.
- If you need Vite build-time env variables (e.g., BASE_URL), pass them at build time (build args or .env) because runtime envs won’t change already-built static assets.

- Location: public/docs/content/*.md
- Runtime URL: /docs/content/<filename>.md (because files in public/ are served from the site root)
- Loading: Documents.tsx fetches these files at runtime, parses optional front matter, strips it, then renders the remaining Markdown.
- Add a new document:
  1) Place your .md file in public/docs/content (e.g., public/docs/content/new-topic.md)
  2) Add its path to the docFiles list in src/pages/Documents.tsx (e.g., content/new-topic.md)
- Optional front matter (simple, line-based parser):

```md
---
title: Your Document Title
description: Short description (optional)
category: Category Name (optional)
tags: tag1, tag2, tag3 (optional)
---

# Your Heading
Content...
```

- Notes:
  - The front matter parser is intentionally simple (single-line values; tags are comma-separated)
  - Files in public/ are copied as-is and not fingerprinted; URLs remain stable. If deploying under a subpath, prefer building URLs using import.meta.env.BASE_URL (e.g., `${import.meta.env.BASE_URL}docs/content/<file>.md`).
  - Keeping docs in public/ keeps them out of the JS bundle and makes runtime fetching straightforward.