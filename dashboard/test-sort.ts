import { CveData, DependencyData, RepositoryData } from "./src/types/vulnerability";
import { compareSeverity } from "./src/utils/severity";

export const getHighestCveScore = (cves: CveData[]): number => {
    if (!cves || cves.length === 0) return 0;

    return cves.reduce((highest, current) => {
        const currentScore = current.score ?? 0;
        return currentScore > highest ? currentScore : highest;
    }, 0);
};

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

const d1: DependencyData = { name: "B", version: "1", cves: [], derivedSeverity: "High", derivedHighestScore: 7.5 };
const d2: DependencyData = { name: "A", version: "1", cves: [], derivedSeverity: "High", derivedHighestScore: 7.5 };
const d3: DependencyData = { name: "C", version: "1", cves: [], derivedSeverity: "High", derivedHighestScore: 8.0 };

const res = sortDependencies([d1, d2, d3]);
console.log(res.map(d => d.name));
