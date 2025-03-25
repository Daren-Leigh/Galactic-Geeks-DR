import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://fsjyzxygoyuxetzkpolo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzanl6eHlnb3l1eGV0emtwb2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMDI5MjQsImV4cCI6MjA1Nzc3ODkyNH0.qD8cyG3ZxAieUdFU05NOI661JGTv7lA5NIyoTTJCL6k";

// ✅ Initialize Supabase Client
const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log("Supabase initialized:", supabase);

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
        console.log("User logged in successfully:", data);
        console.log("User token:", data.session.access_token);

        // ✅ Fetch user role from Supabase
        const userId = data.user.id;
        const { data: userRoleData, error: roleError } = await supabase
            .from("users")  // Replace with your actual table name
            .select("role") // Ensure your database has a "role" column
            .eq("id", userId)
            .single();

        if (roleError) {
            console.error("Error fetching user role:", roleError);
            showMessage("Error fetching user role. Please try again.", "error");
            return;
        }

        console.log("User role:", userRoleData.role);

        // ✅ Redirect based on role
        if (userRoleData.role === "admin") {
            window.location.href = "https://studylocker-gg.netlify.app/adminDashboard";
        } else {
            window.location.href = "https://studylocker-gg.netlify.app/userDashboard";
        }
    }
}

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
        console.log("OTP verified successfully:", data);

        // ✅ Fetch user role from Supabase
        const userId = data.user.id;
        const { data: userRoleData, error: roleError } = await supabase
            .from("users")  
            .select("role") 
            .eq("id", userId)
            .single();

        if (roleError) {
            console.error("Error fetching user role:", roleError);
            showMessage("Error fetching user role. Please try again.", "error");
            return;
        }

        console.log("User role:", userRoleData.role);

        if (userRoleData.role === "admin") {
            window.location.href = "https://studylocker-gg.netlify.app/adminDashboard";
        } else {
            window.location.href = "https://studylocker-gg.netlify.app/userDashboard";
        }
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

// ✅ Attach event listeners after DOM is loaded
document.getElementById("login-btn").addEventListener("click", loginUser);
document.getElementById("otp-btn").addEventListener("click", verifyOtp);
