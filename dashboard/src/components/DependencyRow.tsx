import React, { useState } from "react";
import { DependencyData } from "../types/vulnerability";
import { SeverityPill } from "./SeverityPill";
import { CveTable } from "./CveTable";

interface Props {
    dependency: DependencyData;
    isLast?: boolean;
}

export const DependencyRow: React.FC<Props> = ({ dependency, isLast }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: "1rem 2rem",
                    cursor: "pointer",
                    display: "grid",
                    gridTemplateColumns: "3fr 2fr 2fr 1fr 1fr 2fr",
                    gap: "1rem",
                    alignItems: "center",
                    borderBottom: isLast && !isOpen ? "none" : "1px solid #e5e7eb",
                    backgroundColor: isOpen ? "#f9fafb" : "white"
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#4b5563" }}>
                    <svg
                        style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s", color: "#9ca3af", flexShrink: 0 }}
                        width="16" height="16" viewBox="0 0 20 20" fill="currentColor"
                    >
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span style={{ fontSize: "0.875rem" }}>{dependency.name}</span>
                </div>

                <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    {dependency.version}
                </div>

                <div>
                    <SeverityPill severity={dependency.derivedSeverity} />
                </div>

                <div style={{ fontSize: "0.875rem", color: "#4b5563" }}>
                    {dependency.cves.length}
                </div>

                <div style={{ fontSize: "0.875rem", color: "#4b5563" }}>
                    {dependency.derivedHasExploit ? "Yes" : "-"}
                </div>

                <div style={{ fontSize: "0.875rem", color: "#4b5563" }}>
                    {dependency.derivedFixVersion || "-"}
                </div>
            </div>

            {isOpen && (
                <div style={{ borderBottom: isLast ? "none" : "1px solid #e5e7eb", backgroundColor: "#f9fafb", padding: "1.5rem 2rem" }}>
                    <CveTable cves={dependency.cves} />
                </div>
            )}
        </>
    );
};
