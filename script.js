const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

// Load issues on page load
window.onload = () => {
    if(!localStorage.getItem("loggedIn")) {
        window.location.href = "index.html";
    }
    loadIssues("all", document.querySelector('.tabBtn'));
};