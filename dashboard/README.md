# OpenMRS Dependency Vulnerability Dashboard

A dynamic vulnerability dashboard built with React, TypeScript, and Vite. This application visualizes vulnerability data parsed from standard dependency scanning JSON reports.

## Features

- **Dynamic Data Parsing:**
  - Automatically parses multiple GitLab Dependency Scanning JSON reports (`openmrs-core`, `openmrs-module-billing`, `openmrs-module-idgen`).
  - Safely handles missing fields (score, cwe, fixedIn, description) using optional chaining, rendering a clean `-` placeholder.
  
- **Derived Logic & Hierarchical Data:**
  - Converts flat CVE lists into a 3-level hierarchy: Repository -> Dependency -> CVE.
  - Computes `Derived Severity` for dependencies based on the highest underlying CVE severity.
  - Extracts the maximum CVE score into a `Highest Score` field.
  - Implements rigorous semantic version comparison to determine the highest `Fix Version` necessary to address all CVEs within a dependency.
  - Automatically detects if an exploit exists by scanning the CVE links for any reference to "EXPLOIT" and surfaces this via an `Exploit?` flag.

- **Advanced Sorting:**
  - CVEs: Sorted by score (descending).
  - Dependencies: Sorted by Derived Severity (Critical > High > Medium > Low), then Highest Score (descending), then Alphabetically.
  - Repositories: Sorted identically (Repo Severity -> Highest Repo CVE Score -> Alphabetically).

- **Modern & Polished UI:**
  - Fully styled to match a clean layout with light-gray backgrounds (`#f9fafb`), centered white container cards, and subtle drop-shadows.
  - Refined typography with a bold header, descriptive subtitle, and decorative teal accent line.
  - Custom `SeverityPill` component with exact color calibration (soft-reds, pinks, yellows, grays) for maximum immediate visual clarity.
  - Precise grid layouts spanning `[Dependency, Version, Severity, CVEs, Exploit?, Fix Version]` across collapsible dependency rows.
  - Clean architecture with no logic inside presentational components. 

## Project Architecture

```text
src/
  types/
    vulnerability.ts       # Central interfaces (CveData, DependencyData, RepositoryData)
  utils/
    dependencyUtils.ts     # Derives highest severity, max score, fix versions, and exploits
    repositoryUtils.ts     # Aggregates dependencies into repository-level metrics
    severity.ts            # Severity ranking, weighting, and normalization
    sorting.ts             # Hierarchical sorting definitions
    versionCompare.ts      # Semantic version string comparison logic
  components/
    RepoSection.tsx        # High-level repository rendering and accordion
    DependencyRow.tsx      # Dependency-level grid row and accordion
    CveTable.tsx           # Inner data table for individual CVEs
    SeverityPill.tsx       # Reusable, color-coded severity visual indicator
  App.tsx                  # Main orchestration, data injection, and layout
```

## Running the Application

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation & Launch

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

The dashboard will open to your local environment, automatically parsing the bundled JSON files in `src/data`.
