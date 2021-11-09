var spawn = require('child_process').spawn;

spawn(process.platform === 'win32' ? 'npm.cmd' : "npm", ["run", "start"], {
    stdio: "inherit"
});