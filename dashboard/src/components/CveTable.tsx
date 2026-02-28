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
        <div style={{ backgroundColor: "white", borderRadius: "0.375rem", border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", textAlign: "left" }}>
                <thead>
                    <tr style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb" }}>
                        <th style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#374151", borderBottom: "2px solid #e5e7eb" }}>CVE ID</th>
                        <th style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#374151", borderBottom: "2px solid #e5e7eb" }}>Severity</th>
                        <th style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#374151", borderBottom: "2px solid #e5e7eb" }}>Score</th>
                        <th style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#374151", borderBottom: "2px solid #e5e7eb" }}>Description</th>
                        <th style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#374151", borderBottom: "2px solid #e5e7eb" }}>Affected Versions</th>
                        <th style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#374151", borderBottom: "2px solid #e5e7eb" }}>Fixed In</th>
                        <th style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#374151", borderBottom: "2px solid #e5e7eb" }}>CWE</th>
                    </tr>
                </thead>
                <tbody>
                    {cves.map((cve, i) => (
                        <tr key={cve.id} style={{ borderBottom: i === cves.length - 1 ? "none" : "1px solid #e5e7eb" }}>
                            <td style={{ padding: "1rem", color: "#3b82f6", fontWeight: 500 }}>
                                <a href={`https://nvd.nist.gov/vuln/detail/${cve.id}`} target="_blank" rel="noreferrer" style={{ textDecoration: "underline", color: "inherit" }}>
                                    {cve.id || "-"}
                                </a>
                            </td>
                            <td style={{ padding: "1rem" }}><SeverityPill severity={cve.severity} /></td>
                            <td style={{ padding: "1rem", color: "#4b5563" }}>{cve.score !== undefined ? `${cve.score.toFixed(1)}/10` : "-"}</td>
                            <td style={{ padding: "1rem", color: "#6b7280", maxWidth: "300px", lineHeight: "1.4" }}>
                                {cve.description || "-"}
                            </td>
                            <td style={{ padding: "1rem", color: "#4b5563" }}>
                                {Array.isArray(cve.affectedVersions)
                                    ? cve.affectedVersions.join(", ")
                                    : (cve.affectedVersions || "-")}
                            </td>
                            <td style={{ padding: "1rem", color: "#4b5563" }}>{cve.fixedIn || "-"}</td>
                            <td style={{ padding: "1rem", color: "#4b5563" }}>{cve.cwe || "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
