const shell = require('shelljs');
const fs = require('fs');

/**
 * Rebuild ENV values
 */
const envVariables = require('../.env.json');

let envOutput = '';

for (let key in envVariables) {
    const val = envVariables[key];

    envOutput += key + '=';

    if (key === 'SITES_CONFIG') {
        envOutput += JSON.stringify(val) + '\n';
    } else {
        envOutput += val + '\n';
    }
}

console.log(envOutput);

/**
 * Write file to env
 */
fs.writeFileSync('.env', envOutput);

/**
 * Restart server
 */
// shell.exec('pm2 restart dist');
