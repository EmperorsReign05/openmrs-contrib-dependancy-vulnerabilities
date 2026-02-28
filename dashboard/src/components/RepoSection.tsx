import React, { useState } from "react";
import { RepositoryData } from "../types/vulnerability";
import { SeverityPill } from "./SeverityPill";
import { DependencyRow } from "./DependencyRow";

interface Props {
    repository: RepositoryData;
}

export const RepoSection: React.FC<Props> = ({ repository }) => {
    const [isOpen, setIsOpen] = useState(false); // Closed by default as in most dashboards

    return (
        <div style={{
            marginBottom: "1.5rem",
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "0.25rem",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
        }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: "1.5rem 2rem",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600, color: "#374151" }}>{repository.name}</h2>
                    <SeverityPill severity={repository.derivedSeverity} />
                </div>

                <div style={{ color: "#9ca3af", display: "flex", alignItems: "center" }}>
                    <svg
                        style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                        width="20" height="20" viewBox="0 0 20 20" fill="currentColor"
                    >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>

            {isOpen && (
                <div style={{ borderTop: "1px solid #e5e7eb" }}>
                    <div style={{
                        backgroundColor: "#e5e7eb",
                        padding: "0.75rem 2rem",
                        display: "grid",
                        gridTemplateColumns: "3fr 2fr 2fr 1fr 1fr 2fr",
                        gap: "1rem",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "#374151"
                    }}>
                        <div>Dependency</div>
                        <div>Version</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            Severity <span style={{ fontSize: "0.75rem" }}>↑</span>
                        </div>
                        <div>CVEs</div>
                        <div>Exploit?</div>
                        <div>Fix Version</div>
                    </div>

                    <div style={{ backgroundColor: "white" }}>
                        {repository.dependencies.length === 0 ? (
                            <div style={{ padding: "1.5rem 2rem", color: "#6b7280" }}>No vulnerable dependencies found.</div>
                        ) : (
                            repository.dependencies.map((dep, idx) => (
                                <DependencyRow
                                    key={`${dep.name}-${dep.version}`}
                                    dependency={dep}
                                    isLast={idx === repository.dependencies.length - 1}
                                />
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
