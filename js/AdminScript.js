// Import necessary libraries
import { createClient } from '@supabase/supabase-js';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import Chart from 'chart.js/auto';

// Supabase configuration
const SUPABASE_URL = 'https://fsjyzxygoyuxetzkpolo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzanl6eHlnb3l1eGV0emtwb2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMDI5MjQsImV4cCI6MjA1Nzc3ODkyNH0.qD8cyG3ZxAieUdFU05NOI661JGTv7lA5NIyoTTJCL6k'; // Replace with actual key
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Initialize Apollo GraphQL Client
const apolloClient = new ApolloClient({
    uri: `${SUPABASE_URL}/graphql/v1`,
    cache: new InMemoryCache(),
    headers: { Authorization: `Bearer ${SUPABASE_KEY}` },
});

const historyData = {
    deletedResources: [],
    savedResources: []
  };

  // Select elements
  const historyButton = document.getElementById('historyButton');
  const historyPopup = document.getElementById('historyPopup');
  const closePopupButton = document.getElementById('closePopup');
  const deletedResourcesList = document.getElementById('deletedResources');
  const savedResourcesList = document.getElementById('savedResources');

  // Open popup
  historyButton.addEventListener('click', () => {
    updateHistoryList();
    historyPopup.classList.remove('hidden');
  });

  // Close popup
  closePopupButton.addEventListener('click', () => {
    historyPopup.classList.add('hidden');
  });

  // Function to update the history list
  function updateHistoryList() {
    // Clear the existing lists
    deletedResourcesList.innerHTML = '';
    savedResourcesList.innerHTML = '';

    // Populate Deleted Resources
    historyData.deletedResources.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.resourceName} - ${item.dateTime}`;
      deletedResourcesList.appendChild(li);
    });

    // Populate Saved Resources
    historyData.savedResources.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.resourceName} - ${item.dateTime}`;
      savedResourcesList.appendChild(li);
    });
  }

// script.js
document.getElementById('searchButton').addEventListener('click', function () {
    const searchTerm = document.getElementById('searchInput').value.trim();

    if (searchTerm) {
      document.getElementById('result').textContent = `You searched for: "${searchTerm}"`;
    } else {
      document.getElementById('result').textContent = 'Please enter a search term.';
    }
  });


// Handle form submission
document
.getElementById("save-btn")
.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent default form submission behavior

  try {
    // Insert the resource name into your Supabase table
    const { data, error } = await supabase
      .from("ResourceTable") // Replace "resources" with your table name
      .insert([{ name: resourceName },{ details: resourceDetails },{ details: additionalDetails },{ ID: requestResourceID}]); // Adjust the column name if necessary

    if (error) throw error;

    // Success message or action
    alert("Resource saved successfully!");
    console.log("Saved resource:", data);

    // Optionally, reset the form
    document.getElementById("save-btn").reset();
  } catch (err) {
    console.error("Error saving resource:", err.message);
    alert("Failed to save resource.");
  }
});
// Add a click event listener to the "Load Resources" button
document
.getElementById("load-resources-btn")
.addEventListener("click", async () => {
  try {
    // Fetch all data from the "resources" table
    const { data, error } = await supabase
      .from("resources") // Replace with your table name
      .select("*"); // Retrieve all columns (use specific columns if needed)

    if (error) throw error;

    // Display resources in the <ul> list
    const resourcesList = document.getElementById("resources-list");
    resourcesList.innerHTML = ""; // Clear the list before appending the new data

    data.forEach((resource) => {
      const listItem = document.createElement("li");
      listItem.textContent = resource.name; // Adjust column name to match your table
      listItem.style.padding = "8px 0";
      resourcesList.appendChild(listItem);
    });

    if (data.length === 0) {
      alert("No resources found!");
    } else {
      alert("Resources loaded successfully!");
    }
  } catch (err) {
    console.error("Error retrieving resources:", err.message);
    alert("Failed to load resources. Check the console for details.");
  }
});
// GraphQL query to fetch resource usage and request statistics
const GET_RESOURCE_STATS = gql`
    query GetResourceStats {
        Resource_Table { Resource_Name Usage_Count }
        Request_Table { Status }
    }
`;

// Fetch and display resource statistics
async function fetchGraphData() {
    try {
        const { data } = await apolloClient.query({ query: GET_RESOURCE_STATS });
        if (data) createBarGraph(data.Resource_Table, data.Request_Table);
    } catch (error) {
        console.error('Error fetching GraphQL data:', error);
    }
}

// Create bar graph using Chart.js
function createBarGraph(resources, requests) {
    const ctx = document.getElementById('resourceChart').getContext('2d');
    const resourceNames = resources.map(res => res.Resource_Name);
    const resourceUsage = resources.map(res => res.Usage_Count);
    const statusCounts = {
        accepted: requests.filter(req => req.Status === 'Accepted').length,
        rejected: requests.filter(req => req.Status === 'Rejected').length,
    };

    // Update statistics
    updateStatistics(statusCounts, resourceUsage);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [...resourceNames, 'Accepted Requests', 'Rejected Requests'],
            datasets: [{
                label: 'Resource Usage & Request Status',
                data: [...resourceUsage, statusCounts.accepted, statusCounts.rejected],
                backgroundColor: ['blue', 'green', 'red'],
            }],
        },
    });
}

// Update statistics on the page
function updateStatistics(statusCounts, resourceUsage) {
    document.getElementById('acceptedCount').textContent = statusCounts.accepted;
    document.getElementById('rejectedCount').textContent = statusCounts.rejected;
    document.getElementById('resourceUsageCount').textContent = resourceUsage.reduce((a, b) => a + b, 0); // Sum of all usage counts
}

// Fetch and display notifications
async function fetchNotifications() {
    const { data, error } = await supabase.from('Notification Table').select('*');
    if (error) {
        console.error('Error fetching notifications:', error);
    } else {
        displayNotifications(data);
    }
}

function displayNotifications(notifications) {
    const container = document.getElementById('notificationContainer');
    container.innerHTML = notifications.map(n => `<div class='notification'><p>${n.message}</p></div>`).join('');
}

// Function to generate unique Request Resource ID
function generateRequestID() {
    return 'REQ-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Function to handle the addResource modal popup
function addResource() {
    const modal = document.getElementById("addResourceModal");
    modal.style.display = "block";

    document.querySelector(".close").onclick = function() {
        modal.style.display = "none";
    };

    document.getElementById("addResourceForm").onsubmit = async function(event) {
        event.preventDefault();
        const resourceName = document.getElementById("resourceName").value;
        const resourceDetails = document.getElementById("resourceDetails").value;
        const additionalDetails = document.getElementById("additionalDetails").value;
        const requestResourceID = generateRequestID();

        // Handle PDF upload
        const pdfFile = document.getElementById("pdfUpload").files[0];
        if (pdfFile && pdfFile.type !== 'application/pdf') {
            alert("Please upload a PDF file.");
            return;
        }

        // Upload PDF to Supabase storage if valid
        let pdfUrl = "";
        if (pdfFile) {
            const { data, error } = await supabase.storage.from('pdf-bucket').upload(pdfFile.name, pdfFile);
            if (error) {
                alert("Error uploading PDF: " + error.message);
                return;
            }
            pdfUrl = data?.path;
        }

        // Insert resource into the database
        const { error } = await supabase.from('Resource Table').insert([{
            'Resource Name': resourceName,
            'Resource Details': resourceDetails,
            'Additional Resource Details': additionalDetails,
            'Request Resource ID': requestResourceID,
            'PDF URL': pdfUrl
        }]);

        if (error) {
            console.error('Error adding resource:', error);
        } else {
            fetchResources();
            modal.style.display = "none";
        }
    };
}

// Function to fetch and display resources
async function fetchResources() {
    let { data, error } = await supabase.from('Resource Table').select('*');
    if (error) {
        console.error('Error fetching resources:', error);
    } else {
        displayResources(data);
    }
}

// Function to display resources in a table
function displayResources(resources) {
    const container = document.getElementById('resourceContainer');
    container.innerHTML = '';
    resources.forEach(resource => {
        const row = document.createElement('div');
        row.classList.add('resource-row');
        row.innerHTML = `
            <div>${resource['Resource Name']}</div>
            <div>${resource['Resource Details']}</div>
            <div>${resource['Additional Resource Details']}</div>
            <div>${resource['Request Resource ID']}</div>
            <div><a href="${resource['PDF URL']}" target="_blank">View PDF</a></div>
            <div><button onclick="deleteResource('${resource['Request Resource ID']}')">Delete</button></div>
        `;
        container.appendChild(row);
    });
    document.getElementById("resourceTable").style.display = "block";
}

// Function to delete a resource
async function deleteResource(requestResourceID) {
    const { error } = await supabase.from('Resource Table').delete().eq('Request Resource ID', requestResourceID);
    if (error) {
        console.error('Error deleting resource:', error);
    } else {
        fetchResources();
    }
}

// Notification button click handler
document.querySelector("button[onclick='alert(\'Notification Button clicked!\')']").addEventListener('click', () => {
    fetchNotifications();
});

// Fetch notifications
async function fetchNotifications() {
    const { data, error } = await supabase.from('Notification Table').select('*');
    if (error) {
        console.error('Error fetching notifications:', error);
    } else {
        alert('New notifications: ' + JSON.stringify(data));
    }
}

// Fetch and display requests
async function fetchRequests() {
    let { data, error } = await supabase.from('Request Table').select('*');
    if (error) {
        console.error('Error fetching requests:', error);
    } else {
        displayRequests(data);
    }
}

// Function to display requests in a table
function displayRequests(requests) {
    const container = document.getElementById('requestContainer');
    container.innerHTML = requests.map(r => `<div class='request'><p>${r['Request Message']}</p></div>`).join('');
}

// Fetch all data on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchGraphData();
    fetchNotifications();
    fetchResources();
    fetchRequests();
});

// Sorting functions
window.sortResources = function () {
    const container = document.getElementById('resourceContainer');
    Array.from(container.children)
        .sort((a, b) => a.textContent.localeCompare(b.textContent))
        .forEach(el => container.appendChild(el));
};

window.sortRequests = function () {
    const container = document.getElementById('requestContainer');
    Array.from(container.children)
        .sort((a, b) => a.textContent.localeCompare(b.textContent))
        .forEach(el => container.appendChild(el));
};
