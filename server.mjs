import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import chalk from 'chalk';
import { table } from 'table';
import browserSync from 'browser-sync';
import liveServer from 'live-server';

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;
const defaultPort = 3001;

// Middleware
app.use(morgan('dev')); // Logging
app.use(compression()); // Compression
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

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(path.resolve(), 'Webpage', 'index.html'));
});

// Start Express Server
app.listen(port, () => {
            console.log(chalk.green(`Express server running at ${chalk.blue(`http://localhost:${port}`)}`));

    if (process.env.USE_BROWSER_SYNC === 'true') {
        browserSync.create().init({
            proxy: `http://localhost:${port}`, // Proxy the Express server
            files: ['Webpage/**/*.*'], // Watch for changes in Webpage folder
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
                open: true, // Open the browser on start
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