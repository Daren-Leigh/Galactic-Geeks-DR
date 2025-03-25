import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// ✅ Supabase Initialization
const supabaseUrl = "https://fsjyzxygoyuxetzkpolo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzanl6eHlnb3l1eGV0emtwb2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMDI5MjQsImV4cCI6MjA1Nzc3ODkyNH0.qD8cyG3ZxAieUdFU05NOI661JGTv7lA5NIyoTTJCL6k";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Get the forum_id from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const forum_id = urlParams.get("forum_id");

document.addEventListener("DOMContentLoaded", () => {
    const messagesList = document.getElementById("chat-messages");  // Ensure the correct ID
    const messageInput = document.getElementById("message-input");

    // ✅ Real-time subscription setup
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

        // Clear previous messages
        messagesList.innerHTML = "";

        // Append new messages
        data.forEach((message) => {
            const messageItem = document.createElement("div");
            messageItem.classList.add("message");
            messageItem.innerHTML = `
                <strong>${message.username}</strong>: ${message.content}
            `;
            messagesList.appendChild(messageItem);
        });
    }

    // ✅ Real-time channel subscription
    function subscribeToNewMessages() {
        const channel = supabase
            .channel("chat-room-" + forum_id)
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, payload => {
                console.log("New message inserted:", payload.new);
                loadChatMessages();  // Reload messages after new message insert
            })
            .subscribe();
    }

    // ✅ Send a new message
    async function sendMessage() {
        const content = messageInput.value;
        if (!content) return;

        const { error } = await supabase
            .from("messages")
            .insert([{ forum_id, username: "User", content }]); // Replace "User" with actual username logic

        if (error) {
            console.error("❌ Error sending message:", error.message);
        } else {
            messageInput.value = ""; // Clear input after sending
            loadChatMessages(); // Reload messages after sending a new one
        }
    }

    // ✅ Load messages and set up real-time subscription on page load
    loadChatMessages();
    subscribeToNewMessages();

    // ✅ Send message on button click
    document.getElementById("send-button").onclick = sendMessage;  // Ensure this matches the HTML ID
});
