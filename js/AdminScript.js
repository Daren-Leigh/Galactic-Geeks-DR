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

// Fetch and display notifications
async function fetchNotifications() {
    let { data, error } = await supabase.from('Notification Table').select('*');
    if (error) console.error('Error fetching notifications:', error);
    else displayNotifications(data);
}

function displayNotifications(notifications) {
    const container = document.getElementById('notificationContainer');
    container.innerHTML = notifications.map(n => `<div class='notification'><p>${n.message}</p></div>`).join('');
}

// Fetch and display resources
async function fetchResources() {
    let { data, error } = await supabase.from('Resource Table').select('*');
    if (error) console.error('Error fetching resources:', error);
    else displayResources(data);
}

function displayResources(resources) {
    const container = document.getElementById('resourceContainer');
    container.innerHTML = resources.map(r => `<div class='resource'><h3>${r['Resource Name']}</h3><p>${r['Resource Description']}</p></div>`).join('');
}

// Add a new resource
async function addResource() {
    const name = document.getElementById('resourceName').value;
    const description = document.getElementById('resourceDescription').value;
    if (!name || !description) return alert('Please fill in all fields');
    let { error } = await supabase.from('Resource Table').insert([{ 'Resource Name': name, 'Resource Description': description }]);
    if (error) console.error('Error adding resource:', error);
    else fetchResources();
}

// Fetch and display requests
async function fetchRequests() {
    let { data, error } = await supabase.from('Request Table').select('*');
    if (error) console.error('Error fetching requests:', error);
    else displayRequests(data);
}

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
