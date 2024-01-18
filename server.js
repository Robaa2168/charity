const express = require('express');
const path = require('path');
const app = express();
const port = 5000;

// URL rewrite logic
app.use((req, res, next) => {
    // Log the original request URL and path
    console.log('Original URL:', req.originalUrl);
    console.log('Original Path:', req.path);

    // Split the path into segments
    const segments = req.path.split('/').filter(Boolean); 
    console.log('Path Segments:', segments);

    // Check if the last segment has a file extension
    const lastSegment = segments[segments.length - 1];
    const hasExtension = lastSegment.includes('.');

    if (!hasExtension) {
        // If there's no file extension, assume it's an HTML page
        if (segments.length > 1) {
            // More than one segment: replace the last '/' with an underscore and append '.html'
            const newLastSegment = segments.pop() + '.html';
            req.url = '/' + segments.join('/') + '_' + newLastSegment;
            console.log('Rewritten URL (multi-segment):', req.url);
        } else if (segments.length === 1) {
            // Single segment: just append '.html'
            req.url = '/' + segments[0] + '.html';
            console.log('Rewritten URL (single segment):', req.url);
        } else {
            console.log('Root URL, no rewrite necessary.');
        }
    } else {
        // If there's a file extension, don't rewrite the URL
        console.log('No rewrite: File extension detected.');
    }

    next();
});


// Serve static files from 'children' directory
app.use(express.static('children'));

// Serve dmca-notice.html for the root URL ('/')
app.get('/', (req, res) => {
    console.log('Serving root URL: /');
    res.sendFile(path.join(__dirname, 'children', 'dmca-notice.html'));
});

// Serve dmca-notice.html for any 404 Not Found URLs
app.use((req, res, next) => {
    console.log('Handling 404 for URL:', req.originalUrl);
    res.status(404).sendFile(path.join(__dirname, 'children', 'dmca-notice.html'));
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});


