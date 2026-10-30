
"use strict";

// ========================================
// 1. ENVIRONMENT CONFIGURATION
// ========================================
require("dotenv").config();

// ========================================
// 2. IMPORT DEPENDENCIES
// ========================================
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

// ========================================
// 3. IMPORT APPLICATION MODULES
// ========================================
const connectDB = require("./config/database");

const authRoutes = require("./routes/authRoute");
const complaintRoutes = require("./routes/complaintRoute");

// ========================================
// 4. INITIALIZE EXPRESS
// ========================================
const app = express();
const PORT = process.env.PORT || 3000;

// ========================================
// 5. MIDDLEWARE
// ========================================
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.disable("x-powered-by");

// ========================================
// 6. SERVE FRONTEND
// ========================================
const publicDirectory = path.join(__dirname, "..", "public");

app.use(express.static(publicDirectory));

// ========================================
// 7. AUTHENTICATION ROUTES
// ========================================
app.use("/api/auth", authRoutes);

// ========================================
// 8. COMPLAINT ROUTES
// ========================================
app.use("/api/complaints", complaintRoutes);

// ========================================
// 9. HOMEPAGE
// ========================================
app.get("/", (req, res) => {
    res.sendFile(path.join(publicDirectory, "index.html"));
});

// ========================================
// 10. HEALTH CHECK
// ========================================
app.get("/api/health", (req, res) => {
    const databaseConnected = mongoose.connection.readyState === 1;

    res.status(databaseConnected ? 200 : 503).json({
        success: databaseConnected,
        message: "CampusCare server health status",
        server: "Running",
        database: databaseConnected ? "Connected" : "Disconnected",
        databaseName: mongoose.connection.name || null,
        timestamp: new Date().toISOString()
    });
});

// ========================================
// 11. UNKNOWN API ROUTES
// ========================================
app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found."
    });
});

// ========================================
// 12. UNKNOWN FRONTEND PAGES
// ========================================
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 - CampusCare</title>
            <link rel="stylesheet" href="/css/styles.css">
        </head>
        <body>
            <main style="padding: 4rem 1rem; text-align: center;">
                <h1>404 - Page Not Found</h1>
                <p>The page you requested could not be found.</p>
                <a href="/" class="button button-primary">
                    Back to Home
                </a>
            </main>
        </body>
        </html>
    `);
});

// ========================================
// 13. GLOBAL ERROR HANDLER
// ========================================
app.use((error, req, res, next) => {
    console.error("Application error:", error.message);

    res.status(error.status || 500).json({
        success: false,
        message: "An unexpected server error occurred."
    });
});

// ========================================
// 14. START SERVER
// ========================================
async function startServer() {
    try {
        await connectDB();

        const server = app.listen(PORT, "0.0.0.0", () => {
            console.log("===================================");
            console.log("       CAMPUSCARE SERVER");
            console.log("===================================");
            console.log(`Port: ${PORT}`);
            console.log("MongoDB: Connected");
            console.log("Authentication API: Ready");
            console.log("Complaint API: Ready");
            console.log("===================================");
        });

        server.on("error", (error) => {
            console.error("Server error:", error.message);
            process.exit(1);
        });

    } catch (error) {
        console.error("CampusCare startup failed:", error.message);
        process.exit(1);
    }
}

startServer();
