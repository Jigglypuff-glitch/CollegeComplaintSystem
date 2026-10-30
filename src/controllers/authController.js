
"use strict";

// ========================================
// 1. IMPORT DEPENDENCIES
// ========================================

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ========================================
// 2. STUDENT REGISTRATION
// ========================================

const registerUser = async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            studentId,
            department
        } = req.body;

        // Validate required fields
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Full name, email and password are required."
            });
        }

        // Validate input types
        if (
            typeof fullName !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid input format."
            });
        }

        // Validate name and email
        if (fullName.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "Full name must contain at least 2 characters."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address."
            });
        }

        // Validate password
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters."
            });
        }

        // Check existing account
        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Prepare user data
        const userData = {
            fullName: fullName.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "student"
        };

        if (typeof studentId === "string" && studentId.trim()) {
            userData.studentId = studentId.trim();
        }

        if (typeof department === "string" && department.trim()) {
            userData.department = department.trim();
        }

        // Save student to MongoDB
        const newUser = await User.create(userData);

        return res.status(201).json({
            success: true,
            message: "Student account created successfully.",
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                role: newUser.role,
                studentId: newUser.studentId,
                department: newUser.department
            }
        });

    } catch (error) {
        console.error("Registration error:", error.message);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "This email or student ID is already registered."
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to register your account."
        });
    }
};

// ========================================
// 3. STUDENT LOGIN
// ========================================

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate credentials
        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Find user and retrieve password hash
        const user = await User.findOne({
            email: normalizedEmail
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Check account status
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account is currently inactive."
            });
        }

        // Compare password
        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Check JWT configuration
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing from environment variables.");
        }

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user._id.toString(),
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                studentId: user.studentId,
                department: user.department
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to log in. Please try again."
        });
    }
};

// ========================================
// 4. GET AUTHENTICATED USER PROFILE
// ========================================

const getMe = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "User profile retrieved successfully.",
            user: {
                id: req.user._id,
                fullName: req.user.fullName,
                email: req.user.email,
                role: req.user.role,
                studentId: req.user.studentId,
                department: req.user.department
            }
        });

    } catch (error) {
        console.error("Get profile error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve user profile."
        });
    }
};

// ========================================
// 5. EXPORT CONTROLLERS
// ========================================

module.exports = {
    registerUser,
    loginUser,
    getMe
};
