const supabaseUrl = "https://fsjyzxygoyuxetzkpolo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzanl6eHlnb3l1eGV0emtwb2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMDI5MjQsImV4cCI6MjA1Nzc3ODkyNH0.qD8cyG3ZxAieUdFU05NOI661JGTv7lA5NIyoTTJCL6k";
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

async function loginUser() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        alert("Login failed: " + error.message);
    } else {
        fetchUserRole(data.user.id);
    }
}

async function verifyOtp() {
    const phone = document.getElementById("login-phone").value;
    const otp = document.getElementById("login-otp").value;

    const { data, error } = await supabase.auth.verifyOtp({ phone, token: otp, type: "sms" });
    if (error) {
        alert("OTP verification failed: " + error.message);
    } else {
        fetchUserRole(data.user.id);
    }
}

async function fetchUserRole(userId) {
    const { data, error } = await supabase.from("users").select("role").eq("id", userId).single();
    if (error) {
        alert("Error fetching role: " + error.message);
    } else {
        window.location.href = data.role === "admin" ? "admin-dashboard.html" : "user-dashboard.html";
    }
}
