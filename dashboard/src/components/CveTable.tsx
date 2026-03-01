import React from "react";
import { CveData } from "../types/vulnerability";
import { SeverityPill } from "./SeverityPill";

interface Props {
    cves: CveData[];
}

export const CveTable: React.FC<Props> = ({ cves }) => {
    if (!cves || cves.length === 0) {
        return null;
    }

    return (
        <div className="cds--cve-table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>CVE ID</th>
                        <th>Severity</th>
                        <th>Score</th>
                        <th>Description</th>
                        <th>Affected Versions</th>
                        <th>Fixed In</th>
                        <th>CWE</th>
                    </tr>
                </thead>
                <tbody>
                    {cves.map((cve) => (
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
