// Import Supabase client
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = 'https://fsjyzxygoyuxetzkpolo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzanl6eHlnb3l1eGV0emtwb2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMDI5MjQsImV4cCI6MjA1Nzc3ODkyNH0.qD8cyG3ZxAieUdFU05NOI661JGTv7lA5NIyoTTJCL6k'; // Replace with your actual key
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Fetch notifications
async function fetchNotifications() {
    let { data, error } = await supabase.from('Notification Table').select('*');
    if (error) {
        console.error('Error fetching notifications:', error);
        return;
    }
    displayNotifications(data);
}

// Display notifications in the UI
function displayNotifications(notifications) {
    const container = document.getElementById('notificationContainer');
    container.innerHTML = '';
    notifications.forEach(notification => {
        const div = document.createElement('div');
        div.className = 'notification';
        div.innerHTML = `<p>${notification.message}</p>`;
        container.appendChild(div);
    });
}

// Fetch resource data
async function fetchResources() {
    let { data, error } = await supabase.from('Resource Table').select('*');
    if (error) {
        console.error('Error fetching resources:', error);
        return;
    }
    displayResources(data);
}

// Display resources in the UI
function displayResources(resources) {
    const container = document.getElementById('resourceContainer');
    container.innerHTML = '';
    resources.forEach(resource => {
        const div = document.createElement('div');
        div.className = 'resource';
        div.innerHTML = `
            <h3>${resource['Resource Name']}</h3>
            <p>${resource['Resource Description']}</p>
        `;
        container.appendChild(div);
    });
}

// Add a new resource
async function addResource() {
    const name = document.getElementById('resourceName').value;
    const description = document.getElementById('resourceDescription').value;
    if (!name || !description) {
        alert('Please fill in all fields');
        return;
    }
    let { error } = await supabase.from('Resource Table').insert([
        { 'Resource Name': name, 'Resource Description': description }
    ]);
    if (error) {
        console.error('Error adding resource:', error);
        return;
    }
    fetchResources();
}

// Fetch user requests
async function fetchRequests() {
    let { data, error } = await supabase.from('Request Table').select('*');
    if (error) {
        console.error('Error fetching requests:', error);
        return;
    }
    displayRequests(data);
}

// Display user requests in the UI
function displayRequests(requests) {
    const container = document.getElementById('requestContainer');
    container.innerHTML = '';
    requests.forEach(request => {
        const div = document.createElement('div');
        div.className = 'request';
        div.innerHTML = `<p>${request['Request Message']}</p>`;
        container.appendChild(div);
    });
}

// Fetch data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchNotifications();
    fetchResources();
    fetchRequests();
});

// Modal and PDF Handling
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("addResourceModal");
    const closeModalBtn = document.querySelector(".close");
    const pdfUploadInput = document.getElementById("pdfUpload");
    const pdfActionsDiv = document.getElementById("pdfActions");
    const viewPdfBtn = document.getElementById("viewPdfBtn");
    const deletePdfBtn = document.getElementById("deletePdfBtn");
    let uploadedPdf = null;

    window.addResource = function () {
        modal.style.display = "block";
    };

    closeModalBtn.addEventListener("click", () => {
        modal.style.display = "none";
        resetForm();
    });

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
            resetForm();
        }
    };

    pdfUploadInput.addEventListener("change", () => {
        const file = pdfUploadInput.files[0];
        if (file && file.type === "application/pdf") {
            uploadedPdf = URL.createObjectURL(file);
            pdfActionsDiv.style.display = "block";
        } else {
            alert("Please upload a valid PDF file.");
            pdfUploadInput.value = "";
            pdfActionsDiv.style.display = "none";
        }
    });

    viewPdfBtn.addEventListener("click", () => {
        if (uploadedPdf) {
            window.open(uploadedPdf, "_blank");
        } else {
            alert("No PDF uploaded.");
        }
    });

    deletePdfBtn.addEventListener("click", () => {
        uploadedPdf = null;
        pdfUploadInput.value = "";
        pdfActionsDiv.style.display = "none";
        alert("PDF deleted.");
    });

    function resetForm() {
        document.getElementById("addResourceForm").reset();
        uploadedPdf = null;
        pdfActionsDiv.style.display = "none";
    }
});

// Sorting functions
window.sortResources = function () {
    const container = document.getElementById('resourceContainer');
    const resources = Array.from(container.children);
    resources.sort((a, b) => a.textContent.localeCompare(b.textContent));
    container.innerHTML = '';
    resources.forEach(resource => container.appendChild(resource));
};

window.sortRequests = function () {
    const container = document.getElementById('requestContainer');
    const requests = Array.from(container.children);
    requests.sort((a, b) => a.textContent.localeCompare(b.textContent));
    container.innerHTML = '';
    requests.forEach(request => container.appendChild(request));
};
