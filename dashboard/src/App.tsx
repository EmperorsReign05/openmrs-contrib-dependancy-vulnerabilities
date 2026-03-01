import { useMemo } from 'react';
import './styles/carbon.scss';
import { RepoSection } from './components/RepoSection';
import { CveData, DependencyData, RepositoryData } from './types/vulnerability';
import { hydrateDependency } from './utils/dependencyUtils';
import { hydrateRepository } from './utils/repositoryUtils';
import { sortCves, sortDependencies, sortRepositories } from './utils/sorting';

// Import JSONs (will fallback to static values if dynamic script not run)
import openmrsCore from './data/openmrs-core.json';
import openmrsBilling from './data/openmrs-module-billing.json';
import openmrsIdgen from './data/openmrs-module-idgen.json';

// Helper to parse GitLab dependency scanning json into our models
const parseReport = (repoName: string, jsonFile: any): RepositoryData => {
  const fileVulnerabilities = jsonFile.vulnerabilities || [];

  // Group CVEs by dependency
  const depMap = new Map<string, DependencyData>();

  for (const v of fileVulnerabilities) {
    const depName = v.location?.dependency?.package?.name || "Unknown package";
    const depKey = `${depName}@${v.location?.dependency?.version || "Unknown version"}`;

    // Attempt to extract fields based on common structures
    let score: number | undefined = undefined;
    if (v.cvss_vectors && v.cvss_vectors.length > 0) {
      score = v.cvss_vectors[0].score;
    } else if (v.cvss_v3 && v.cvss_v3.score) {
      score = v.cvss_v3.score;
    } else if (v.score !== undefined) {
      score = v.score;
    }

    let cwe: string | undefined = undefined;
    if (v.identifiers && Array.isArray(v.identifiers)) {
      const cweIdentifier = v.identifiers.find((i: any) => i.type && i.type.toLowerCase() === 'cwe');
      if (cweIdentifier) cwe = cweIdentifier.name || cweIdentifier.value;
    }
    if (!cwe && v.cwe) cwe = v.cwe;

    let hasExploit = false;
    if (v.links && Array.isArray(v.links)) {
      hasExploit = v.links.some((l: any) => l.name && l.name.toUpperCase().includes('EXPLOIT'));
    }

    const cve: CveData = {
      id: v.id || v.name || "Unknown CVE",
      name: v.name || "Unknown",
      description: v.description,
      severity: v.severity,
      score,
      affectedVersions: v.location?.dependency?.version,
      fixedIn: v.solution ? v.solution.replace(/Upgrade to version|Upgrade to/gi, '').trim() : undefined,
      cwe,
      hasExploit,
    };

    if (!depMap.has(depKey)) {
      depMap.set(depKey, {
        name: depName,
        version: v.location?.dependency?.version || "Unknown version",
        cves: []
      });
    }

    depMap.get(depKey)!.cves.push(cve);
  }

  // Hydrate and sort dependencies
  const dependencies: DependencyData[] = Array.from(depMap.values()).map(dep => {
    // Sort CVEs inside dependency
    const sortedCves = sortCves(dep.cves);
    return hydrateDependency({ ...dep, cves: sortedCves });
  });

  const sortedDependencies = sortDependencies(dependencies);

  // Return hydrated tracking repository
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
