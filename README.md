# OpenMRS Dependency Vulnerability Dashboard

A dynamic dashboard that visualizes dependency vulnerabilities across OpenMRS modules, supporting enriched OWASP Dependency Check reports and advanced data processing.

<div align="center">
  <img src="dashboard/public/pic 1.png" alt="Dashboard Preview" width="60%" />
</div>

---

## Setup

The frontend application is located in the `dashboard` directory.

```bash
cd dashboard
npm install
npm run dev
```

Build for production:
```bash
npm run build
```

## Implemented Features
- **Dynamic Fetching**: Node script (`fetch-data.mjs`) connects to GitHub API, downloads the latest artifacts, and extracts the enriched `dependency-check-report.json` payloads.
- **Hierarchical Parsing**: Maps complex OWASP JSON into a clean, tiered relation: Repository → Dependency → CVEs.
- **Strict Sorting**: 
  - Supports synchronized multi-column sorting natively across Dependencies and CVEs using CVSS Score, Severity, Semantic Versioning, or Alphabetics.
- **Semantic Versioning**: Extracts combinations to determine the absolute highest `fixedIn` patch version required.
- **Exploit Detection**: Parses report links to actively flag if public documentation/CWE explicitly contains exploits.

## Stack
- **React 19** (Vite + TypeScript)
- **Styling**: Vanilla SCSS adopting Carbon Design Principles (BEM architecture)
- **Data Sync**: Node.js script utilizing `adm-zip` to extract GitHub Actions workflow artifacts.

## Structure
```text
dashboard/
  src/
    data/                 # Cache for vulnerability reports
    types/                
    utils/                
    components/           
    styles/              
  scripts/
    fetch-data.mjs        # External sync tool
```

## Syncing Latest Data
To pull live data rather than use local fallbacks:
1. Create a `.env` file in the `dashboard` directory mapping `GITHUB_TOKEN=your_token`.
2. Execute `npm run fetch-data`.

