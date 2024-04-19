const favouritesIcon = "ai-star icon";
const recentsIcon = "ai-clock icon";
const searchIcon = "ai-search icon";
const cssIcon = "ai-hashtag icon blue";
const jsIcon = "fab fa-js-square icon fa-icon gold"
const htmlIcon = "ai-html-fill icon orange";
const swiftIcon = "fab fa-swift icon fa-icon orange";
const pythonIcon = "ai-python-fill icon green";
const javaIcon = "fab fa-java icon fa-icon orange";
const otherIcon = "fas fa-file-alt icon fa-icon"

var sidebarGrid;
var activeItem = "item1";
var storage = window.localStorage;

var showEdit = false;
var showNewPane = false;
var showFavouritesPane = false;
var showRecentsPane = false;
var showSearchPane = false;
var showSettingsPane = false;

var json;

async function getServerJson() {
    const response = await fetch("./data.json");
    return response.json();
}

window.onload = function() {
    if (storageAvailable()) {
        checkLocalStorage();
    }
    sidebarGrid = document.getElementById("sidebar-grid");
    // console.log(sidebarGrid);
    sidebarGrid.onscroll = function () {
        scrollFunction();
    };

    checkGroup();
}

// Checks if browser has localStorage enabled
function storageAvailable() {
    try {
        var storage = window['localStorage'],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage && storage.length !== 0;
    }
}

// Checks if local storage contains the json file
function checkLocalStorage() {
    var item = storage.getItem('CodeLogData');
    if (item == null) {
        console.log("Not stored");

        getServerJson()
            .then(data => {
                initSidebarItems(JSON.stringify(data));
                storage.setItem('CodeLogData', JSON.stringify(data));
            });
        // storage.setItem('CodeLogData', 'test');
    } else {
        // console.log(item);
        initSidebarItems(item);
    }
}

// Updates the local storage with the current state of the json object
function updateLocalStorage() {
    storage.setItem('CodeLogData', JSON.stringify(json));
    console.log("Storage Updated");
}

// Initialises the menu bar with the info from data.json
function initSidebarItems(data) {
    // console.log(data);
    json = JSON.parse(data.toString());
    var itemCount = 1;
    var titleCount = 1;

    var arr = json.snippets[0];
    arr.forEach(snippet => {
        addItem(snippet.icon, snippet.title, itemCount++);
    });

    // document.get
    
    for (let i = 1; i < json.snippets.length; i++) {
        var array = json.snippets[i];
        var language = array[0].language;
        addTitle(language, titleCount++);
        
        array.forEach(snippet => {
            addItem(snippet.icon, snippet.title, itemCount++);
        });
    }

    // console.log(json.snippets[1][0].code);

    var groupID = 1;
    $('div.title').each(
        function(i,e) {
            $(this)
                .nextUntil('div.title')
                .wrapAll('<div id=group'+ groupID++ +' class="group show"/>');
        });

    // console.log('grouped');

    var titles = $('div.title');
    // console.log(titles);
    for (let index = 0; index < titles.length; index++) {
        titles[index].onclick = function() { changeHidden(index+1) };
    }

    var element = document.getElementById(activeItem);
    element.className = "item active";
    getItemContent(element.id, element.parentElement.id);
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

// Searches the JSON for the onject that matches the gievn criteria eg
function getItemContent(id, parentID) {
    
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
    if (showEdit) {
        toggleEditPane();
    }
    if (showNewPane) {
        toggleNewPane();
    }
    
    if (groupIndex != 0) {
        document.getElementById('snippet-title').innerText = item.title;
        document.getElementById('description-block').innerText = item.content;
        document.getElementById('code').innerText = item.code;
    } else {
        switch (item.title) {
            case "Favourites":
                // TODO add favourites functionality
                
                break;
            
            case "Recents":
                console.log(item.title);
                break;

            case "Search":
                console.log(item.title);
                break;

            case "Settings":
                console.log(item.title);
                break;
            
            default:
                console.log("Error");
        }
    }
}

// Changes the active sidebar item
function changeActive(id) {
    const selectedItem = document.getElementById(id);
    activeItem = id;
    var len = document.getElementsByClassName("item").length;
    for (var i = 0; i < len; i++) { 
      document.getElementsByClassName("item")[i].className = "item inactive"; 
    } 
    selectedItem.className = "item active";

    getItemContent(selectedItem.id, selectedItem.parentElement.id);
}

// Toggles whether language group is expanded or hidden
function changeHidden(id) {
    if ($('#group'+ id).hasClass("show")) {
        $('#group'+ id).addClass("hide");
        $('#group'+ id).removeClass("show");
        $('#title' + id).addClass("chevron-right");
    } else {
        $('#group'+ id).addClass("show");
        $('#group'+ id).removeClass("hide");
        $('#title' + id).removeClass("chevron-right");
    }
}

// Creates and adds item to the sidebar
function addItem (iconClass, content, id) {
    // Create new elements
    const newDiv = document.createElement("div");
    const icon = document.createElement("i");
    const text = document.createElement("p");

    newDiv.className = "item inactive";
    newDiv.id = "item" + id;
    icon.className = iconClass;

    newDiv.onclick = function() { changeActive("item" + id) };

    // Give element some content
    const newContent = document.createTextNode(content);

    // Add child elements to the main item div
    text.appendChild(newContent);
    newDiv.appendChild(icon);
    newDiv.appendChild(text);

    // Inserts the newly created element and its content into the sidebar
    const currentDiv = document.getElementById("sidebar-grid");
    currentDiv.insertBefore(newDiv, null);
}

// Creates and adds title to the sidebar
function addTitle (content, id) {
    // Create a new elements
    const newDiv = document.createElement("div");
    const text = document.createElement("h2");
    const icon = document.createElement("i");
  
    newDiv.className = "title";
    newDiv.id = "title" + id;
    icon.className = "ai-chevron-down icon-right";

    // newDiv.onclick = function() { changeHidden(id) };
  
    // Give element some content
    const newContent = document.createTextNode(content);
  
    // Add child elements to the main item div
    text.appendChild(newContent);
    newDiv.appendChild(text);
    newDiv.appendChild(icon);
  
    // Inserts the newly created element and its content into the sidebar
    const currentDiv = document.getElementById("sidebar-grid");
    currentDiv.insertBefore(newDiv, null);
}

// Adds the code in the code block to users clipboard
function copyText() {
    // Get the text field
    var text = document.getElementById("code");
  
    // Copy the text inside the text field 
    navigator.clipboard.writeText(text.innerText);

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

// Checks the Group and returns it's index in the json array
function checkGroup() {
    var catagories = ["main", "CSS", "JavaScript", "HTML", "Java", "Swift", "Python", "Other"];
    // console.log(catagories.indexOf("HTML"));
}

function sortJSON() {
    var len = json.snippets.length;
    for (let i = 1; i < len; i++) {
        var array = json.snippets[i];
        
        array.sort(function(a, b) {
            if (a.title < b.title) return -1;
            if (a.title > b.title) return 1;
            return 0;
        });
    }

    // Sets all the objects key values to match their div counterparts' id
    var key = 1;
    for (let i = 0; i < len; i++) {
        var array = json.snippets[i];
        var len2 = array.length;
        for (let j = 0; j < len2; j++) {
            array[j].key = "item" + key++; 
        }
    }

    // console.log(JSON.stringify(json));
    updateLocalStorage();
}

function toggleEditPane(save) {
    if (!showEdit) {
        $('#edit').addClass("show");
        $('#edit').removeClass("hide");
        document.getElementById('edit-input').value = document.getElementById('snippet-title').innerText;
        document.getElementById('edit-textarea1').value = document.getElementById('description-block').innerText;
        document.getElementById('edit-textarea2').value = document.getElementById('code').innerText;
    } else {
        if (save === "true") {
            document.getElementById('snippet-title').innerText = document.getElementById('edit-input').value;
            document.getElementById('description-block').innerText = document.getElementById('edit-textarea1').value;
            document.getElementById('code').innerText = document.getElementById('edit-textarea2').value;
            saveEdit();
        }
        if (save === "false") {
            deleteJsonItem();
        }
        $('#edit').addClass("hide");
        $('#edit').removeClass("show");
    }
    showEdit = !showEdit;
}

function toggleNewPane(save) {
    if (!showNewPane) {
        $('#new').addClass("show");
        $('#new').removeClass("hide");
    } else {
        if (save) {
            var lang = document.getElementById("language").value;
            addJsonItem(lang);
        }
        $('#new').addClass("hide");
        $('#new').removeClass("show");
    }
    showNewPane = !showNewPane;
}

function addJsonItem(language) {
    var array = json.snippets;
    var icon = getIcon(language);

    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (element[0].language === language) {
            json.snippets[i].push({
                "title": "New Item",
                "icon": icon,
                "language": language,
                "content": "Enter description",
                "code": "Enter code",
                "key": ""
            });
        }
    }
    sortJSON();
    clearSidebar();
    initSidebarItems(JSON.stringify(json));
}

function getIcon(language) {
    var icon;
    switch (language) {
        case "CSS":
            icon = cssIcon;
            break;
        case "HTML":
            icon = htmlIcon;
            break;
        case "Java":
            icon = javaIcon;
            break;
        case "JavaScript":
            icon = jsIcon;
            break;
        case "Python":
            icon = pythonIcon;
            break;
        case "Swift":
            icon = swiftIcon;
            break;
        default:
            icon = otherIcon;
            break;
    }

    return icon;
}

// Saves edits made in edit pane to JSON Object
function saveEdit() {
    var id;
    var parentID;
    var array = document.getElementsByClassName("item");
    var len = array.length;
    for (var i = 0; i < len; i++) { 
        const element = array[i];
        if (element.className == "item active") {
            id = element.id;
            parentID = element.parentElement.id;
        } 
    }
    // Find group index number using regex
    var groupIndex = parentID.match(/(\d+)/)[0];

    var itemIndex;
    len = json.snippets[groupIndex].length;
    for (let i = 0; i < len; i++) {
        const element = json.snippets[groupIndex][i];
        if (element.key === id) {
            // Found element
            itemIndex = i;
        }
    }

    json.snippets[groupIndex][itemIndex].title = document.getElementById('snippet-title').innerText;
    json.snippets[groupIndex][itemIndex].content = document.getElementById('description-block').innerText;
    json.snippets[groupIndex][itemIndex].code = document.getElementById('code').innerText;

    sortJSON();
    clearSidebar();
    updateLocalStorage();
    initSidebarItems(JSON.stringify(json));
}

// Saves edits made in edit pane to JSON Object
function deleteJsonItem() {
    var id;
    var parentID;
    var array = document.getElementsByClassName("item");
    var len = array.length;
    for (var i = 0; i < len; i++) { 
        const element = array[i];
        if (element.className == "item active") {
            id = element.id;
            parentID = element.parentElement.id;
        } 
    }
    // Find group index number using regex
    var groupIndex = parentID.match(/(\d+)/)[0];

    var itemIndex;
    len = json.snippets[groupIndex].length;
    for (let i = 0; i < len; i++) {
        const element = json.snippets[groupIndex][i];
        if (element.key === id) {
            // Found element
            itemIndex = i;
        }
    }

    json.snippets[groupIndex].splice(itemIndex, 1);

    sortJSON();
    clearSidebar();
    updateLocalStorage();
    initSidebarItems(JSON.stringify(json));
}

function clearSidebar() {
    document.getElementById('sidebar-grid').innerHTML = "<h1 id=\"sidebar-title\">Snippets</h1>\n";
}

function exportJSON() {
    sortJSON();
    var txt = JSON.stringify(json, null, "    ");
    // console.log(txt);
    navigator.clipboard.writeText(txt);
    showTooltip(3000);
}

