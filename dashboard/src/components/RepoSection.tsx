import React, { useState, useMemo } from "react";
import { RepositoryData } from "../types/vulnerability";
import { SeverityPill } from "./SeverityPill";
import { DependencyRow } from "./DependencyRow";

interface Props {
    repository: RepositoryData;
}

export const RepoSection: React.FC<Props> = ({ repository }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [sortDesc, setSortDesc] = useState(true);

    const sortedDependencies = useMemo(() => {
        // Dependencies are already sorted descending by severity in App.tsx -> parseReport
        if (sortDesc) {
            return repository.dependencies;
        }
        // If sorting ascending, just reverse the pre-sorted list. 
        return [...repository.dependencies].reverse();
    }, [repository.dependencies, sortDesc]);

    return (
        <div className="cds--accordion-item">
            <div className="cds--accordion-header" onClick={() => setIsOpen(!isOpen)}>
                <div className="cds--repo-title-wrapper">
                    <h2>{repository.name}</h2>
                    <SeverityPill severity={repository.derivedSeverity} />
                </div>
                <svg
                    className={`cds--chevron ${isOpen ? 'open' : ''}`}
                    width="20" height="20" viewBox="0 0 20 20" fill="currentColor"
                >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>

            {isOpen && (
                <div className="cds--dependency-list">
                    <div className="cds--grid-header">
                        <div>Dependency</div>
                        <div>Version</div>
                        <div
                            className="cds--sortable-col"
                            onClick={() => setSortDesc(!sortDesc)}
                        >
                            Severity
                            <span className="cds--sort-icon">
                                {sortDesc ? "↑" : "↓"}
                            </span>
                        </div>
                        <div>CVEs</div>
                        <div>Exploit?</div>
                        <div>Fix Version</div>
                    </div>

                    <div className="cds--dependency-rows-container">
                        {sortedDependencies.length === 0 ? (
                            <div style={{ padding: "1.5rem 2rem", color: "#6b7280" }}>No vulnerable dependencies found.</div>
                        ) : (
                            sortedDependencies.map((dep) => (
                                <DependencyRow
                                    key={`${dep.name}-${dep.version}`}
                                    dependency={dep}
                                />
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
