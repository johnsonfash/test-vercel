import express from 'express';
import path from 'path';
import serverless from 'serverless-http';

const app = express();
app.use(express.static(path.join(__dirname, 'dist')));

app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const isVercel = process.env.VERCEL === '1';
if (isVercel) {
    module.exports = app;
    module.exports.handler = serverless(app);
} else {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}