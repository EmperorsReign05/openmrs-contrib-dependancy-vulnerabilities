import { CveData, DependencyData, RepositoryData } from "../types/vulnerability";
import { compareSeverity } from "./severity";

// Sort CVEs by score descending. If score missing, it defaults to 0.
export const sortCves = (cves: CveData[]): CveData[] => {
    return [...cves].sort((a, b) => {
        const scoreA = a.score ?? 0;
        const scoreB = b.score ?? 0;
        // Descending
        return scoreB - scoreA;
    });
};

/*
  Sort dependencies by:
  1. Severity (highest first)
  2. Highest CVE score (descending)
  3. Dependency name (A–Z)
*/
export const sortDependencies = (deps: DependencyData[]): DependencyData[] => {
    return [...deps].sort((a, b) => {
        // 1. Severity
        const severityDiff = compareSeverity(b.derivedSeverity, a.derivedSeverity);
        if (severityDiff !== 0) return severityDiff;

        // 2. Highest score
        const scoreA = a.derivedHighestScore ?? 0;
        const scoreB = b.derivedHighestScore ?? 0;
        if (scoreB !== scoreA) {
            return scoreB - scoreA;
        }

        // 3. Name (A-Z)
        return a.name.localeCompare(b.name);
    });
};

/*
  Sort repositories by:
  1. Repo severity (highest first)
  2. Highest CVE score (descending)
  3. Repository name (A–Z)
*/
export const sortRepositories = (repos: RepositoryData[]): RepositoryData[] => {
    return [...repos].sort((a, b) => {
        // 1. Severity
        const severityDiff = compareSeverity(b.derivedSeverity, a.derivedSeverity);
        if (severityDiff !== 0) return severityDiff;

        // 2. Highest score
        const scoreA = a.derivedHighestScore ?? 0;
        const scoreB = b.derivedHighestScore ?? 0;
        if (scoreB !== scoreA) {
            return scoreB - scoreA;
        }

        // 3. Name (A-Z)
        return a.name.localeCompare(b.name);
    });
};
