const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
const PORT = 5001 || process.env.PORT;

app.use(cors());
app.use(express.json());

// Function to open URL in specified browser
function openUrlInBrowser(domain, browser, res) {
    let command;

    switch (browser.toLowerCase()) {
        case 'safari':
            command = `open -a Safari "${domain}"`;
            break;
        case 'chrome':
            command = `open -a "Google Chrome" "${domain}"`;
            break;
        case 'firefox':
            command = `open -a Firefox "${domain}"`;
            break;
        case 'edge':
            command = `open -a "Microsoft Edge" "${domain}"`;
            break;
        default:
            res.status(400).send(`Unsupported browser: ${browser}`);
            return;
    }

    // Execute the command to open the URL in the specified browser
    exec(command, (err) => {
        if (err) {
            res.status(500).send(`Failed to open ${domain} in ${browser}: ${err}`);
        } else {
            res.send(`Opened ${domain} in ${browser}`);
        }
    });
}

app.post('/open-url', (req, res) => {
    const { url, browser } = req.body;
    if (!url || !browser) {
        return res.status(400).send('URL and browser are required');
    }

    openUrlInBrowser(url, browser, res);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
