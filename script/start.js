const childProcess = require('child_process');
const path = require("path");

let scripts = [{
        path: path.resolve(__dirname, './clean.js'),
        args: [],
        options: {
            env: {
                NODE_ENV: 'development'
            }
        }
    },
    {
        path: path.resolve(__dirname, './watch.js'),
        args: [],
        options: {
            env: {
                NODE_ENV: 'development'
            }
        }
    }, {
        path: path.resolve(__dirname, './nodemon.js'),
        args: [],
        options: {
            env: {
                NODE_ENV: 'development'
            }
        }
    }
];

let runningScripts = [];

scripts.forEach(script => {
    let runningScript = childProcess.fork(script.path, script.args, script.options);

    // Optionally attach event listeners to the script
    runningScript.on('close', () => console.log('Time to die...'))

    runningScripts.push(runningScript); // Keep a reference to the script for later use
});

// 父脚本杀死它的分叉子节点
// runningScripts.forEach(runningScript => runningScript.kill())