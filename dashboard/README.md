

A dynamic vulnerability dashboard that visualizes required dependency updates based on GitLab Dependency Scanning.

## Stack
- **React** (Vite + TypeScript)
- **Styling**: `styles/carbon.scss` (Carbon Design principles, BEM class syntax)
- **Node.js**: Script to fetch artifact data from GitHub Actions.

## Implemented Features
- **Dynamic Fetching**: Node script (`npm run fetch-data`) connects to GitHub API, downloads the latest workflow artifact zip, and updates the local `.json` reports.
- **Hierarchical Parsing**: Maps flat JSON lists into a tiered relation: Repository → Dependency → CVEs.
- **Sorting Logic strictly enforced**:
  - **CVEs**: Sorted descending by CVSS Score.
  - **Dependencies**: Ranked by Severity (Critical > Low), then Highest CVE Score, then Alphabetical.
  - **Repos**: Ranked identically to Dependencies.
- **Semantic Version Checks**: Extracts and determines the absolute highest `fixedIn` version required to patch a dependency.
- **Exploit Flags**: Parses the `links` arrays within reports to actively flag if "EXPLOIT" documentation exists for a CVE.

## Project Structure
```text
src/
  data/                
  types/               
  utils/               
  components/          
  styles/              
  App.tsx              
scripts/
  fetch-data.mjs       
```

## Installation

```bash
npm install
```

### Sync Latest Data
To utilize the dynamic GitHub Actions fetcher:
1. Create a `.env` file containing `GITHUB_TOKEN=your_token`
2. Run `npm run fetch-data`

### Run Locally
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```
