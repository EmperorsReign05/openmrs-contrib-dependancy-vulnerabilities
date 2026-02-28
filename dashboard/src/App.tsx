import { useMemo } from 'react';
import './App.css';
import { RepoSection } from './components/RepoSection';
import { CveData, DependencyData, RepositoryData } from './types/vulnerability';
import { hydrateDependency } from './utils/dependencyUtils';
import { hydrateRepository } from './utils/repositoryUtils';
import { sortCves, sortDependencies, sortRepositories } from './utils/sorting';

// Import JSONs
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
    // Score might be in cvss_vectors or cvss_v3
    let score: number | undefined = undefined;
    if (v.cvss_vectors && v.cvss_vectors.length > 0) {
      score = v.cvss_vectors[0].score;
    } else if (v.cvss_v3 && v.cvss_v3.score) {
      score = v.cvss_v3.score;
    } else if (v.score !== undefined) {
      score = v.score;
    }

    // CWE might be under identifiers
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
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '3rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 500, color: '#111827', margin: '0 0 0.5rem 0' }}>
            OpenMRS Dependency Vulnerability Report
          </h1>
          <div style={{ height: '4px', width: '64px', backgroundColor: '#0f766e', marginBottom: '1.5rem' }}></div>
          <p style={{ color: '#4b5563', fontSize: '1rem', lineHeight: '1.6', maxWidth: '1000px', margin: 0 }}>
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
    </div>
  );
}

export default App;
