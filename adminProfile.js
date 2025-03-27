document.addEventListener('DOMContentLoaded', function() {
    // Left Panel Buttons
    document.getElementById('admin-account-btn').addEventListener('click', function() {
        alert('Admin Account section opened.');
        // Add logic to load Admin Account content in the right panel
    });

    document.getElementById('manage-users-btn').addEventListener('click', function() {
        alert('Manage Users section opened.');
        // Add logic to load Manage Users content in the right panel
    });

    document.getElementById('analytics-btn').addEventListener('click', function() {
        alert('Analytics section opened.');
        // Add logic to load Analytics content in the right panel
    });

    document.getElementById('settings-btn').addEventListener('click', function() {
        alert('Settings section opened.');
        // Add logic to load Settings content in the right panel
    });

    document.getElementById('logout-btn').addEventListener('click', function() {
        alert('Logout clicked.');
        // Add logout logic (e.g., redirect to login page)
    });

    // Right Panel Buttons (Admin Settings)
    document.getElementById('cancel-btn').addEventListener('click', function() {
        alert('Changes canceled.');
        // Add logic to revert changes or clear form fields
    });

    document.getElementById('save-btn').addEventListener('click', function() {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const address = document.getElementById('address').value;

        alert('Changes saved:\n' +
              `First Name: ${firstName}\n` +
              `Last Name: ${lastName}\n` +
              `Email: ${email}\n` +
              `Phone Number: ${phoneNumber}\n` +
              `Address: ${address}`);

        // Add logic to save the form data (e.g., send to server)
    });
});