const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../../');
let hasError = false;

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (fullPath.endsWith('.js') && !fullPath.includes('/tests/') && !fullPath.includes('/contracts/')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes("emit('")) {
        console.error(`[VIOLATION] Found unregistered string emit() in: ${fullPath}`);
        hasError = true;
      }
      if (content.match(/alert\(/)) {
        console.error(`[VIOLATION] Found raw alert() in: ${fullPath}`);
        hasError = true;
      }
    }
  }
}

scanDir(ROOT_DIR);

if (hasError) {
  console.error('\nCI SCAN FAILED: Contract violations found.\n');
  process.exit(1);
} else {
  console.log('\nCI SCAN PASSED: No contract violations found.\n');
  process.exit(0);
}
