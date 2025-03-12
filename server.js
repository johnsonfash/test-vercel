import { existsSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, "dist");
const errorPagePath = path.join(distPath, "error.html");

const contentTypes = new Map([
    [".html", "text/html"], [".css", "text/css"], [".js", "application/javascript"],
    [".json", "application/json"], [".png", "image/png"], [".jpg", "image/jpeg"],
    [".jpeg", "image/jpeg"], [".gif", "image/gif"], [".svg", "image/svg+xml"],
    [".ico", "image/x-icon"], [".txt", "text/plain"], [".woff", "font/woff"],
    [".woff2", "font/woff2"], [".ttf", "font/ttf"], [".otf", "font/otf"],
    [".mp4", "video/mp4"], [".webm", "video/webm"], [".mp3", "audio/mpeg"],
    [".wav", "audio/wav"], [".ogg", "audio/ogg"], [".wasm", "application/wasm"],
    [".xml", "application/xml"], [".pdf", "application/pdf"], [".zip", "application/zip"]
]);

function serveErrorPage(res) {
    if (existsSync(errorPagePath)) {
        // res.setHeader("Content-Type", "text/html");
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(readFileSync(errorPagePath));
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Error: Page not found.");
    }
}

export default function handler(req, res) {
    let reqPath = req.url === "/" ? "/index.html" : req.url || '';
    let filePath = path.join(distPath, reqPath);

    console.log(reqPath);
    
    return serveErrorPage(res);

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

    try {
        const html = readFileSync(path.join(distPath, "index.html"), "utf-8");
        res.setHeader("Content-Type", "text/html");
        res.end(html);
    } catch {
        res.statusCode = 500;
        res.end("Error: index.html not found");
    }
}