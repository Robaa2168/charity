const express = require('express');
const path = require('path');
const app = express();

// Serve dmca-notice.html for the root URL ('/')
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'children', 'dmca-notice.html'));
});

// Dynamic HTML file serving based on URL path
app.use((req, res, next) => {
    // Split the path into segments and filter out empty segments
    const segments = req.path.split('/').filter(Boolean);

    if (segments.length > 0) {
        // Construct the HTML file name
        let htmlFileName;
        if (segments.length > 1) {
            // More than one segment: replace the last '/' with an underscore and append '.html'
            const lastSegment = segments.pop();
            htmlFileName = segments.join('/') + '_' + lastSegment + '.html';
        } else {
            // Single segment: just append '.html'
            htmlFileName = segments[0] + '.html';
        }

        // Attempt to serve the HTML file from the 'children' directory
        const filePath = path.join(__dirname, 'children', htmlFileName);
        res.sendFile(filePath, (err) => {
            if (err) {
                // File not found or other error, serve 404 page
                console.log(`File not found: ${htmlFileName}`);
                res.status(404).sendFile(path.join(__dirname, 'children', 'dmca-notice.html'));
            }
        });
    } else {
        // If there are no segments, it will be handled by the root route ('/')
        next();
    }
});

// Fallback 404 handler for other requests
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'children', 'dmca-notice.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
