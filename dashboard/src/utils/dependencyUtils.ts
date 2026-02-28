import { CveData, DependencyData, Severity } from "../types/vulnerability";
import { compareSeverity, normalizeSeverity } from "./severity";
import { compareVersions } from "./versionCompare";

export const getHighestCveScore = (cves: CveData[]): number => {
    if (!cves || cves.length === 0) return 0;

    return cves.reduce((highest, current) => {
        const currentScore = current.score ?? 0;
        return currentScore > highest ? currentScore : highest;
    }, 0);
};

export const getDependencySeverity = (cves: CveData[]): Severity => {
    if (!cves || cves.length === 0) return "Unknown";

    let highestScore = -1;
    let highestSeverity: string | undefined;

    for (const cve of cves) {
        const score = cve.score ?? 0;
        // We prioritize max score as per the instruction: "Find CVE with max score. That CVE determines dependency severity."
        if (score > highestScore) {
            highestScore = score;
            highestSeverity = cve.severity;
        } else if (score === highestScore && highestScore === 0) {
            // Fallback: If there are no scores, pick the highest severity directly
            if (compareSeverity(cve.severity, highestSeverity) > 0) {
                highestSeverity = cve.severity;
            }
        }
    }

    return normalizeSeverity(highestSeverity);
};

export const getDependencyFixVersion = (cves: CveData[]): string | undefined => {
    if (!cves || cves.length === 0) return undefined;

    let highestVersion: string | undefined = undefined;

    for (const cve of cves) {
        if (cve.fixedIn) {
            if (!highestVersion || compareVersions(cve.fixedIn, highestVersion) > 0) {
                highestVersion = cve.fixedIn;
            }
        }
    }

    return highestVersion;
};

// Utility to hydrate a dependency with its correct derived values
export const hydrateDependency = (dep: DependencyData): DependencyData => {
    return {
        ...dep,
        derivedSeverity: getDependencySeverity(dep.cves),
        derivedHighestScore: getHighestCveScore(dep.cves),
        derivedFixVersion: getDependencyFixVersion(dep.cves),
        derivedHasExploit: dep.cves.some(c => !!c.hasExploit)
    };
};
