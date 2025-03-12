import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const indexHtmlPath = path.join(__dirname, "dist/index.html");

export default function handler(req, res) {
    try {
        const html = readFileSync(indexHtmlPath, "utf-8");
        res.setHeader("Content-Type", "text/html");
        res.end(html);
    } catch (err) {
        res.statusCode = 500;
        res.end("Error: index.html not found");
    }
}
