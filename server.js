import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import serverless from "serverless-http";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("🔥 Server starting...");

// ✅ Serve static files from "dist"
app.use(express.static(path.join(__dirname, "dist")));

// ✅ Serve React app for all routes
app.get("*", (req, res) => {
    console.log(`➡️ Request received: ${req.url}`);
    try {
        res.sendFile(path.join(__dirname, "dist", "index.html"));
    } catch (error) {
        console.error("❌ Error serving index.html:", error);
        res.status(500).send("Error loading page.");
    }
});

// ✅ Correctly define and export handler
const handler = serverless(app);
export default handler;
