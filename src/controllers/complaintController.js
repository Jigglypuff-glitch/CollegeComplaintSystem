
"use strict";

const Complaint = require("../models/Complaint");

// ========================================
// 1. SUBMIT A COMPLAINT (STUDENT)
// ========================================

const createComplaint = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            priority
        } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({
                success: false,
                message: "Title, description and category are required."
            });
        }

        const complaint = await Complaint.create({
            student: req.user._id,
            title,
            description,
            category,
            priority: priority || "Medium"
        });

        return res.status(201).json({
            success: true,
            message: "Complaint submitted successfully.",
            complaint
        });

    } catch (error) {
        console.error("Create complaint error:", error.message);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to submit complaint."
        });
    }
};

// ========================================
// 2. GET STUDENT'S COMPLAINTS
// ========================================

const getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({
            student: req.user._id
        })
            .populate("assignedTo", "fullName email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: complaints.length,
            complaints
        });

    } catch (error) {
        console.error("Get complaints error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve complaints."
        });
    }
};

// ========================================
// 3. GET INDIVIDUAL COMPLAINT
// ========================================

const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate("student", "fullName email studentId department")
            .populate("assignedTo", "fullName email");

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found."
            });
        }

        // Students can only view their own complaints
        if (
            req.user.role === "student" &&
            complaint.student._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You cannot access this complaint."
            });
        }

        return res.status(200).json({
            success: true,
            complaint
        });

    } catch (error) {
        console.error("Get complaint error:", error.message);

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid complaint ID."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve complaint."
        });
    }
};

// ========================================
// 4. GET ALL COMPLAINTS (STAFF)
// ========================================

const getAllComplaints = async (req, res) => {
    try {
        const {
            status,
            category,
            priority
        } = req.query;

        const filters = {};

        if (status) filters.status = status;
        if (category) filters.category = category;
        if (priority) filters.priority = priority;

        const complaints = await Complaint.find(filters)
            .populate("student", "fullName email studentId department")
            .populate("assignedTo", "fullName email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: complaints.length,
            complaints
        });

    } catch (error) {
        console.error("Get all complaints error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve complaints."
        });
    }
};

// ========================================
// 5. UPDATE COMPLAINT STATUS (STAFF)
// ========================================

const updateComplaintStatus = async (req, res) => {
    try {
        const {
            status,
            resolution
        } = req.body;

        const allowedStatuses = [
            "Submitted",
            "Under Review",
            "In Progress",
            "Resolved",
            "Rejected"
        ];

        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid complaint status."
            });
        }

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found."
            });
        }

        complaint.status = status;

        if (typeof resolution === "string") {
            complaint.resolution = resolution.trim();
        }

        complaint.resolvedAt =
            status === "Resolved" ? new Date() : null;

        await complaint.save();

        return res.status(200).json({
            success: true,
            message: "Complaint status updated successfully.",
            complaint
        });

    } catch (error) {
        console.error("Update complaint error:", error.message);

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid complaint ID."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to update complaint."
        });
    }
};

// ========================================
// EXPORT CONTROLLERS
// ========================================

module.exports = {
    createComplaint,
    getMyComplaints,
    getComplaintById,
    getAllComplaints,
    updateComplaintStatus
};
