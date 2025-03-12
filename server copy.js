import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import axios from "axios";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, "dist");
const errorPagePath = path.join(distPath, "error.html");

// MIME type mapping
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

// Check if request is from localhost
function isLocalhost(req) {
    const host = req.headers.host || "";
    return host.includes("localhost") || host.includes("127.0.0.1");
}

// Serve `error.html` if it exists, otherwise return plain text error
function serveErrorPage(res) {
    if (existsSync(errorPagePath)) {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(readFileSync(errorPagePath));
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Error: Page not found.");
    }
}

export default async function handler(req, res) {
    const url = req.url || "";
    const host = req.headers.host || "";
    const domainParts = host.split(".");

    // FFmpeg-related headers for specific paths
    if (["creator/byte", "ffmpeg", "worker"].some(pattern => url.includes(pattern))) {
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
    }

    // Skip subdomain validation in development mode
    if (!isLocalhost(req)) {
        if (domainParts.length !== 3 || domainParts[1] !== "guideapp" || domainParts[2] !== "co") {
            return serveErrorPage(res);
        }

        const subdomain = domainParts[0];

        try {
            const apiUrl = `https://api.guideapp.co/v1/business/domain?name=${subdomain}`;
            const response = await axios.get(apiUrl, { timeout: 5000 });

            if (!response.data?.status || !response.data?.data) {
                return serveErrorPage(res);
            }

            const businessInfo = response.data.data;
            res.setHeader("Set-Cookie", `business_info=${encodeURIComponent(JSON.stringify(businessInfo))}; Path=/; HttpOnly; Secure; SameSite=Lax`);
        } catch (error) {
            console.error("Error fetching business details:", error.message);
            return serveErrorPage(res);
        }
    }

    let reqPath = url === "/" ? "/index.html" : url;
    let filePath = path.join(distPath, reqPath);

    // Serve static files if they exist
    if (existsSync(filePath)) {
        try {
            const file = readFileSync(filePath);
            res.setHeader("Content-Type", contentTypes.get(path.extname(filePath).toLowerCase()) || "application/octet-stream");
            res.end(file);
            return;
        } catch {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Error: Could not load file.");
            return;
        }
    }

    // SPA Fallback to `index.html`
    const indexHtmlPath = path.join(distPath, "index.html");
    if (existsSync(indexHtmlPath)) {
        res.setHeader("Content-Type", "text/html");
        res.end(readFileSync(indexHtmlPath, "utf-8"));
    } else {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error: index.html not found.");
    }
}

// Start a local server when not deployed on Vercel
if (!process.env.VERCEL) {
    const server = createServer(handler);
    const PORT = process.env.PORT || 8000;
    server.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}
