const path = require('path');
const { exec } = require('child_process');

exec('http-server -p 3000');
console.log('server runnint at http://localhost:3000');

const Gaze = require('gaze').Gaze;

const gaze = new Gaze(path.resolve(__dirname, '../src') + '**/*');

gaze.on('ready', function(watcher) {
    bundle();
});

gaze.on('all', function(event, filepath) {
    bundle();
});

function bundle() {
    var cp = exec('npm run dev');
    cp.stdout.pipe(process.stdout);
    cp.stderr.pipe(process.stdout);
}
