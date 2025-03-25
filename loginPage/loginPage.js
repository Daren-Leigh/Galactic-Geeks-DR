document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded, initializing Supabase...");

    // ✅ Supabase Credentials
    const supabaseUrl = "https://fsjyzxygoyuxetzkpolo.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzanl6eHlnb3l1eGV0emtwb2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMDI5MjQsImV4cCI6MjA1Nzc3ODkyNH0.qD8cyG3ZxAieUdFU05NOI661JGTv7lA5NIyoTTJCL6k";

    // ✅ Initialize Supabase AFTER ensuring it is available
    const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
    console.log("Supabase initialized:", supabase);

    // ✅ Login with Email & Password
    async function loginUser() {
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value;

        if (!email || !password) {
            showMessage("Please fill in both email and password.", "error");
            return;
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            showMessage("Login failed: " + error.message, "error");
        } else {
            // Skip role fetching and directly redirect
            window.location.href = "https://studylocker-gg.netlify.app/userDashboard"; // Or whatever page
        }
    }

    // ✅ Login with OTP
    async function verifyOtp() {
        const phone = document.getElementById("login-phone").value.trim();
        const otp = document.getElementById("login-otp").value.trim();

        if (!phone || !otp) {
            showMessage("Please enter your phone number and OTP.", "error");
            return;
        }

        const { data, error } = await supabase.auth.verifyOtp({ phone, token: otp, type: "sms" });
        if (error) {
            showMessage("OTP verification failed: " + error.message, "error");
        } else {
            // Skip role fetching and directly redirect
            window.location.href = "user-dashboard.html"; // Or whatever page
        }
    }

    // ✅ Function to Display Messages
    function showMessage(msg, type) {
        const messageBox = document.getElementById("message-box");
        messageBox.innerHTML = msg;
        messageBox.className = type;
        messageBox.style.display = "block";

        setTimeout(() => {
            messageBox.style.display = "none";
        }, 4000);
    }

    // ✅ Attach event listeners to buttons
    document.getElementById("login-btn").addEventListener("click", loginUser);
    document.getElementById("otp-btn").addEventListener("click", verifyOtp);
});
