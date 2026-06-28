/* ============================================================
   FitForge — Zero-Dependency Static Web Server (Node.js)
   Bulletproof local server fallback for running the PWA
   ============================================================ */

import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 8000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  // Normalize request URL path
  let filePath = req.url.split('?')[0];
  if (filePath === '/') {
    filePath = '/index.html';
  }

  // Resolve to local workspace directory
  const localPath = path.join(process.cwd(), filePath);

  fs.stat(localPath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback: Support SPA routing by serving index.html for unknown routes
      const indexPath = path.join(process.cwd(), 'index.html');
      fs.readFile(indexPath, (indexErr, content) => {
        if (indexErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content);
        }
      });
      return;
    }

    // Serve the file
    const ext = path.extname(localPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(localPath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`\n\x1b[32m[FitForge Server] Running at: http://localhost:${PORT}\x1b[0m`);
  console.log(`[FitForge Server] Press Ctrl+C to terminate\n`);
});
