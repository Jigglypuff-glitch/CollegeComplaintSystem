
"use strict";

const express = require("express");
const router = express.Router();

const {
    createComplaint,
    getMyComplaints,
    getComplaintById,
    getAllComplaints,
    updateComplaintStatus
} = require("../controllers/complaintController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

// ========================================
// STUDENT ROUTES
// ========================================

// Submit a complaint
router.post(
    "/",
    protect,
    authorize("student"),
    createComplaint
);

// View student's complaints
router.get(
    "/my",
    protect,
    authorize("student"),
    getMyComplaints
);

// ========================================
// STAFF ROUTES
// ========================================

// View all complaints
router.get(
    "/",
    protect,
    authorize("staff"),
    getAllComplaints
);

// Update complaint status
router.patch(
    "/:id/status",
    protect,
    authorize("staff"),
    updateComplaintStatus
);

// ========================================
// SHARED ROUTES
// ========================================

// View individual complaint
router.get(
    "/:id",
    protect,
    getComplaintById
);

module.exports = router;
