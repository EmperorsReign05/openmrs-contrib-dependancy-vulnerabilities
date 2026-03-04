import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import AdmZip from 'adm-zip';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '../src/data');

const ORG = 'openmrs';
const REPOS = ['openmrs-core', 'openmrs-module-billing', 'openmrs-module-idgen'];

const TOKEN = process.env.GITHUB_TOKEN;

if (!TOKEN) {
    console.error("GITHUB_TOKEN is missing in the environment or .env file.");
    console.error("To fetch artifacts dynamically, you need a personal access token.");
    console.error("Fallback: Using existing static JSON files in src/data/ if any exist.");
    process.exit(0);
}

const headers = {
    'User-Agent': 'Node.js Vulnerability Dashboard',
    'Authorization': `token ${TOKEN}`,
    'Accept': 'application/vnd.github.v3+json'
};

function httpsRequest(urlStr, options = {}) {
    return new Promise((resolve, reject) => {
        const req = https.get(urlStr, options, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return httpsRequest(res.headers.location, options).then(resolve).catch(reject);
            }
            if (res.statusCode >= 400) {
                return reject(new Error(`HTTP ${res.statusCode} from ${urlStr}`));
            }

            if (options.responseType === 'buffer') {
                const chunks = [];
                res.on('data', chunk => chunks.push(chunk));
                res.on('end', () => resolve(Buffer.concat(chunks)));
            } else {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(JSON.parse(data)));
            }
        });
        req.on('error', reject);
    });
}

async function fetchLatestReport(repo) {
    try {
        console.log(`[${repo}] Locating latest successful workflow run on main branch...`);
        const runsUrl = `https://api.github.com/repos/${ORG}/${repo}/actions/runs?branch=main&status=success&per_page=10`;
        const runData = await httpsRequest(runsUrl, { headers });

        if (!runData.workflow_runs || runData.workflow_runs.length === 0) {
            console.log(`[${repo}] No successful runs found on the main branch.`);
            return;
        }

        let reportArtifact = null;
        let successfulRunId = null;

        for (const run of runData.workflow_runs) {
            const artifactsUrl = run.artifacts_url;
            const artifactsData = await httpsRequest(artifactsUrl, { headers });

            reportArtifact = artifactsData.artifacts?.find(a =>
                a.name.toLowerCase().includes('dependency') &&
                a.name.toLowerCase().includes('report')
            );

            if (reportArtifact) {
                successfulRunId = run.id;
                break;
            }
        }

        if (!reportArtifact) {
            console.log(`[${repo}] No 'dependency report' artifact found in recent main branch runs.`);
            return;
        }

        console.log(`[${repo}] Found report: ${reportArtifact.name} from run ${successfulRunId}. Downloading...`);

        const zipBuffer = await httpsRequest(reportArtifact.archive_download_url, {
            headers,
            responseType: 'buffer'
        });

        const zip = new AdmZip(zipBuffer);
        const zipEntries = zip.getEntries();

        let foundJson = false;
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }

        for (const entry of zipEntries) {
            if (entry.name === 'dependency-check-report.json') {
                const outPath = path.join(OUTPUT_DIR, `${repo}.json`);
                const content = zip.readAsText(entry);
                fs.writeFileSync(outPath, content);
                console.log(`[${repo}] Successfully saved report array to: src/data/${repo}.json`);
                foundJson = true;
                break;
            }
        }

        if (!foundJson) {
            console.log(`[${repo}] The artifact zip did not contain any .json files.`);
        }

    } catch (error) {
        console.error(`[${repo}] Failed to fetch artifacts:`, error.message);
    }
}

async function main() {
    console.log("Starting dynamic fetch of GitHub Actions artifacts...");
    for (const repo of REPOS) {
        await fetchLatestReport(repo);
    }
    console.log("Done.");
}

main();
