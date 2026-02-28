import { Severity } from "../types/vulnerability";

export const getSeverityWeight = (severity?: Severity | string): number => {
    if (!severity) return 0;

    const formatted = severity.toString().toLowerCase();
    switch (formatted) {
        case "critical":
            return 4;
        case "high":
            return 3;
        case "medium":
            return 2;
        case "low":
            return 1;
        default:
            return 0;
    }
};

export const compareSeverity = (a?: Severity | string, b?: Severity | string): number => {
    return getSeverityWeight(a) - getSeverityWeight(b);
};

// Normalize a string to our explicit Severity type for UI components
export const normalizeSeverity = (severity?: string): Severity => {
    const weight = getSeverityWeight(severity);
    switch (weight) {
        case 4: return "Critical";
        case 3: return "High";
        case 2: return "Medium";
        case 1: return "Low";
        default: return "Unknown";
    }
};
