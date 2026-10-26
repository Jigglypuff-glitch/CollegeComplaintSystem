
"use strict";

/* =========================================
   CampusCare — Shared frontend JavaScript
   ========================================= */

/**
 * Run code after the HTML document has loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
    setCurrentYear();
    initializeMobileNavigation();
    initializeAlerts();
    initializeFormValidation();
});

/**
 * Automatically update the copyright year.
 */
function setCurrentYear() {
    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Allow dismissible alerts throughout the application.
 *
 * Usage:
 * <div class="alert alert-success" data-dismissible>
 *     Complaint submitted successfully.
 *     <button type="button" data-dismiss-alert aria-label="Dismiss">
 *         ×
 *     </button>
 * </div>
 */
function initializeAlerts() {
    const dismissButtons = document.querySelectorAll("[data-dismiss-alert]");

    dismissButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const alert = button.closest("[data-dismissible]");

            if (alert) {
                alert.remove();
            }
        });
    });
}

/**
 * Basic client-side validation for forms that opt in.
 *
 * Add data-validate to a form to enable it.
 * Server-side validation will still be required.
 */
function initializeFormValidation() {
    const forms = document.querySelectorAll("form[data-validate]");

    forms.forEach((form) => {
        form.addEventListener("submit", (event) => {
            if (!form.checkValidity()) {
                event.preventDefault();
                form.reportValidity();
            }
        });
    });
}

/**
 * Prepare a mobile navigation toggle if a page uses it.
 *
 * Expected HTML:
 * <button type="button"
 *         data-menu-toggle
 *         aria-expanded="false"
 *         aria-controls="mobile-menu">
 *     Menu
 * </button>
 *
 * <nav id="mobile-menu" data-mobile-menu>
 *     ...
 * </nav>
 */
function initializeMobileNavigation() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const menu = document.querySelector("[data-mobile-menu]");

    if (!toggle || !menu) {
        return;
    }

    toggle.addEventListener("click", () => {
        const isExpanded = toggle.getAttribute("aria-expanded") === "true";

        toggle.setAttribute("aria-expanded", String(!isExpanded));
        menu.classList.toggle("hidden", isExpanded);
    });

    menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            toggle.setAttribute("aria-expanded", "false");
            menu.classList.add("hidden");
        });
    });
}

/**
 * Escape text before inserting user-provided values into HTML.
 *
 * Prefer textContent for displaying plain text.
 * This helper is useful when HTML rendering is genuinely needed.
 */
function escapeHTML(value) {
    const characters = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    };

    return String(value).replace(/[&<>"']/g, (character) => {
        return characters[character];
    });
}
