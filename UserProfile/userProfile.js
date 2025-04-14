// ✅ Supabase Initialization (No import issues)
const supabaseUrl = "https://fsjyzxygoyuxetzkpolo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzanl6eHlnb3l1eGV0emtwb2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMDI5MjQsImV4cCI6MjA1Nzc3ODkyNH0.qD8cyG3ZxAieUdFU05NOI661JGTv7lA5NIyoTTJCL6k"; // Replace with your actual anon key
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

// ✅ Function to load the logged-in user's profile
async function loadUserProfile() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        console.error("User not found or not logged in:", error);
        document.getElementById("profile-email").innerText = "Not logged in";
        return;
    }

    // ✅ Display user details
    document.getElementById("profile-email").innerText = user.email;

    // ✅ Fetch user profile from the database
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .single();

    if (profileError) {
        console.error("Error fetching profile:", profileError);
    } else {
        document.getElementById("name").value = profile.name || "";
    }
}

// ✅ Function to update user profile
async function updateUserProfile() {
    const newName = document.getElementById("name").value.trim();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (!user) {
        alert("You must be logged in to update your profile.");
        return;
    }

    const { error: updateError } = await supabase
        .from("profiles")
        .update({ name: newName })
        .eq("id", user.id);

    if (updateError) {
        alert("Error updating profile: " + updateError.message);
    } else {
        alert("Profile updated successfully!");
    }
}

// ✅ Back to Dashboard button functionality
function goBackToDashboard() {
    window.location.href = "https://studylocker-gg.netlify.app/userdashboard"; // Adjust as needed
}

// ✅ Ensure event listeners are attached when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile(); // Load user details

    const backButton = document.getElementById("back-to-dashboard-btn");
    if (backButton) {
        backButton.addEventListener("click", goBackToDashboard);
    }

    const updateButton = document.getElementById("update-user-btn");
    if (updateButton) {
        updateButton.addEventListener("click", updateUserProfile);
    }
});
