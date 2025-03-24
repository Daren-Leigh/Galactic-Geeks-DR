document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded, initializing Supabase...");

    // ✅ Ensure Supabase is available before using it
    if (typeof supabase === "undefined") {
        console.error("Supabase is not loaded.");
        return;
    }

    // ✅ Supabase Credentials
    const supabaseUrl = "https://fsjyzxygoyuxetzkpolo.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzanl6eHlnb3l1eGV0emtwb2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMDI5MjQsImV4cCI6MjA1Nzc3ODkyNH0.qD8cyG3ZxAieUdFU05NOI661JGTv7lA5NIyoTTJCL6k";

    // ✅ Initialize Supabase AFTER ensuring it's loaded
    window.supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);
    console.log("Supabase initialized:", window.supabaseClient);

    // ✅ Function to Send Verification Email
    async function sendVerificationEmail(email) {
        try {
            const { error } = await window.supabaseClient.auth.resend({
                type: "signup",
                email: email
            });

            if (error) throw error;

            showMessage("Verification email sent! Check your inbox.", "success");

        } catch (err) {
            showMessage(`Error sending verification email: ${err.message}`, "error");
        }
    }

    // ✅ Function to Register User
    async function registerUser() {
        const name = document.getElementById("name").value.trim();
        const surname = document.getElementById("surname").value.trim();
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (!name || !surname || !username || !email || !password || !confirmPassword) {
            showMessage("Please fill in all fields.", "error");
            return;
        }

        if (password !== confirmPassword) {
            showMessage("Passwords do not match.", "error");
            return;
        }

        try {
            // ✅ Step 1: Register the user in Supabase Auth
            const { data, error } = await window.supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: { name, surname, username },
                    emailRedirectTo: "https://studylocker-gg.netlify.app/loginPage/loginPage"
                }
            });

            if (error) throw error;

            const user = data.user;
            if (!user) {
                throw new Error("User registration failed.");
            }

            console.log("User registered, inserting into UserTable...", user.id);

            // ✅ Step 2: Insert User Data into Custom `UserTable`
            const { error: insertError } = await window.supabaseClient
                .from("UserTable") // Your custom table
                .insert([{ 
                    id: user.id, // Store user ID from auth.users
                    name: name,
                    surname: surname,
                    username: username,
                    email: email,
                    //created_at: new Date()
                }]);

            if (insertError) throw insertError;

            // ✅ Step 3: Send Verification Email
            await sendVerificationEmail(email);

            showMessage("Registration successful! Check your email to verify your account.", "success");

        } catch (err) {
            showMessage(`Error: ${err.message}`, "error");
        }
    }

    // ✅ Function to Show Messages
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
