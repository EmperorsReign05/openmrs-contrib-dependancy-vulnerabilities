import React from "react";
import { Severity } from "../types/vulnerability";
import { normalizeSeverity } from "../utils/severity";

interface Props {
    severity?: Severity | string;
}

export const SeverityPill: React.FC<Props> = ({ severity }) => {
    const normalized = normalizeSeverity(severity?.toString());

    let bgColor = "#f3f4f6";
    let textColor = "#374151";

    switch (normalized) {
        case "Critical":
            bgColor = "#f87171"; // soft red
            textColor = "white"; // white text
            break;
        case "High":
            bgColor = "#fce7f3"; // light pink
            textColor = "#db2777"; // darker pink text
            break;
        case "Medium":
            bgColor = "#fef08a"; // yellow
            textColor = "#b45309"; // amber text
            break;
        case "Low":
            bgColor = "#f3f4f6"; // gray
            textColor = "#4b5563"; // dark gray text
            break;
        case "Unknown":
        default:
            bgColor = "#f3f4f6";
            textColor = "#9ca3af";
            break;
    }

    return (
        <span
            style={{
                backgroundColor: bgColor,
                color: textColor,
                padding: "0.25rem 0.625rem",
                borderRadius: "9999px",
                fontSize: "0.75rem",
                fontWeight: 600,
                display: "inline-block",
                lineHeight: 1.25,
                wordBreak: "keep-all",
                whiteSpace: "nowrap"
            }}
        >
            {normalized}
        </span>
    );
};
