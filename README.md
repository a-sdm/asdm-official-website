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
    - Documents.tsx – Loads documentation structure and manages navigation
  - components/
    - Header.tsx, Footer.tsx – Layout components
    - docsReader/ – Components for document rendering and navigation
      - DocContent.tsx – Renders the selected document content
      - DocSidebar.tsx – Displays the navigation sidebar
      - MenuTreeView.tsx – Renders hierarchical document structure
      - MarkdownRenderer.tsx – Handles Markdown parsing and styling
- public/
  - docs/
    - site-tree.yml – Configuration file defining document structure and metadata
    - content/ – Markdown files organized in directories (available at /docs/content/*.md)
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
- If you need Vite build-time env variables (e.g., BASE_URL), pass them at build time (build args or .env) because runtime envs won't change already-built static assets.

## Documentation System

### Document Structure
- Documents are organized in a hierarchical structure in the `public/docs/content/` directory
- The structure includes:
  - Top-level documents (e.g., `introduction.md`)
  - Section directories with index files (e.g., `core-principles/_index.md`)
  - Topic files within sections (e.g., `best-practices/code-quality.md`)

### Configuration
- `public/docs/site-tree.yml` defines:
  - Document metadata (title, description, tags, etc.)
  - Document paths relative to the content directory
  - Hierarchical menu structure for navigation
  - Document weights for controlling display order

### Adding New Documents
1. Create a Markdown file in the appropriate location in `public/docs/content/`
2. Add the document metadata to `site-tree.yml` under the `documents` section:
   ```yaml
   - title: "Your Document Title"
     path: section-name/your-document.md
     description: "Brief description of the document"
     category: "Category Name"
     tags: ["tag1", "tag2"]
     lastUpdated: "YYYY-MM-DD"
   ```
3. Update the menu structure in `site-tree.yml` under the `menu-tree` section:
   ```yaml
   - path: section-name/_index.md
     menu-title: "Section Name"
     children:
       - path: section-name/your-document.md
         menu-title: "Your Document"
   ```

### Section Organization
- For new sections, create a directory in `public/docs/content/`
- Add an `_index.md` file in the directory to serve as the section landing page
- Add individual topic files within the section directory

### Document Metadata
Documents can include the following metadata:
- `title`: Document title (required)
- `path`: Path to the file relative to content directory (required)
- `description`: Brief summary of the document
- `category`: Document category for grouping
- `tags`: Array of related topics
- `lastUpdated`: Last modification date
- `created`: Creation date
- `updated`: Update date
- `author`: Document author
- `weight`: Numeric value for controlling display order

### URL Structure
- Documents are accessible at `/docs/[path]` where path is the document path without the `.md` extension
- Section index pages are accessible at `/docs/[section-name]` (automatically maps to `[section-name]/_index.md`)