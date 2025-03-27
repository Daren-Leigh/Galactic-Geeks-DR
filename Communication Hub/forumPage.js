import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// ✅ Supabase Initialization
const supabaseUrl = "https://fsjyzxygoyuxetzkpolo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzanl6eHlnb3l1eGV0emtwb2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMDI5MjQsImV4cCI6MjA1Nzc3ODkyNH0.qD8cyG3ZxAieUdFU05NOI661JGTv7lA5NIyoTTJCL6k";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ✅ Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", async () => {
    console.log("✅ DOM Loaded - Initializing Elements...");

    // 🔍 Get Elements
    const forumList = document.getElementById("forum-list");
    const createForumBtn = document.getElementById("create-forum-btn");
    const createForumPopup = document.getElementById("create-forum-popup");
    const forumTitleInput = document.getElementById("forum-title");
    const submitForumBtn = document.getElementById("submit-forum-btn");
    const closePopupBtn = document.getElementById("close-popup-btn");

    // ✅ Ensure Elements Exist
    if (!forumList || !createForumBtn || !createForumPopup || !forumTitleInput || !submitForumBtn || !closePopupBtn) {
        console.error("❌ Missing elements! Check your HTML.");
        return;
    }

    // ✅ Fetch and Display Forums
    async function loadForums() {
        console.log("🔄 Loading forums...");
        const { data, error } = await supabase.from("forums").select("forum_id, title");

        if (error) {
            console.error("❌ Error fetching forums:", error.message);
            return;
        }

        forumList.innerHTML = ""; // Clear before appending

        if (!data || data.length === 0) {
            forumList.innerHTML = "<p>No forums available. Create one!</p>";
            return;
        }

        data.forEach((forum) => {
            const forumCard = document.createElement("div");
            forumCard.classList.add("forum-card");
            forumCard.innerHTML = `<h2>${forum.title}</h2>`;

            forumCard.onclick = () => {
                console.log(`📢 Forum Clicked: ${forum.title} (ID: ${forum.forum_id})`);
                window.location.href = `chatroomPage.html?forum_id=${forum.forum_id}`;
            };

            forumList.appendChild(forumCard);
        });

        console.log("✅ Forums loaded successfully.");
    }

    // ✅ Open and Close Forum Creation Popup
    createForumBtn.addEventListener("click", () => {
        console.log("🆕 Create Forum button clicked");
        createForumPopup.classList.remove("hidden");
        forumTitleInput.focus();
    });

    closePopupBtn.addEventListener("click", () => {
        console.log("❌ Closing popup");
        createForumPopup.classList.add("hidden");
    });

    // ✅ Handle New Forum Creation
    submitForumBtn.addEventListener("click", async () => {
        const title = forumTitleInput.value.trim();
        if (!title) {
            alert("⚠️ Forum title cannot be empty!");
            return;
        }

        console.log(`📝 Creating forum: ${title}`);

        const { error } = await supabase.from("forums").insert([{ title }]);

        if (error) {
            console.error("❌ Error creating forum:", error.message);
            alert("Failed to create forum. Try again.");
            return;
        }

        alert("✅ Forum created successfully!");
        forumTitleInput.value = ""; // Clear input field
        createForumPopup.classList.add("hidden"); // Hide popup
        loadForums(); // Reload forums
    });

    // ✅ Load forums on page load
    await loadForums();
});
