// auth.js

function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if(username === "admin" && password === "admin123") {
        localStorage.setItem("loggedIn", "true");
        window.location.href = "dashboard.html"; // redirect after login
    } else {
        alert("Invalid username or password!");
    }
}

// Protect dashboard page
if (window.location.pathname.endsWith("dashboard.html")) {
    if (localStorage.getItem("loggedIn") !== "true") {
        window.location.href = "index.html";
    }
}