
"use strict";

// ========================================
// 1. DOM CONTENT LOADED
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    setCurrentYear();
    initializeMobileNavigation();
    initializeAlerts();
    initializeFormValidation();
    initializeLogin();
});


// ========================================
// 2. SET CURRENT YEAR
// ========================================

function setCurrentYear() {
    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}


// ========================================
// 3. INITIALIZE ALERTS
// ========================================

function initializeAlerts() {
    const closeButtons = document.querySelectorAll(
        ".alert-close, [data-dismiss-alert]"
    );

    closeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const alert = button.closest(".alert");

            if (alert) {
                alert.remove();
            }
        });
    });
}


// ========================================
// 4. FORM VALIDATION
// ========================================

function initializeFormValidation() {
    const forms = document.querySelectorAll("form[data-validate]");

    forms.forEach((form) => {

        form.addEventListener("submit", (event) => {
            let isValid = true;

            const fields = form.querySelectorAll(
                "input[required], textarea[required], select[required]"
            );

            fields.forEach((field) => {
                field.classList.remove("is-invalid");

                const value = field.value.trim();

                if (!value) {
                    isValid = false;
                    field.classList.add("is-invalid");
                    return;
                }

                // Email validation
                if (
                    field.type === "email" &&
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                ) {
                    isValid = false;
                    field.classList.add("is-invalid");
                }

                // Password length validation
                if (
                    field.type === "password" &&
                    field.minLength > 0 &&
                    field.value.length < field.minLength
                ) {
                    isValid = false;
                    field.classList.add("is-invalid");
                }
            });

            if (!isValid) {
                event.preventDefault();

                const firstInvalidField =
                    form.querySelector(".is-invalid");

                if (firstInvalidField) {
                    firstInvalidField.focus();
                }
            }
        });

        // Remove validation styling when corrected
        form.querySelectorAll("input, textarea, select").forEach((field) => {

            field.addEventListener("input", () => {
                field.classList.remove("is-invalid");
            });

            field.addEventListener("change", () => {
                field.classList.remove("is-invalid");
            });

        });
    });
}


// ========================================
// 5. MOBILE NAVIGATION
// ========================================

function initializeMobileNavigation() {
    const menuToggle = document.querySelector(
        ".nav-toggle, .menu-toggle, [data-menu-toggle]"
    );

    const navigation = document.querySelector(
        ".nav-menu, .navbar-menu, [data-navigation]"
    );

    if (!menuToggle || !navigation) {
        return;
    }

    menuToggle.addEventListener("click", () => {

        const isExpanded =
            menuToggle.getAttribute("aria-expanded") === "true";

        menuToggle.setAttribute(
            "aria-expanded",
            String(!isExpanded)
        );

        navigation.classList.toggle("active");
        navigation.classList.toggle("show");

    });

    // Close mobile navigation after selecting a link
    navigation.querySelectorAll("a").forEach((link) => {

        link.addEventListener("click", () => {
            navigation.classList.remove("active", "show");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );
        });

    });
}


// ========================================
// 6. LOGIN HANDLER
// ========================================

function initializeLogin() {

    const loginForm = document.getElementById("login-form");

    // Only execute on the login page
    if (!loginForm) {
        return;
    }

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const message = document.getElementById("login-message");

        const submitButton = loginForm.querySelector(
            'button[type="submit"], input[type="submit"]'
        );

        if (!emailInput || !passwordInput || !message) {
            console.error("Login form elements are missing.");
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Clear previous messages
        message.textContent = "";
        message.classList.remove("hidden", "success", "error");

        if (!email || !password) {
            message.textContent =
                "Please enter your email and password.";

            message.classList.add("error");
            return;
        }

        try {

            if (submitButton) {
                submitButton.disabled = true;
            }

            message.textContent = "Logging in...";
            message.classList.remove("hidden");
            
            // Send login request to backend
            const response = await fetch("/api/auth/login", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            // Handle unsuccessful login
            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Login failed. Please try again."
                );
            }

            // Validate backend response
            if (!data.token || !data.user || !data.user.role) {
                throw new Error(
                    "Invalid login response from server."
                );
            }

            // Validate account role
            if (!["student", "staff"].includes(data.user.role)) {
                throw new Error("Unrecognized account role.");
            }

            // Store JWT token
            sessionStorage.setItem(
                "campuscare_token",
                data.token
            );

            // Store user information
            sessionStorage.setItem(
                "campuscare_user",
                JSON.stringify(data.user)
            );

            message.textContent =
                "Login successful! Redirecting...";

            message.classList.add("success");

            // Redirect based on account role
            if (data.user.role === "student") {

                window.location.href = "/student-dashboard.html";

            } else if (data.user.role === "staff") {

                window.location.href = "/staff-dashboard.html";

            }

        } catch (error) {

            console.error("Login error:", error);

            message.textContent =
                error.message || "Unable to log in. Please try again.";

            message.classList.remove("success");
            message.classList.add("error");

            if (submitButton) {
                submitButton.disabled = false;
            }

        }

    });
}


// ========================================
// 7. HTML ESCAPE FUNCTION
// ========================================

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, (character) => {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];

    });

}
