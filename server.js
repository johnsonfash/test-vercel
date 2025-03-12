import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const indexHtmlPath = path.join(__dirname, "dist/index.html");

const distPath = path.join(__dirname, 'dist');

function getFilesAndFoldersSync(directory) {
    try {
        return fs.readdirSync(directory);
    } catch (err) {
        console.error(`Error reading folder: ${err.message}`);
        return []; // Return empty array if an error occurs
    }
}

export default function handler(req, res) {
    try {
        const html = readFileSync(indexHtmlPath, "utf-8");
        res.setHeader("Content-Type", "text/html");
        res.end(html);
    } catch (err) {
        res.statusCode = 500;
        res.end(`Error: index.html not found ${fs.existsSync(distPath) ? fs.readdirSync(distPath) : 'No dist folder found'}`);
    }
}
