import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, "dist");

export default function handler(req, res) {
    let filePath = path.join(distPath, req.url);

    // ✅ Check if file exists & serve it
    if (existsSync(filePath)) {
        try {
            const file = readFileSync(filePath);
            const ext = path.extname(filePath).toLowerCase();
            
            // Set correct content type
            const contentType = getContentType(ext);
            res.setHeader("Content-Type", contentType);
            res.end(file);
            return;
        } catch (err) {
            res.statusCode = 500;
            res.end("Error: Could not load file.");
            return;
        }
    }

    // ✅ Serve `index.html` for all other routes (SPA fallback)
    const indexHtmlPath = path.join(distPath, "index.html");
    try {
        const html = readFileSync(indexHtmlPath, "utf-8");
        res.setHeader("Content-Type", "text/html");
        res.end(html);
    } catch (err) {
        res.statusCode = 500;
        res.end("Error: index.html not found");
    }
}

// ✅ Function to determine the correct content type
function getContentType(ext) {
    const types = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "application/javascript",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".ico": "image/x-icon"
    };
    return types[ext] || "application/octet-stream";
}
