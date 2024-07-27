console.log('Test of Browserstack! By Awanish Mishra');

const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const chokidar = require('chokidar');
const readline = require('readline');

const filePath = path.join(__dirname, 'sample.log');
const PORT = process.env.PORT || 8081;

const wss = new WebSocket.Server({ port: PORT });

let filePosition = 0; // Pointer to track the last read position
let lines = [];

// Function to read new lines from the last read position
function readNewLines(callback) {
    const stream = fs.createReadStream(filePath, { start: filePosition, encoding: 'utf-8' });
    const rl = readline.createInterface({ input: stream });

    rl.on('line', (line) => {
        lines.push(line);
        if (lines.length > 10) {
            lines.shift();
        }
    });

    rl.on('close', () => {
        fs.stat(filePath, (err, stats) => {
            if (err) {
                console.error(`Error stating file: ${err.message}`);
                return;
            }
            filePosition = stats.size; // Update the file position to the end of the file
            callback(lines.join('\n'));
        });
    });
}

// Function to broadcast new lines to WebSocket clients
function broadcastNewLines() {
    readNewLines((newLines) => {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(newLines);
            }
        });
    });
}

// Initial read of the file to output existing content
fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
        console.error(`Error reading file: ${err.message}`);
        return;
    }
    const linesFromFile = data.split('\n').filter(line => line.trim() !== '');
    lines = linesFromFile.slice(-10); // Store only the last 10 lines
    filePosition = data.length; // Set the initial file position to the end of the file
    broadcastNewLines(); // Broadcast the initial content to connected clients
});

// Watch the file for changes
const watcher = chokidar.watch(filePath, { persistent: true });

watcher.on('change', (path) => {
    broadcastNewLines();
});

// Handling WebSocket connection
wss.on('connection', (socket) => {
    console.log('New Connection Established');
    // Send the last 10 lines of the log file upon a new connection
    socket.send(lines.join('\n'));

    socket.on('message', (data) => {
        console.log('received:', data);
    });

    socket.on('close', () => {
        console.log('connection closed');
    });
});

console.log(`WebSocket listening on ${PORT}`);
