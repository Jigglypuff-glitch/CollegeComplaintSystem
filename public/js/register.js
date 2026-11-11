
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");

    if (!registerForm) return;

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const message = document.getElementById("register-message");
        const submitButton = registerForm.querySelector('button[type="submit"]');

        const fullName = document.getElementById("fullName").value.trim();
        const studentId = document.getElementById("studentId").value.trim();
        const email = document.getElementById("email").value.trim();
        const department = document.getElementById("department").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        function showMessage(text, type) {
            message.textContent = text;
            message.classList.remove("hidden", "success", "error");
            message.classList.add(type);
        }

        if (password !== confirmPassword) {
            showMessage("Passwords do not match.", "error");
            return;
        }

        try {
            submitButton.disabled = true;
            showMessage("Creating your account...", "success");

            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullName,
                    studentId,
                    email,
                    department,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Registration failed.");
            }

            showMessage(
                "Account created successfully! Redirecting to login...",
                "success"
            );

            registerForm.reset();

            setTimeout(() => {
                window.location.href = "/login.html";
            }, 2000);

        } catch (error) {
            console.error("Registration error:", error);
            showMessage(error.message, "error");
            submitButton.disabled = false;
        }
    });
});
