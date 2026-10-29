require("dotenv").config();

const connectDB = require("./config/database");
"use strict";

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Parse incoming JSON and form data.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files from the public directory.
const publicDirectory = path.join(__dirname, "..", "public");
app.use(express.static(publicDirectory));

// Landing page.
app.get("/", (req, res) => {
    res.sendFile(path.join(publicDirectory, "index.html"));
});

// Health check to confirm the server is running.
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "CampusCare server is running.",
        timestamp: new Date().toISOString()
    });
});

// Handle unknown API routes.
app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not implemented yet."
    });
});

// Handle unknown page routes.
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 - Page Not Found | CampusCare</title>
            <link rel="stylesheet" href="/css/styles.css">
        </head>
        <body>
            <main class="container" style="padding: 4rem 1rem; text-align: center;">
                <h1>404 - Page Not Found</h1>
                <p>The page you requested could not be found.</p>
                <a href="/" class="button button-primary">Back to Home</a>
            </main>
        </body>
        </html>
    `);
});

// Start the server.
async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`CampusCare is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start CampusCare:", error.message);
        process.exit(1);
    }
}

startServer();

