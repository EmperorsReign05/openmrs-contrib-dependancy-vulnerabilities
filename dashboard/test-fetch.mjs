import https from 'https';
import fs from 'fs';

const url = 'https://api.github.com/repos/openmrs/openmrs-module-billing/actions/artifacts';
const options = {
    headers: {
        'User-Agent': 'Node.js'
    }
};

https.get(url, options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const json = JSON.parse(data);
        const artifact = json.artifacts.find(a => a.name.toLowerCase().includes('dependency') && a.name.toLowerCase().includes('report'));
        if (artifact) {
            console.log(`Found artifact: ${artifact.name}, URL: ${artifact.archive_download_url}`);

            const dlOptions = {
                headers: { 'User-Agent': 'Node.js' }
            };
            https.get(artifact.archive_download_url, dlOptions, (dlRes) => {
                console.log(`Status: ${dlRes.statusCode}`);
                if (dlRes.statusCode === 302 && dlRes.headers.location) {
                    console.log(`Redirecting to: ${dlRes.headers.location}`);
                } else {
                    let dlData = '';
                    dlRes.on('data', chunk => dlData += chunk);
                    dlRes.on('end', () => console.log('Response body:', dlData.slice(0, 500)));
                }
            });
        } else {
            console.log('No dependency report found.');
        }
    });
}).on('error', err => console.error(err));
