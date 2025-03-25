import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// ✅ Supabase Initialization
const supabaseUrl = "https://fsjyzxygoyuxetzkpolo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzanl6eHlnb3l1eGV0emtwb2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMDI5MjQsImV4cCI6MjA1Nzc3ODkyNH0.qD8cyG3ZxAieUdFU05NOI661JGTv7lA5NIyoTTJCL6k";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const forumList = document.getElementById("forum-list");

// ✅ Fetch and Display Forums
async function loadForums() {
    const { data, error } = await supabase.from("forums").select("forum_id, title"); // Use correct forum_id field

    if (error) {
        console.error("❌ Error fetching forums:", error.message);
        return;
    }

    // Debugging: Log the fetched data to check for forum IDs
    console.log("Fetched Forums:", data);

    forumList.innerHTML = ""; // Clear before appending

    if (data.length === 0) {
        console.warn("⚠️ No forums found.");
        return;
    }

    // Iterate over each forum and create a card
    data.forEach((forum) => {
        console.log("Forum object:", forum); // Log the full forum object

        const forumCard = document.createElement("div");
        forumCard.classList.add("forum-card");
        forumCard.innerHTML = `<h2>${forum.title}</h2>`;

        forumCard.onclick = () => {
            // Log the forum id when clicked
            console.log(`📢 Forum Clicked: ${forum.title} (ID: ${forum.forum_id})`);

            if (forum.forum_id && typeof forum.forum_id === "string") {
                const forumURL = `chatroomPage.html?forum_id=${forum.forum_id}`;
                console.log(`🔗 Redirecting to: ${forumURL}`);

                // For debugging purposes, show an alert (remove in production)
                alert(`Redirecting to Chatroom with forum ID: ${forum.forum_id}`);

                window.location.href = forumURL;
            } else {
                console.error("❌ Forum ID is missing or not a valid UUID string. Cannot redirect.");
            }
        };

        forumList.appendChild(forumCard);
    });
}

// ✅ Load forums on page load
loadForums();
