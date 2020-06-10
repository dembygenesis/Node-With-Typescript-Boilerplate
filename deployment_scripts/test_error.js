const shell = require('shelljs');
const fs = require('fs');

shell.exec('if [[ $(tsc) ]]; then npm run alert-failed-compile; else pm2 reload dist; fi');
