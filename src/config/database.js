
"use strict";

const mongoose = require("mongoose");

async function connectDB() {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error("MONGODB_URI is missing from the environment.");
    }

    await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10000
    });

    console.log("MongoDB Atlas connected successfully.");
}

module.exports = connectDB;
