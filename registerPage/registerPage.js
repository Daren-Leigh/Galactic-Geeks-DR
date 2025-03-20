// ✅ Wait for DOM to load before initializing Supabase
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded, initializing Supabase...");

    // ✅ Supabase Credentials
    const supabaseUrl = "https://fsjyzxygoyuxetzkpolo.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzanl6eHlnb3l1eGV0emtwb2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMDI5MjQsImV4cCI6MjA1Nzc3ODkyNH0.qD8cyG3ZxAieUdFU05NOI661JGTv7lA5NIyoTTJCL6k";

    // ✅ Initialize Supabase AFTER ensuring it is available
    const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
    console.log("Supabase initialized:", supabase);

    async function registerUser() {
        const name = document.getElementById("name").value.trim();
        const surname = document.getElementById("surname").value.trim();
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        // ✅ Error Handling: Check if fields are empty
        if (!name || !surname || !username || !email || !password || !confirmPassword) {
            showMessage("Please fill in all fields.", "error");
            return;
        }

        // ✅ Error Handling: Check if passwords match
        if (password !== confirmPassword) {
            showMessage("Passwords do not match.", "error");
            return;
        }

        try {
            // ✅ Supabase Email Authentication
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: { name, surname, username },
                    emailRedirectTo: "http://127.0.0.1:5500/loginPage.html"
                }
            });

            if (error) throw error;

            // ✅ Success Message
            showMessage("Registration successful! Check your email to verify your account.", "success");

        } catch (err) {
            showMessage(`Error: ${err.message}`, "error");
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

    // ✅ Attach function to button
    document.querySelector("button").addEventListener("click", registerUser);
});
