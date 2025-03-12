import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import serverless from 'serverless-http';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve static files from "dist"
app.use(express.static(path.join(__dirname, 'dist')));

// Serve React app for all routes
app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ✅ Export for Vercel (Default Export)
export default serverless(app);

// 🔥 Start server locally (only when NOT in Vercel)
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
