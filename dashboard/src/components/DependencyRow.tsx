import React, { useState } from "react";
import { DependencyData } from "../types/vulnerability";
import { SeverityPill } from "./SeverityPill";
import { CveTable } from "./CveTable";

interface Props {
    dependency: DependencyData;
}

export const DependencyRow: React.FC<Props> = ({ dependency }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="cds--dependency-row-wrapper">
            <div
                className={`cds--dependency-row ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="cds--dep-name-col">
                    <svg
                        className={`cds--chevron ${isOpen ? 'open' : ''}`}
                        width="16" height="16" viewBox="0 0 20 20" fill="currentColor"
                    >
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{dependency.name}</span>
                </div>

                <div className="cds--row-text">
                    {dependency.version}
                </div>

                <div>
                    <SeverityPill severity={dependency.derivedSeverity} />
                </div>

                <div className="cds--row-text">
                    {dependency.cves.length}
                </div>

                <div className="cds--row-text">
                    {dependency.derivedHasExploit ? "Yes" : "-"}
                </div>

                <div className="cds--row-text">
                    {dependency.derivedFixVersion || "-"}
                </div>
            </div>

            {isOpen && (
                <CveTable cves={dependency.cves} />
            )}
        </div>
    );
};
