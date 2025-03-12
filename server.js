import { existsSync, readFileSync } from "fs";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, "dist");

// ✅ Efficient O(1) lookup for MIME types
const contentTypes = new Map([
    [".html", "text/html"],
    [".css", "text/css"],
    [".js", "application/javascript"],
    [".json", "application/json"],
    [".png", "image/png"],
    [".jpg", "image/jpeg"],
    [".jpeg", "image/jpeg"],
    [".gif", "image/gif"],
    [".svg", "image/svg+xml"],
    [".ico", "image/x-icon"],
    [".txt", "text/plain"],
    [".woff", "font/woff"],
    [".woff2", "font/woff2"],
    [".ttf", "font/ttf"],
    [".otf", "font/otf"],
    [".mp4", "video/mp4"],
    [".webm", "video/webm"],
    [".mp3", "audio/mpeg"],
    [".wav", "audio/wav"],
    [".ogg", "audio/ogg"],
    [".wasm", "application/wasm"],
    [".xml", "application/xml"],
    [".pdf", "application/pdf"],
    [".zip", "application/zip"]
]);

export default function handler(req, res) {
    let reqPath = req.url === "/" ? "/index.html" : req.url;
    let filePath = path.join(distPath, reqPath);

    // ✅ Check if file exists & serve it
    if (existsSync(filePath)) {
        try {
            const file = readFileSync(filePath);
            res.setHeader("Content-Type", contentTypes.get(path.extname(filePath).toLowerCase()) || "application/octet-stream");
            res.end(file);
            return;
        } catch {
            res.statusCode = 500;
            res.end("Error: Could not load file.");
            return;
        }
    }

    // ✅ SPA Fallback to index.html
    try {
        const html = readFileSync(path.join(distPath, "index.html"), "utf-8");
        res.setHeader("Content-Type", "text/html");
        res.end(html);
    } catch {
        res.statusCode = 500;
        res.end("Error: index.html not found");
    }
}

// ✅ Start a local server when not on Vercel
if (!process.env.VERCEL) {
    const server = createServer(handler);
    const PORT = process.env.PORT || 8000;
    server.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}
