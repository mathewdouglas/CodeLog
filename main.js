// main.js
import { storageAvailable, checkLocalStorage, updateLocalStorage } from './storage.js';
import { initSidebarItems } from './sidebar.js';
import { addJsonItem, sortJSON } from './snippets.js';
import { toggleEditPane, toggleNewPane, togglePane, addItem, addTitle, changeActive, changeHidden } from './ui.js';

const SIDEBAR_GRID_ID = "sidebar-grid";

var sidebarGrid;

var showEdit = false;
var showNewPane = false;
var currentPane = null;
var sortOption = "last-used";

window.copyText = copyText;

let json = null;
function setJson(data) { json = data; }

window.onload = function() {
    if (storageAvailable()) {
        checkLocalStorage((data) => initSidebarItems(data, json, setJson), setJson);
    }
    const element = document.getElementById('item1');
    if (element) {
        getItemContent(element.id, element.parentElement.id);
    }
    sidebarGrid = document.getElementById(SIDEBAR_GRID_ID);
    sidebarGrid.onscroll = function () {
        scrollFunction();
    };

    let localTimestamp = getLocalTimestamp();
    console.log("Logged in: " + localTimestamp);
   
    // checkGroup(); // move logic here if needed
    
    setInterval(() => {
        updateRecents(); // move recents logic here if needed
    }, 60 * 1000);
}

// Returns the current date and time in the format "YYYY-MM-DDTHH:MM:SS"
function getLocalTimestamp() {
    let date = new Date();

    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    let day = date.getDate().toString().padStart(2, '0');

    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');

    updateRecents();

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

// Returns a string representing the time elapsed since the given date
function timeAgo(date) {
    let seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
}

function scrollFunction() {
    // Checks if the website is in desktop mode
    // Might need if I do a mobile version but dont need for now

    // Checks how far the page has been scrolled
    if (sidebarGrid.scrollTop > 30) {
        // The website is in desktop mode and the page has been scrolled past 30px
        // Show seperator and background for header
        document.getElementById("sidebar-header").style.borderBottom = "0.5px solid var(--seperator-colour)";
        document.getElementById("sidebar-header").style.backgroundColor = "var(--sidebar-colour)";     
    } else {
        // Hide seperator and background for header so as to show scrollbar and look nice
        document.getElementById("sidebar-header").style.borderBottom = "none";
        document.getElementById("sidebar-header").style.backgroundColor = "var(--clear)";  
    }

    // seperate check to see if it has scrolled to a point where the title is hidden
    if (sidebarGrid.scrollTop > 60) {
        // Show title in header
        document.getElementById("header-title").style.color = "var(--text-colour)";
    } else {
        // Hide title in header in a way that allows for a transition
        document.getElementById("header-title").style.color = "var(--sidebar-colour)";
    }
}

// Refreshes and populates the recents list
function updateRecents() {
    var recentsList = document.getElementById('recents-list');
    recentsList.innerHTML = '';

    //get the 5 most recently used snippets and append them to the recents list
    let recents = json.snippets.flat().filter(function(item) {
        return item.last_used_timestamp !== "" && item.last_used_timestamp !== undefined;
    });

    // Sorts the recents array based on the selected sort option
    if (sortOption === 'last-used') {
        // Sorts the recents array by last_used_timestamp
        recents.sort(function(a, b) {
            return new Date(b.last_used_timestamp) - new Date(a.last_used_timestamp);
        });
    } else if (sortOption === 'creation') {
        //Sorts the recents array by created_timestamp
        recents.sort(function(a, b) {
            return new Date(b.created_timestamp) - new Date(a.created_timestamp);
        });
    }

    // Limits the recents array to the 5 most recent snippets
    recents = recents.slice(0, 5);

    // Creates a list item (li) for each recent snippet
    recents.forEach(function(item) {
        var listItem = document.createElement('li');
        var lastUsed = null;
        
        listItem.classList.add('item-container');
        
        if (sortOption === 'last-used') {
            lastUsed = timeAgo(new Date(item.last_used_timestamp));
        } else if (sortOption === 'creation') {
            lastUsed = timeAgo(new Date(item.created_timestamp));
        }

        listItem.innerHTML = `
            <span class="recents-text">${item.title}</span>
            <span class="timestamp">${lastUsed}</span>
        `;
        listItem.dataset.key = item.key;
        listItem.onclick = function() { changeActive(item.key) };
        recentsList.appendChild(listItem);
    });
}

// Searches the JSON for the object that matches the given criteria eg
export function getItemContent(id, parentID) {
    
    if (parentID === "sidebar-grid") {
        groupIndex = 0;
    } else {
        var groupIndex = parentID.match(/(\d+)/)[0];
    }
    // var itemIndex = id.match(/(\d+)/)[0];
    
    // console.log(id);
    // console.log(parentID);
    // console.log(groupIndex);
    // console.log(itemIndex);

    var len = json.snippets[groupIndex].length;
    var item;
    for (let i = 0; i < len; i++) {
        const element = json.snippets[groupIndex][i];
        if (element.key === id) {
            item = element;
        }
    }
    // console.log(item);
    setContent(item, groupIndex);
}

function setContent(item, groupIndex) {
    // Close any open panes if editing or creating new content
    if (showEdit) {
        toggleEditPane();
    }
    if (showNewPane) {
        toggleNewPane();
    }
    
    // Close the currently open pane if another pane is selected
    if (currentPane !== null) {
        togglePane(currentPane);
        currentPane = null;
    }
    
    // If the item belongs to a group, display its content
    if (groupIndex != 0) {
        document.getElementById('snippet-title').innerText = item.title;
        document.getElementById('description-block').innerText = item.content;
        document.getElementById('code').innerText = item.code;
        document.getElementById('copy-button').dataset.key = item.key;
    } else {
        // If the item is a pane, toggle its visibility
        if (item.title in { "Favourites": 1, "Recents": 1, "Search": 1, "Settings": 1 }) {
            if (currentPane !== item.title) {
                togglePane(item.title);
                currentPane = item.title;
            }
        } else {
            console.log("Error: Invalid item");
        }
    }
}

// Adds the code in the code block to users clipboard
export function copyText() {
    // Get the text field
    var text = document.getElementById("code");
  
    // Copy the text inside the text field 
    navigator.clipboard.writeText(text.innerText);

    // Get the key of the snippet from the data attribute of the copy button
    var key = document.getElementById("copy-button").dataset.key;

    // Find the snippet in the JSON data and update its last_used_at field
    for (let i = 0; i < json.snippets.length; i++) {
        for (let j = 0; j < json.snippets[i].length; j++) {
            if (json.snippets[i][j].key === key) {
                json.snippets[i][j].last_used_timestamp = getLocalTimestamp();
                console.log("Last used updated");
                break;
            }
        }
    }

    updateRecents();
    updateLocalStorage();

    showTooltip(3000);
  
    // Alert the copied text
    // alert("Copied the text: " + text.innerText);
}

// Shows the tooltip
async function showTooltip(length) {
    $('#tooltip').removeClass("hide");
    await new Promise(resolve => setTimeout(resolve, length));
    $('#tooltip').addClass("hide");
}