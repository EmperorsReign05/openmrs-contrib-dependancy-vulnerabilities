// Parses a semantic version string into an array of integers.
// E.g. "9.4.5" -> [9, 4, 5]
// E.g. "1.2.3-beta" -> [1, 2, 3] (ignores prerelease tags for simple comparison)
const parseVersion = (v?: string): number[] => {
    if (!v) return [];
    // Strip prerelease and build metadata (everything after - or +)
    const clean = v.split(/[-+]/)[0];
    return clean.split('.').map(part => {
        const num = parseInt(part, 10);
        return isNaN(num) ? 0 : num;
    });
};

/**
 * Compare two semver strings natively.
 * Returns >0 if a > b
 * Returns <0 if a < b
 * Returns 0 if a == b
 * 
 * Rules: missing undefined or malformed are considered lowest.
 */
export const compareVersions = (v1?: string, v2?: string): number => {
    if (!v1 && !v2) return 0;
    if (!v1) return -1;
    if (!v2) return 1;

    const parts1 = parseVersion(v1);
    const parts2 = parseVersion(v2);

    const length = Math.max(parts1.length, parts2.length);

    for (let i = 0; i < length; i++) {
        const num1 = parts1[i] || 0;
        const num2 = parts2[i] || 0;

        if (num1 > num2) {
            return 1;
        }
        if (num1 < num2) {
            return -1;
        }
    }

    return 0;
};
