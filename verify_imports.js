/* ============================================================
   FitForge — Static Import Path Verifier
   Validates that all relative imports in the codebase exist
   ============================================================ */

import fs from 'fs';
import path from 'path';

let filesChecked = 0;
let errorsFound = 0;

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

function verifyFileImports(filePath) {
  if (!filePath.endsWith('.js') && !filePath.endsWith('.mjs')) return;

  filesChecked++;
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Regular expressions to match ES imports:
  // e.g. import foo from './path.js' or import('./path.js')
  const importRegex = /import\s+.*?from\s+['"](.*?)['"]/g;
  const dynamicImportRegex = /import\(['"](.*?)['"]\)/g;

  let match;
  const fileDir = path.dirname(filePath);

  const checkPath = (importPath) => {
    // If it's a relative path, check it
    if (importPath.startsWith('.')) {
      const resolvedPath = path.resolve(fileDir, importPath);
      
      // Node allows importing without extensions sometimes, but for ES modules in browser
      // and relative paths in PWA, the exact file extension must be present
      if (!fs.existsSync(resolvedPath)) {
        errorsFound++;
        console.error(`\x1b[31m[ERROR]\x1b[0m Broken import in \x1b[33m${filePath}\x1b[0m:`);
        console.error(`        Target path not found: "${importPath}" (Resolved: "${resolvedPath}")`);
      }
    }
  };

  while ((match = importRegex.exec(content)) !== null) {
    checkPath(match[1]);
  }

  while ((match = dynamicImportRegex.exec(content)) !== null) {
    checkPath(match[1]);
  }
}

console.log("=========================================");
console.log("   FitForge Static Import Path Verifier  ");
console.log("=========================================\n");

walkDir('./js', verifyFileImports);

console.log("\n=========================================");
console.log(`Verification Summary:`);
console.log(`  Files checked: ${filesChecked}`);
console.log(`  Errors found:  ${errorsFound}`);
console.log("=========================================");

if (errorsFound > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
