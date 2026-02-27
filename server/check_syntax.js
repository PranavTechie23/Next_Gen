const fs = require('fs');
const path = require('path');
const cp = require('child_process');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory() && !fullPath.includes('node_modules')) {
            results = results.concat(walk(fullPath));
        } else if (file.endsWith('.js')) {
            results.push(fullPath);
        }
    });
    return results;
}

const files = walk(__dirname);
let hasError = false;

console.log(`Checking ${files.length} JavaScript files...`);

files.forEach(f => {
    try {
        // Run node -c (syntax check)
        cp.execSync(`node -c "${f}"`, { stdio: 'pipe' });
    } catch (e) {
        hasError = true;
        console.error(`\nSyntax Error in ${f}:\n${e.stderr.toString()}`);
    }
});

if (!hasError) {
    console.log('No syntax errors found.');
}
