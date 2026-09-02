const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== '.git') {
        replaceInDir(fullPath);
      }
    } else if (/\.(tsx|ts|jsx|js|json|md|css|html)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const updated = content
        .replace(/KaushalSetu/g, 'Skillora')
        .replace(/Kaushal Setu/g, 'Skillora')
        .replace(/kaushalsetu/g, 'skillora')
        .replace(/KAUSHALSETU/g, 'SKILLORA');

      if (content !== updated) {
        fs.writeFileSync(fullPath, updated, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

replaceInDir(path.join(__dirname, '../src'));
replaceInDir(path.join(__dirname, '../README.md'));
console.log('All replacements completed successfully!');
