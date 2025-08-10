// ui.js
import { getItemContent } from './main.js';

// Toggles the visibility of the edit pane
export function toggleEditPane(save) {
    if (!window.showEdit) {
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
            window.saveEdit();
        }
        if (save === "false") {
            window.deleteJsonItem();
        }
        $('#edit').addClass("hide");
        $('#edit').removeClass("show");
    }
    window.showEdit = !window.showEdit;
}

// Toggles the visibility of the new pane
export function toggleNewPane(save) {
    if (!window.showNewPane) {
        $('#new').addClass("show");
        $('#new').removeClass("hide");
    } else {
        if (save) {
            var lang = document.getElementById("language").value;
            window.addJsonItem(lang);
        }
        $('#new').addClass("hide");
        $('#new').removeClass("show");
    }
    window.showNewPane = !window.showNewPane;
}

// Toggles the visibility of a pane
export function togglePane(paneId) {
    document.getElementById(paneId.toLowerCase()).classList.toggle('hide');
    document.getElementById(paneId.toLowerCase()).classList.toggle('show');
}

// Adds a new item to the sidebar
export function addItem(iconClass, content, id) {
    // Create the new item element
    const newDiv = document.createElement("div");
    const icon = document.createElement("i");
    const text = document.createElement("p");
    newDiv.className = "item inactive";
    newDiv.id = "item" + id;
    icon.className = iconClass;
    newDiv.onclick = function() { changeActive("item" + id) };

    // Give the new element some content
    const newContent = document.createTextNode(content);
    text.appendChild(newContent);
    newDiv.appendChild(icon);
    newDiv.appendChild(text);

    // Append the new item to the sidebar grid
    const currentDiv = document.getElementById("sidebar-grid");
    currentDiv.insertBefore(newDiv, null);
}

// Adds a new title to the sidebar
export function addTitle(content, id) {
    // Create the new title element
    const newDiv = document.createElement("div");
    const text = document.createElement("h2");
    const icon = document.createElement("i");
    newDiv.className = "title";
    newDiv.id = "title" + id;
    icon.className = "ai-chevron-down icon-right";
    
    // Give the new element some content
    const newContent = document.createTextNode(content);

    // Append the new elements to the title div
    text.appendChild(newContent);
    newDiv.appendChild(text);
    newDiv.appendChild(icon);

    // Append the new title div to the sidebar grid
    const currentDiv = document.getElementById("sidebar-grid");
    currentDiv.insertBefore(newDiv, null);
}

export function changeActive(id) {
    const selectedItem = document.getElementById(id);
    var len = document.getElementsByClassName("item").length;
    for (var i = 0; i < len; i++) {
        document.getElementsByClassName("item")[i].className = "item inactive";
    }
    selectedItem.className = "item active";
    getItemContent(selectedItem.id, selectedItem.parentElement.id);
}

export function changeHidden(id) {
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

