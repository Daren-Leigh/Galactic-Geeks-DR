import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js";

const supabaseUrl = "https://fsjyzxygoyuxetzkpolo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzanl6eHlnb3l1eGV0emtwb2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMDI5MjQsImV4cCI6MjA1Nzc3ODkyNH0.qD8cyG3ZxAieUdFU05NOI661JGTv7lA5NIyoTTJCL6k";  

// ✅ Initialize Supabase Client
const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log("Supabase initialized:", supabase);

async function resetPassword() {
    const password = document.getElementById("new-password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();
    const token = new URLSearchParams(window.location.search).get('token'); // Get token from URL

    if (!password || !confirmPassword) {
        showMessage("Please enter both the new password and confirm password.", "error");
        return;
    }

    if (password !== confirmPassword) {
        showMessage("Passwords do not match.", "error");
        return;
    }

    try {
        // ✅ Supabase function to update password (User must be logged in)
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            showMessage("Error resetting password: " + error.message, "error");
        } else {
            showMessage("Password reset successful! Redirecting...", "success");
            setTimeout(() => {
                window.location.href = "loginPage.html";
            }, 2000);
        }
    } catch (err) {
        showMessage("Unexpected error: " + err.message, "error");
    }
}

function showMessage(msg, type) {
    const messageBox = document.getElementById("message-box");
    messageBox.innerHTML = msg;
    messageBox.className = type;
    messageBox.style.display = "block";

    setTimeout(() => {
        messageBox.style.display = "none";
    }, 4000);
}

// ✅ Attach event listener after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("reset-password-btn").addEventListener("click", resetPassword);
});
