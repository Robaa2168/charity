const express = require('express');
const path = require('path');
const app = express();

// Serve learn-more.html for the root URL ('/')
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'children', 'learn-more.html'));
});

// Dynamic HTML file serving based on URL path
app.use((req, res, next) => {
    // Log the original request URL and path
    console.log('Original URL:', req.originalUrl);
    console.log('Original Path:', req.path);

    // Split the path into segments and filter out empty segments
    const segments = req.path.split('/').filter(Boolean);
    console.log('Path Segments:', segments);

    // Check if the request is for a static asset (by looking for a file extension)
    const lastSegment = segments[segments.length - 1];
    const hasExtension = lastSegment.includes('.');

    if (!hasExtension) {
        // It's not a static asset, apply HTML file logic
        let htmlFileName = segments.length === 1 ? segments[0] + '.html' : segments.join('_') + '.html';
        console.log('Constructed Filename:', htmlFileName);

        // Serve the corresponding HTML file
        const filePath = path.join(__dirname, 'children', htmlFileName);
        console.log('Attempting to serve file:', filePath);

        res.sendFile(filePath, (err) => {
            if (err) {
                // File not found or other error, serve 404 page
                console.log(`Error: File not found - ${htmlFileName}`);
                res.status(404).sendFile(path.join(__dirname, 'children', 'dmca-notice.html'));
            }
        });
    } else {
        // It's a static asset, continue to the next middleware (which could be express.static or similar)
        next();
    }
});

// Serve static files (CSS, JS, fonts, etc.)
app.use(express.static(path.join(__dirname, 'children')));

// Fallback 404 handler for other requests
app.use((req, res) => {
    console.log('Handling 404 for URL:', req.originalUrl);
    res.status(404).sendFile(path.join(__dirname, 'children', 'dmca-notice.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
