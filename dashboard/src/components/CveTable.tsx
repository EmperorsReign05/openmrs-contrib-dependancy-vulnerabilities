import React, { useState, useMemo } from "react";
import { CveData } from "../types/vulnerability";
import { SeverityPill } from "./SeverityPill";
import { compareSeverity } from "../utils/severity";
import { compareVersions } from "../utils/versionCompare";

type SortKey = 'id' | 'severity' | 'score' | 'affectedVersions' | 'fixedIn' | 'cwe';

interface Props {
    cves: CveData[];
}

export const CveTable: React.FC<Props> = ({ cves }) => {
    const [sortKey, setSortKey] = useState<SortKey>('score');
    const [sortDesc, setSortDesc] = useState(true);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDesc(!sortDesc);
        } else {
            setSortKey(key);
            setSortDesc(key === 'score' || key === 'severity');
        }
    };

    const sortedCves = useMemo(() => {
        return [...cves].sort((a, b) => {
            let res = 0;
            switch (sortKey) {
                case 'id':
                    res = (a.id || '').localeCompare(b.id || '');
                    break;
                case 'severity': {
                    res = compareSeverity(a.severity, b.severity);
                    if (res === 0) res = (a.score || 0) - (b.score || 0);
                    break;
                }
                case 'score':
                    res = (a.score || 0) - (b.score || 0);
                    break;
                case 'affectedVersions': {
                    const avA = Array.isArray(a.affectedVersions) ? a.affectedVersions.join(", ") : (a.affectedVersions || "");
                    const avB = Array.isArray(b.affectedVersions) ? b.affectedVersions.join(", ") : (b.affectedVersions || "");
                    res = avA.localeCompare(avB);
                    break;
                }
                case 'fixedIn':
                    res = compareVersions(a.fixedIn, b.fixedIn);
                    break;
                case 'cwe':
                    res = (a.cwe || '').localeCompare(b.cwe || '');
                    break;
            }
            return sortDesc ? -res : res;
        });
    }, [cves, sortKey, sortDesc]);

    if (!cves || cves.length === 0) {
        return null;
    }

    return (
        <div className="cds--cve-table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th className={`cds--sortable-col ${sortKey === 'id' ? 'active' : ''}`} onClick={() => handleSort('id')}>
                            CVE ID
                            <span className="cds--sort-icon">{sortKey === 'id' ? (sortDesc ? "↓" : "↑") : "↕"}</span>
                        </th>
                        <th className={`cds--sortable-col ${sortKey === 'severity' ? 'active' : ''}`} onClick={() => handleSort('severity')}>
                            Severity
                            <span className="cds--sort-icon">{sortKey === 'severity' ? (sortDesc ? "↓" : "↑") : "↕"}</span>
                        </th>
                        <th className={`cds--sortable-col ${sortKey === 'score' ? 'active' : ''}`} onClick={() => handleSort('score')}>
                            Score
                            <span className="cds--sort-icon">{sortKey === 'score' ? (sortDesc ? "↓" : "↑") : "↕"}</span>
                        </th>
                        <th>Description</th>
                        <th className={`cds--sortable-col ${sortKey === 'affectedVersions' ? 'active' : ''}`} onClick={() => handleSort('affectedVersions')}>
                            Affected Versions
                            <span className="cds--sort-icon">{sortKey === 'affectedVersions' ? (sortDesc ? "↓" : "↑") : "↕"}</span>
                        </th>
                        <th className={`cds--sortable-col ${sortKey === 'fixedIn' ? 'active' : ''}`} onClick={() => handleSort('fixedIn')}>
                            Fixed In
                            <span className="cds--sort-icon">{sortKey === 'fixedIn' ? (sortDesc ? "↓" : "↑") : "↕"}</span>
                        </th>
                        <th className={`cds--sortable-col ${sortKey === 'cwe' ? 'active' : ''}`} onClick={() => handleSort('cwe')}>
                            CWE
                            <span className="cds--sort-icon">{sortKey === 'cwe' ? (sortDesc ? "↓" : "↑") : "↕"}</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedCves.map((cve) => (
                        <tr key={cve.id}>
                            <td className="cve-id">
                                <a href={`https://nvd.nist.gov/vuln/detail/${cve.id}`} target="_blank" rel="noreferrer">
                                    {cve.id || "-"}
                                </a>
                            </td>
                            <td><SeverityPill severity={cve.severity} /></td>
                            <td>{cve.score !== undefined ? `${cve.score.toFixed(1)}/10` : "-"}</td>
                            <td className="cve-desc">
                                {cve.description || "-"}
                            </td>
                            <td>
                                {Array.isArray(cve.affectedVersions)
                                    ? cve.affectedVersions.join(", ")
                                    : (cve.affectedVersions || "-")}
                            </td>
                            <td>{cve.fixedIn || "-"}</td>
                            <td>{cve.cwe || "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
