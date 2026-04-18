const http = require('http');
const fs = require('fs');
const path = require('path');

function resolveRequestPath(urlPath) {
    // Serve viewer app from root while keeping /viewer/* paths valid.
    const cleanPath = String(urlPath || '/').split('?')[0];
    if (cleanPath === '/' || cleanPath === '') {
        return path.join(__dirname, 'viewer', 'index.html');
    }

    // 1) Try as-is (backward compatibility for /viewer/* and repo-root files)
    let direct = path.join(__dirname, cleanPath);
    if (fs.existsSync(direct)) {
        if (fs.statSync(direct).isDirectory()) {
            direct = path.join(direct, 'index.html');
        }
        if (fs.existsSync(direct)) return direct;
    }

    // 2) Fallback: map root paths to /viewer/*
    let inViewer = path.join(__dirname, 'viewer', cleanPath.replace(/^[/\\]+/, ''));
    if (fs.existsSync(inViewer)) {
        if (fs.statSync(inViewer).isDirectory()) {
            inViewer = path.join(inViewer, 'index.html');
        }
        if (fs.existsSync(inViewer)) return inViewer;
    }

    return null;
}

http.createServer((req, res) => {
    const filePath = resolveRequestPath(req.url);
    if (!filePath) {
        res.writeHead(404);
        return res.end('Not Found');
    }

    fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); return res.end("Not Found"); }
        // Dev mode: disable browser caching so UI/script edits appear immediately.
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Surrogate-Control', 'no-store');
        if (filePath.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
        else if (filePath.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript');
        else if (filePath.endsWith('.html')) res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.end(data);
    });
}).listen(3000);
console.log('Server running at http://localhost:3000/');
