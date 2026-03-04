import { useMemo } from 'react';
import './styles/carbon.scss';
import { RepoSection } from './components/RepoSection';
import { CveData, DependencyData, RepositoryData } from './types/vulnerability';
import { hydrateDependency } from './utils/dependencyUtils';
import { hydrateRepository } from './utils/repositoryUtils';
import { sortCves, sortDependencies, sortRepositories } from './utils/sorting';

import openmrsCore from './data/openmrs-core.json';
import openmrsBilling from './data/openmrs-module-billing.json';
import openmrsIdgen from './data/openmrs-module-idgen.json';

interface OwaspDependency {
  fileName?: string;
  filePath?: string;
  packages?: Array<{ id?: string }>;
  vulnerabilities?: Array<{
    name?: string;
    severity?: string;
    cvssv3?: { baseScore?: number; baseSeverity?: string };
    cvssv2?: { score?: number; severity?: string };
    description?: string;
    cwes?: string[];
    references?: Array<{ name?: string; url?: string }>;
    vulnerableSoftware?: Array<{ software?: { id?: string; versionEndExcluding?: string; versionEndIncluding?: string } }>;
  }>;
}

interface OwaspReport {
  projectInfo?: { name?: string };
  dependencies?: OwaspDependency[];
}

const parseReport = (repoName: string, jsonFile: OwaspReport): RepositoryData => {
  const dependencies: DependencyData[] = [];

  for (const dep of jsonFile.dependencies || []) {
    if (!dep.vulnerabilities || dep.vulnerabilities.length === 0) continue;

    let depName = dep.fileName || "Unknown dependency";
    let version = "Unknown version";
    if (dep.packages && dep.packages.length > 0 && dep.packages[0].id) {
      const parts = dep.packages[0].id.split('@');
      if (parts.length > 1) {
        version = parts.pop() || "Unknown version";
        depName = parts.join('@').replace(/^pkg:[^/]+\//, '');
      }
    }

    const cves: CveData[] = dep.vulnerabilities.map(v => {
      let score = v.cvssv3?.baseScore ?? v.cvssv2?.score;
      let rawSeverity = v.severity ?? v.cvssv3?.baseSeverity ?? v.cvssv2?.severity ?? "Unknown";
      let severity = rawSeverity.charAt(0).toUpperCase() + rawSeverity.slice(1).toLowerCase();
      let cwe = v.cwes ? v.cwes.join(", ") : undefined;

      let hasExploit = false;
      if (v.references && Array.isArray(v.references)) {
        hasExploit = v.references.some(r => r.name && r.name.toUpperCase().includes('EXPLOIT'));
      }

      let fixedIn = undefined;
      let affectedVersions = "-";
      if (v.vulnerableSoftware && v.vulnerableSoftware.length > 0) {
        const sw = v.vulnerableSoftware[0].software;
        if (sw) {
          if (sw.versionEndExcluding) {
            fixedIn = sw.versionEndExcluding;
            affectedVersions = `< ${sw.versionEndExcluding}`;
          } else if (sw.versionEndIncluding) {
            affectedVersions = `<= ${sw.versionEndIncluding}`;
          } else {
            const parts = sw.id?.split(':') || [];
            if (parts.length >= 6 && parts[5] !== '*') {
              affectedVersions = parts[5].replace(/\\/g, '');
            }
          }
        }
      }

      return {
        id: v.name || "Unknown CVE",
        name: v.name || "Unknown",
        description: v.description,
        severity: severity,
        score,
        affectedVersions,
        fixedIn,
        cwe,
        hasExploit,
      };
    });

    const sortedCves = sortCves(cves);
    dependencies.push(hydrateDependency({
      name: depName,
      version,
      cves: sortedCves
    }));
  }

  const sortedDependencies = sortDependencies(dependencies);

  return hydrateRepository({
    name: repoName,
    dependencies: sortedDependencies
  });
};

function App() {
  const repositories = useMemo(() => {
    const repos = [
      parseReport("openmrs-core", openmrsCore),
      parseReport("openmrs-module-billing", openmrsBilling),
      parseReport("openmrs-module-idgen", openmrsIdgen),
    ];

    return sortRepositories(repos);
  }, []);

  return (
    <div className="cds--container">
      <header className="cds--header">
        <h1>OpenMRS Dependency Vulnerability Report</h1>
        <div className="cds--teal-line"></div>
        <p>
          A summary of known security vulnerabilities detected across OpenMRS modules by automated dependency scanning. Each module lists its vulnerable dependencies, severity levels, and recommended fix versions to help maintainers prioritize upgrades.
        </p>
      </header>

      <main>
        {repositories.length === 0 ? (
          <p>Loading or no data available.</p>
        ) : (
          repositories.map(repo => (
            <RepoSection key={repo.name} repository={repo} />
          ))
        )}
      </main>
    </div>
  );
}

export default App;
