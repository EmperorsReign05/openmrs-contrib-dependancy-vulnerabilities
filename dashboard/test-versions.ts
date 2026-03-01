import { compareVersions } from './src/utils/versionCompare.ts';

console.log('9.4.5 > 8.19.8:', compareVersions('9.4.5', '8.19.8'));
console.log('8.19.8 > 8.13.0:', compareVersions('8.19.8', '8.13.0'));
