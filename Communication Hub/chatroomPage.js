import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// ✅ Supabase Initialization
const supabaseUrl = "https://fsjyzxygoyuxetzkpolo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzanl6eHlnb3l1eGV0emtwb2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMDI5MjQsImV4cCI6MjA1Nzc3ODkyNH0.qD8cyG3ZxAieUdFU05NOI661JGTv7lA5NIyoTTJCL6k";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Get the forum_id from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const forum_id = urlParams.get("forum_id");

document.addEventListener("DOMContentLoaded", async () => {
    const messagesList = document.getElementById("chat-messages");  
    const messageInput = document.getElementById("message-input");

    let currentUsername = "User"; // Default if not found

    // ✅ Fetch the authenticated user's username
    async function fetchUsername() {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            console.error("❌ Error fetching authenticated user:", error?.message || "No user session");
            return;
        }

        console.log("✅ User ID:", user.id); // Debugging: Check if user ID exists

        const { data, error: userError } = await supabase
            .from("profiles")  // Make sure "profiles" table exists
            .select("username")
            .eq("id", user.id)  // Make sure the column is named "id"
            .single();

        if (userError) {
            console.error("❌ Error fetching username:", userError.message);
        } else {
            currentUsername = data?.username || "User";
            console.log("✅ Logged in as:", currentUsername); // Debugging: Check if username is fetched
        }
    }

    // ✅ Load chat messages
    async function loadChatMessages() {
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("forum_id", forum_id)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("❌ Error fetching messages:", error.message);
            return;
        }

        messagesList.innerHTML = ""; // Clear previous messages

        data.forEach((message) => {
            const messageItem = document.createElement("div");
            messageItem.classList.add("message");
            messageItem.innerHTML = `
                <strong>${message.username}</strong>: ${message.content}
            `;
            messagesList.appendChild(messageItem);
        });
    }

    // ✅ Real-time message subscription
    function subscribeToNewMessages() {
        supabase
            .channel("chat-room-" + forum_id)
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, payload => {
                console.log("New message inserted:", payload.new);
                loadChatMessages();
            })
            .subscribe();
    }

    // ✅ Send a message with the actual username
    async function sendMessage() {
        const content = messageInput.value.trim();
        if (!content) return;

        console.log("🔹 Sending message as:", currentUsername); // Debugging

        const { error } = await supabase
            .from("messages")
            .insert([{ forum_id, username: currentUsername, content }]);

        if (error) {
            console.error("❌ Error sending message:", error.message);
        } else {
            messageInput.value = ""; // Clear input after sending
            loadChatMessages();
        }
    }

    // ✅ Back button functionality
function goBack() {
    window.location.href = "forumPage.html"; // Replace with your actual forum page URL
}


    // ✅ Fetch username, load messages, and set up real-time subscription
    await fetchUsername();
    loadChatMessages();
    subscribeToNewMessages();

    // ✅ Attach event listener for sending messages
    document.getElementById("send-button").onclick = sendMessage;

    // ✅ Attach event listener for back button
    document.getElementById("back-button").onclick = goBack;
});
