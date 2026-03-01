import React, { useState, useMemo } from "react";
import { RepositoryData } from "../types/vulnerability";
import { SeverityPill } from "./SeverityPill";
import { DependencyRow } from "./DependencyRow";
import { compareSeverity } from "../utils/severity";
import { compareVersions } from "../utils/versionCompare";

type SortKey = 'name' | 'severity' | 'cves' | 'fixVersion';

interface Props {
    repository: RepositoryData;
}

export const RepoSection: React.FC<Props> = ({ repository }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [sortKey, setSortKey] = useState<SortKey>('severity');
    const [sortDesc, setSortDesc] = useState(true);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDesc(!sortDesc);
        } else {
            setSortKey(key);
            setSortDesc(key !== 'name'); // name defaults ascending, others descending
        }
    };

    const sortedDependencies = useMemo(() => {
        return [...repository.dependencies].sort((a, b) => {
            let res = 0;
            if (sortKey === 'severity') {
                const sevDiff = compareSeverity(a.derivedSeverity, b.derivedSeverity);
                if (sevDiff !== 0) res = sevDiff;
                else res = (a.derivedHighestScore || 0) - (b.derivedHighestScore || 0);
            } else if (sortKey === 'name') {
                res = a.name.localeCompare(b.name);
            } else if (sortKey === 'cves') {
                res = a.cves.length - b.cves.length;
            } else if (sortKey === 'fixVersion') {
                res = compareVersions(a.derivedFixVersion, b.derivedFixVersion);
            }

            return sortDesc ? -res : res;
        });
    }, [repository.dependencies, sortKey, sortDesc]);

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
                        <div
                            className="cds--sortable-col"
                            onClick={() => handleSort('name')}
                        >
                            Dependency
                            {sortKey === 'name' && (
                                <span className="cds--sort-icon" style={{ marginLeft: "4px" }}>
                                    {sortDesc ? "↓" : "↑"}
                                </span>
                            )}
                        </div>
                        <div>Version</div>
                        <div
                            className="cds--sortable-col"
                            onClick={() => handleSort('severity')}
                        >
                            Severity
                            {sortKey === 'severity' && (
                                <span className="cds--sort-icon" style={{ marginLeft: "4px" }}>
                                    {sortDesc ? "↓" : "↑"}
                                </span>
                            )}
                        </div>
                        <div
                            className="cds--sortable-col"
                            onClick={() => handleSort('cves')}
                        >
                            CVEs
                            {sortKey === 'cves' && (
                                <span className="cds--sort-icon" style={{ marginLeft: "4px" }}>
                                    {sortDesc ? "↓" : "↑"}
                                </span>
                            )}
                        </div>
                        <div>Exploit?</div>
                        <div
                            className="cds--sortable-col"
                            onClick={() => handleSort('fixVersion')}
                        >
                            Fix Version
                            {sortKey === 'fixVersion' && (
                                <span className="cds--sort-icon" style={{ marginLeft: "4px" }}>
                                    {sortDesc ? "↓" : "↑"}
                                </span>
                            )}
                        </div>
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
