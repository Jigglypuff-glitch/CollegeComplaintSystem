
"use strict";

require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("readline/promises");
const connectDB = require("../src/config/database");
const User = require("../src/models/User");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function createStaff() {
    try {
        console.log("\n================================");
        console.log("   CAMPUSCARE STAFF ACCOUNT");
        console.log("================================\n");

        const fullName = (
            await rl.question("Staff full name: ")
        ).trim();

        const email = (
            await rl.question("Staff email address: ")
        ).trim().toLowerCase();

        const department = (
            await rl.question("Department: ")
        ).trim();

        const password = await rl.question(
            "Staff password (minimum 8 characters): "
        );

        if (!fullName || fullName.length < 2) {
            throw new Error("Please enter a valid full name.");
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error("Please enter a valid email address.");
        }

        if (!department) {
            throw new Error("Department is required.");
        }

        if (password.length < 8) {
            throw new Error("Password must contain at least 8 characters.");
        }

        await connectDB();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error(
                "An account with this email address already exists."
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const staff = await User.create({
            fullName,
            email,
            password: hashedPassword,
            role: "staff",
            department,
            isActive: true
        });

        console.log("\nStaff account created successfully!");
        console.log("--------------------------------");
        console.log("Name:       ", staff.fullName);
        console.log("Email:      ", staff.email);
        console.log("Department: ", staff.department);
        console.log("Role:       ", staff.role);
        console.log("Status:     ", staff.isActive ? "Active" : "Inactive");
        console.log("--------------------------------");

    } catch (error) {
        console.error("\nStaff account creation failed:");
        console.error(error.message);

        process.exitCode = 1;

    } finally {
        rl.close();
        await mongoose.disconnect();
    }
}

createStaff();
