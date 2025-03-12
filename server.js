import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import serverless from 'serverless-http';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'dist')));

app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Always define exports at the top level
const isVercel = process.env.VERCEL === '1';
export const handler = isVercel ? serverless(app) : undefined;

// Start server locally only
if (!isVercel) {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
