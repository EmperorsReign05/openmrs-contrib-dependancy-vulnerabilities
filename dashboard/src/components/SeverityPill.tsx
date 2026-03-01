import React from "react";
import { Severity } from "../types/vulnerability";
import { normalizeSeverity } from "../utils/severity";

interface Props {
    severity?: Severity | string;
}

export const SeverityPill: React.FC<Props> = ({ severity }) => {
    const normalized = normalizeSeverity(severity?.toString());

    let severityClass = "unknown";

    switch (normalized) {
        case "Critical":
            severityClass = "crit";
            break;
        case "High":
            severityClass = "high";
            break;
        case "Medium":
            severityClass = "medium";
            break;
        case "Low":
            severityClass = "low";
            break;
        case "Unknown":
        default:
            severityClass = "unknown";
            break;
    }

    return (
        <span className={`cds--severity-pill ${severityClass}`}>
            {normalized}
        </span>
    );
};
