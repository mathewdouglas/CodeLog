// snippets.js
import { updateLocalStorage } from './storage.js';

// Sorts the JSON object by snippet titles
export function sortJSON(json) {
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
    updateLocalStorage(json);
}

export function addJsonItem(language, json, getIcon, setJson, initSidebarItems) {
    var array = json.snippets;
    var icon = getIcon(language);
    let localTimestamp = new Date().toISOString();
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (element[0].language === language) {
            json.snippets[i].push({
                "title": "New Item",
                "icon": icon,
                "language": language,
                "content": "Enter description",
                "code": "Enter code",
                "key": "",
                "created_timestamp": localTimestamp,
                "last_used_timestamp": ""
            });
        }
    }
    sortJSON(json);
    document.getElementById('sidebar-grid').innerHTML = "<h1 id=\"sidebar-title\">Snippets</h1>\n";
    initSidebarItems(JSON.stringify(json), json, setJson);
}
