// Simulated list of folder names in the subdirectory
const folders = ["01"];

// Get the base URL dynamically from the current location
const baseUrl = "../task/"; // This gets the current URL

// Get the <ul> element where the folder links will be inserted
const folderList = document.getElementById("folder-list");

// Function to create and append folder links to the list
function generateFolderLinks() {
  folders.forEach((folder) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `${baseUrl}${folder}/`; // Append folder and index.html to current URL
    a.textContent = folder;
    li.appendChild(a);
    folderList.appendChild(li);
  });
}

// Call the function to populate the folder list
generateFolderLinks();
