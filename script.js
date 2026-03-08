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