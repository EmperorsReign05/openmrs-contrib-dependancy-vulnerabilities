import { RepositoryData, Severity } from "../types/vulnerability";
import { compareSeverity, normalizeSeverity } from "./severity";

export const getHighestRepoCveScore = (repo: RepositoryData): number => {
    if (!repo.dependencies || repo.dependencies.length === 0) return 0;

    return repo.dependencies.reduce((highest, currentDep) => {
        // Rely on the fact that derivedHighestScore has been populated
        const score = currentDep.derivedHighestScore ?? 0;
        return score > highest ? score : highest;
    }, 0);
};

export const getRepoSeverity = (repo: RepositoryData): Severity => {
    if (!repo.dependencies || repo.dependencies.length === 0) return "Unknown";

    let highestScore = -1;
    let highestSeverity: string | undefined;

    for (const dep of repo.dependencies) {
        const score = dep.derivedHighestScore ?? 0;
        if (score > highestScore) {
            highestScore = score;
            highestSeverity = dep.derivedSeverity;
        } else if (score === highestScore && highestScore === 0) {
            if (compareSeverity(dep.derivedSeverity, highestSeverity) > 0) {
                highestSeverity = dep.derivedSeverity;
            }
        }
    }

    return normalizeSeverity(highestSeverity);
};

export const hydrateRepository = (repo: RepositoryData): RepositoryData => {
    return {
        ...repo,
        derivedHighestScore: getHighestRepoCveScore(repo),
        derivedSeverity: getRepoSeverity(repo)
    };
};
