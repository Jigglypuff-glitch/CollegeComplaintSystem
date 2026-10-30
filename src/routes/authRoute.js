
"use strict";

const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Verify controller exports
const {
    registerUser,
    loginUser,
    getMe
} = authController;

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route
router.get("/me", authMiddleware.protect, getMe);

module.exports = router;
