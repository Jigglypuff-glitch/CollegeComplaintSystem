
"use strict";

const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
    {
        // Student who submitted the complaint
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        // Complaint information
        title: {
            type: String,
            required: [true, "Complaint title is required"],
            trim: true,
            minlength: 5,
            maxlength: 150
        },

        description: {
            type: String,
            required: [true, "Complaint description is required"],
            trim: true,
            minlength: 10,
            maxlength: 5000
        },

        category: {
            type: String,
            required: true,
            enum: [
                "Academic",
                "Infrastructure",
                "Hostel",
                "Library",
                "Canteen",
                "Administration",
                "Examination",
                "Other"
            ]
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },

        // Complaint lifecycle
        status: {
            type: String,
            enum: [
                "Submitted",
                "Under Review",
                "In Progress",
                "Resolved",
                "Rejected"
            ],
            default: "Submitted",
            index: true
        },

        // Staff member handling the complaint
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        resolution: {
            type: String,
            trim: true,
            maxlength: 3000,
            default: ""
        },

        resolvedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

// Useful for retrieving a student's complaints by date
complaintSchema.index({
    student: 1,
    createdAt: -1
});

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;
