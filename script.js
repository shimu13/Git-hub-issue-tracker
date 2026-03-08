const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

window.onload = () => {

if (!localStorage.getItem("loggedIn")) {
window.location.href = "index.html";
return;
}

const firstTab = document.querySelector(".tabBtn");

if(firstTab){
loadIssues("all", firstTab);
}

};


async function loadIssues(type, btn){

try{

document.querySelectorAll(".tabBtn").forEach(tab=>{
tab.classList.remove("bg-blue-500","text-white");
tab.classList.add("bg-gray-300");
});

if(btn){
btn.classList.remove("bg-gray-300");
btn.classList.add("bg-blue-500","text-white");
}

const loader=document.getElementById("loader");

if(loader){
loader.classList.remove("hidden");
}

const res = await fetch(API);

if(!res.ok){
throw new Error("API Error");
}

const data = await res.json();

let issues = data.data || [];

if(type==="open"){
issues = issues.filter(i => i.status === "open");
}

if(type==="closed"){
issues = issues.filter(i => i.status === "closed");
}

displaySummary(issues);
displayIssues(issues);

}catch(error){

console.log("API ERROR:", error);

}

const loader=document.getElementById("loader");

if(loader){
loader.classList.add("hidden");
}

}



function displaySummary(issues){

const summary=document.getElementById("issuesSummary");

if(!summary) return;

const open=issues.filter(i=>i.status==="open").length;
const closed=issues.filter(i=>i.status==="closed").length;

summary.innerHTML=`

<div class="bg-white p-4 rounded shadow flex justify-between mb-4">

<div class="flex items-center gap-2">



<div>

<div class="flex items-center gap-3">
  <img src="./assets/Aperture.png" alt="Aperture Icon" class="w-6 h-6">
  <p class="font-bold">${issues.length} Issues</p>
</div>

<p class="text-sm text-gray-500">
Total issues loaded
</p>

</div>

</div>

<div class="flex gap-4 text-sm">

<span class="text-green-600">
Open: ${open}
</span>

<span class="text-purple-600">
Closed: ${closed}
</span>

</div>

</div>

`;

}



function displayIssues(issues){

const container=document.getElementById("issuesContainer");

if(!container) return;

container.innerHTML="";

issues.forEach(issue=>{

const card=document.createElement("div");

card.className=`
bg-white p-4 rounded shadow cursor-pointer border-t-4
${issue.status==="open"?"border-green-500":"border-purple-500"}
`;

card.innerHTML=`

<h2 class="font-bold text-lg">${issue.title}</h2>

<p class="text-sm text-gray-600 mb-2">
${issue.description}
</p>

<p>Status: ${issue.status}</p>
<p>Author: ${issue.author}</p>
<p>Priority: ${issue.priority}</p>
<p>Label: ${issue.label}</p>

<p class="text-xs text-gray-500">
Created: ${new Date(issue.createdAt).toLocaleDateString()}
</p>

`;
const issues = [
{
id:1,
title:"Fix Navigation Menu On Mobile Devices",
description:"The navigation menu doesn't collapse properly on mobile devices.",
priority:"HIGH",
labels:["BUG","HELP WANTED"],
author:"john_doe",
date:"1/15/2024"
},

{
id:2,
title:"Improve Dashboard UI",
description:"Dashboard layout needs better spacing.",
priority:"LOW",
labels:["ENHANCEMENT"],
author:"john_doe",
date:"1/15/2024"
}

];

const container = document.getElementById("issuesContainer");

issues.forEach(issue => {

let priorityColor = "";

if(issue.priority === "HIGH"){
priorityColor = "border-red-500 bg-red-100 text-red-500";
}
else if(issue.priority === "MEDIUM"){
priorityColor = "border-yellow-500 bg-yellow-100 text-yellow-600";
}
else{
priorityColor = "border-purple-500 bg-purple-100 text-purple-600";
}

let labelsHTML = "";

issue.labels.forEach(label =>{

labelsHTML += `
<span class="text-xs px-2 py-1 rounded-full bg-gray-200">
${label}
</span>
`;

});

const card = document.createElement("div");

card.className = `bg-white rounded-lg shadow-md p-4 border-t-4 ${priorityColor}`;

card.innerHTML = `

<div class="flex justify-between mb-2">
<span class="text-xs px-3 py-1 rounded-full ${priorityColor}">
${issue.priority}
</span>
</div>

<h2 class="font-semibold text-lg">
${issue.title}
</h2>

<p class="text-gray-500 text-sm mt-1">
${issue.description}
</p>

<div class="flex gap-2 mt-3">
${labelsHTML}
</div>

<div class="text-xs text-gray-400 mt-3">
#${issue.id} by ${issue.author} <br>
${issue.date}
</div>

`;

container.appendChild(card);

});
card.onclick = () => showIssue(issue.id);

container.appendChild(card);

});

}



async function showIssue(id){

try{

const res = await fetch(
`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`
);

const data = await res.json();

const issue = data.data;

document.getElementById("modalTitle").innerText=issue.title;
document.getElementById("modalDesc").innerText=issue.description;
document.getElementById("modalStatus").innerText="Status: "+issue.status;
document.getElementById("modalAuthor").innerText="Author: "+issue.author;
document.getElementById("modalPriority").innerText="Priority: "+issue.priority;
document.getElementById("modalLabel").innerText="Label: "+issue.label;
document.getElementById("modalDate").innerText=
"Created: "+new Date(issue.createdAt).toLocaleString();

document.getElementById("modal").classList.remove("hidden");

}catch(error){

console.log("Single issue error:", error);

}

}



function closeModal(){
document.getElementById("modal").classList.add("hidden");
}



async function searchIssue(){

const text=document.getElementById("searchInput").value;

if(!text){
loadIssues("all",document.querySelector(".tabBtn"));
return;
}

try{

const res=await fetch(
`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`
);

const data=await res.json();

displaySummary(data.data);
displayIssues(data.data);

}catch(error){

console.log("Search error:",error);

}

}