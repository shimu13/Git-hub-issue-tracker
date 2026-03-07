const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

// Load issues on page load
window.onload = () => {
    if(!localStorage.getItem("loggedIn")) {
        window.location.href = "index.html";
    }
    loadIssues("all", document.querySelector('.tabBtn'));
};
// Load issues by type (all/open/closed)
async function loadIssues(type, btn) {
    // Active tab highlight
    document.querySelectorAll('.tabBtn').forEach(b => b.classList.replace('bg-blue-500','bg-gray-300'));
    btn.classList.replace('bg-gray-300','bg-blue-500');

    const loader = document.getElementById("loader");
    loader.classList.remove("hidden");

    const res = await fetch(API);
    let data = await res.json();
    let issues = data.data;

    if(type === "open") issues = issues.filter(issue => issue.status === "open");
    if(type === "closed") issues = issues.filter(issue => issue.status === "closed");

    displayIssues(issues);
    loader.classList.add("hidden");
}
// Display issues in grid
function displayIssues(issues) {
    const container = document.getElementById("issuesContainer");
    container.innerHTML = "";

    issues.forEach(issue => {
        const card = document.createElement("div");
        card.className = `bg-white p-4 rounded shadow cursor-pointer border-t-4
            ${issue.status === "open" ? "border-green-500" : "border-purple-500"}`;
        card.innerHTML = `
            <h2 class="font-bold text-lg">${issue.title}</h2>
            <p class="text-sm text-gray-600">${issue.description}</p>
            <p>Status: ${issue.status}</p>
            <p>Author: ${issue.author}</p>
            <p>Priority: ${issue.priority}</p>
            <p>Label: ${issue.label}</p>
        `;
        card.onclick = () => showIssue(issue.id);
        container.appendChild(card);
    });
}


