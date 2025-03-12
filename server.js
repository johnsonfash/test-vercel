import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import serverless from "serverless-http";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ✅ Serve static files from "dist"
app.use(express.static(path.join(__dirname, "dist")));

// ✅ Serve React app for all routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ✅ Correctly define and export handler
const handler = serverless(app);
export default handler;
