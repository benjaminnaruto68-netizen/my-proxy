const http = require('http');
const Corrosion = require('corrosion');

// Initialize the proxy with standard configurations
const proxy = new Corrosion({
    prefix: '/proxy/', 
    codec: 'xor' // Basic obfuscation to help bypass simple network filters
});

const server = http.createServer((req, res) => {
    // If the request starts with our prefix, let the proxy handle it
    if (req.url.startsWith(proxy.prefix)) {
        return proxy.request(req, res);
    }

    // Otherwise, serve a simple landing page with an input box
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>My Personal Proxy</title>
            <style>
                body { font-family: sans-serif; text-align: center; padding-top: 50px; background: #121212; color: white; }
                input { padding: 10px; width: 300px; border-radius: 4px; border: none; }
                button { padding: 10px 20px; background: #0070f3; color: white; border: none; border-radius: 4px; cursor: pointer; }
            </style>
        </head>
        <body>
            <h1>Welcome to Your Proxy</h1>
            <form onsubmit="go(event)">
                <input type="text" id="url" placeholder="https://example.com" required>
                <button type="submit">Go</button>
            </form>
            <script>
                function go(e) {
                    e.preventDefault();
                    let url = document.getElementById('url').value;
                    if (!url.startsWith('http')) url = 'https://' + url;
                    // Encode the URL using the proxy's codec logic
                    window.location.href = window.location.origin + '${proxy.prefix}' + proxy.codec.encode(url);
                }
            </script>
        </body>
        </html>
    `);
});

// Listen on the port provided by the hosting environment, default to 8080
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Proxy running on port ${PORT}`);
});
