import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import chalk from 'chalk';
import { table } from 'table';
import cors from 'cors';
import browserSync from 'browser-sync';
import liveServer from 'live-server';
import puppeteer from 'puppeteer'; // Import Puppeteer to capture screenshots
import fs from 'fs'; // File system module to handle file operations

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;
const defaultPort = 3001;
const activeConnections = new Set(); // To store unique IP addr

// Middleware
app.use(morgan('dev')); // Logging
app.use(compression()); // Compression
app.use(cors()); // Allow all origins
app.use(helmet()); // Security
app.use(express.static(path.join(path.resolve(), 'Webpage'))); // Serve static files from Webpage folder

// Dynamically Check Statuses
const checkPackageStatus = () => {
    let statuses = [
        { name: 'Express', status: app ? 'Running' : 'Not Running', color: app ? chalk.green : chalk.red },
        { name: 'Nodemon', status: process.env.NODE_ENV !== 'production' ? 'Running (Dev)' : 'Not applicable (Prod)', color: chalk.yellow },
        {
            name: process.env.USE_BROWSER_SYNC === 'true' ? 'Browser-Sync' : 'Live-Server',
            status: process.env.USE_BROWSER_SYNC === 'true' ? (browserSync ? 'Configured' : 'Not Configured') :
                (liveServer ? 'Configured' : 'Not Configured'),
            color: (process.env.USE_BROWSER_SYNC === 'true' ? (browserSync ? chalk.green : chalk.red) :
                (liveServer ? chalk.green : chalk.red))
        },
        { name: 'dotenv', status: dotenv ? 'Loaded' : 'Not Loaded', color: dotenv ? chalk.green : chalk.red },
        { name: 'morgan', status: morgan ? 'Running' : 'Not Running', color: morgan ? chalk.green : chalk.red },
        { name: 'compression', status: compression ? 'Running' : 'Not Running', color: compression ? chalk.green : chalk.red },
        { name: 'helmet', status: helmet ? 'Running' : 'Not Running', color: helmet ? chalk.green : chalk.red },
        { name: 'Chalk', status: chalk ? 'Loaded' : 'Not Loaded', color: chalk ? chalk.green : chalk.red },
        { name: 'Table', status: table ? 'Loaded' : 'Not Loaded', color: table ? chalk.green : chalk.red },
    ];

    return statuses;
};

const packageStatuses = checkPackageStatus();

// Prepare the table data
const tableData = [
    [chalk.bold('Package'), chalk.bold('Status')],
    ...packageStatuses.map(pkg => [pkg.color(pkg.name), pkg.color(pkg.status)]),
];

// Display the table
console.log(table(tableData));

// Middleware to log connections
app.use((req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress;
    activeConnections.add(ip); // Add IP to the set
    console.log(`New connection from ${ip}`);
    res.on('finish', () => {
        activeConnections.delete(ip); // Remove IP from the set when connection is finished
        console.log(`Connection from ${ip} ended`);
    });
    next();
});


// Directory to save screenshots
const screenshotDir = path.join(path.resolve(), './Webpage/Screenshots');
app.use('/Screenshots', express.static(screenshotDir));

// Ensure the screenshot directory exists
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir);
}

// Screenshot route
// http://localhost:3000/screenshot?file=Webpage/Website/3d-gallery/index.html
// http://localhost:3000/screenshot?url=https://Wwww.google.com
// Still on working progress. Idea is to generate screenshot of every website inside ./Website.
app.get('/screenshot', async(req, res) => {
    const url = req.query.url;
    const file = req.query.file; // New query parameter for local file

    if (!url && !file) {
        console.log(chalk.red('No URL or file path provided.'));
        return res.status(400).send('URL or file path is required');
    }

    let browser;
    try {
        console.log(chalk.blue(`Taking screenshot of: ${url || file}`));

        // Launch the browser
        browser = await puppeteer.launch({
            headless: true, // Run in headless mode
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Arguments for better compatibility
        });

        const page = await browser.newPage();

        // Set a viewport size if necessary
        await page.setViewport({ width: 1280, height: 800 });

        if (file) {
            // If a local file is specified, load it using the file:// protocol
            const filePath = path.join(path.resolve(), file);

            // Check if the file exists
            if (!fs.existsSync(filePath)) {
                console.log(chalk.red(`File not found: ${filePath}`));
                return res.status(404).send('File not found');
            }

            await page.goto(`file://${filePath}`, {
                waitUntil: 'networkidle0', // Wait for the network to be completely idle
                timeout: 30000 // 60 seconds timeout for navigation
            });
        } else if (url) {
            // If a URL is specified, load the URL
            await page.goto(url, {
                waitUntil: 'networkidle0', // Wait for network to be completely idle
                timeout: 30000 // 60 seconds timeout for navigation
            });
        }

        // Define the filename with a timestamp to avoid overwriting
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Replace ':' and '.' to make it filesystem-friendly
        const screenshotFilename = `screenshot-${timestamp}.png`;
        const screenshotPath = path.join(screenshotDir, screenshotFilename);

        // Capture the screenshot and save it to the specified path
        await page.screenshot({ path: screenshotPath, fullPage: true });

        await browser.close();

        // Send HTML response with the image URL
        const relativePath = `/Screenshots/${screenshotFilename}`;
        res.status(200).send(`<img src="${relativePath}" alt="Screenshot"></img>`);

        console.log(chalk.green('Screenshot captured and saved successfully at:'), screenshotPath);
    } catch (error) {
        console.error(chalk.red('Error capturing screenshot:', error));
        if (browser) await browser.close();
        res.status(500).send('Failed to capture screenshot');
    }
});


// Other routes and server configuration...

app.listen(port, () => {
            console.log(chalk.green(`Express server running at ${chalk.blue(`http://localhost:${port}`)}`));

    if (process.env.USE_BROWSER_SYNC === 'true') {
        browserSync.create().init({
            proxy: `http://localhost:${port}`, // Proxy the Express server
            files: ['Webpage/**/*.*'], // Watch for changes in Webpage folder
            ignore: path.join(path.resolve(), 'Webpage/Screenshots'),
            port: defaultPort, // Browser-Sync's port
            open: true, // Open the browser on start
            notify: true, // Enable notifications
        }, (err) => {
            if (err) {
                console.log(chalk.red('Browser-Sync failed to start.'));
            } else {
                console.log(chalk.green(`Browser-Sync running at ${chalk.blue(`http://localhost:${defaultPort}`)}`));
            }
            console.log(chalk.yellow('Press Ctrl+C to stop the server.'));
        });
    } else {
        try {
            liveServer.start({
                port: defaultPort, // Live-server's port
                root: path.join(path.resolve(), 'Webpage'), // Directory to serve
                ignore: path.join(path.resolve(), 'Webpage/Screenshots'),
                open: false, // Open the browser on start
                logLevel: 3, // Log level (1 = errors only, 2 = errors and warnings, 3 = errors, warnings, and info)
            });

            console.log(chalk.green(`Live-Server running at ${chalk.blue(`http://localhost:${defaultPort}`)}`));
            console.log(chalk.yellow('Press Ctrl+C to stop the server.'));
        } catch (err) {
            console.log(chalk.red('Live-Server failed to start.'));
            console.error(err);
        }
    }
});