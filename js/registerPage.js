const supabaseUrl = "https://fsjyzxygoyuxetzkpolo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzanl6eHlnb3l1eGV0emtwb2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMDI5MjQsImV4cCI6MjA1Nzc3ODkyNH0.qD8cyG3ZxAieUdFU05NOI661JGTv7lA5NIyoTTJCL6k";
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

async function registerUser() {
    const name = document.getElementById("name").value;
    const surname = document.getElementById("surname").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (!name || !surname || !username || !email || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
    }
    
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const { data, error } = await supabase.auth.signUp(
        { email, password },
        { redirectTo: "loginPage.html" }
    );

    if (error) {
        alert("Registration failed: " + error.message);
    } else {
        alert("Check your email to verify your account!");
        await supabase.from("users").insert([
            { name, surname, username, email, role: "user" }
        ]);
        window.location.href = "loginPage.html";
    }
}
