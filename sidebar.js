// sidebar.js
import { changeActive, changeHidden, addItem, addTitle } from './ui.js';

export function initSidebarItems(data, json, setJson) {
    json = JSON.parse(data.toString());
    setJson(json);
    var itemCount = 1;
    var titleCount = 1;

    var arr = json.snippets[0];
    arr.forEach(snippet => {
        addItem(snippet.icon, snippet.title, itemCount++);
    });

    var favouritesList = document.getElementById('favourites-list');
    for (let i = 1; i < json.snippets.length; i++) {
        var array = json.snippets[i];
        var language = array[0].language;
        addTitle(language, titleCount++);
        array.forEach(snippet => {
            addItem(snippet.icon, snippet.title, itemCount++);
            var listItem = document.createElement('li');
            listItem.textContent = snippet.title;
            listItem.dataset.key = snippet.key;
            listItem.onclick = function() { changeActive(snippet.key) };
            favouritesList.appendChild(listItem);
        });
    }

    var groupID = 1;
    $('div.title').each(
        function(i,e) {
            $(this)
                .nextUntil('div.title')
                .wrapAll('<div id=group'+ groupID++ +' class="group show"/>' );
        });

    var titles = $('div.title');
    for (let index = 0; index < titles.length; index++) {
        titles[index].onclick = function() { changeHidden(index+1) };
    }

    var element = document.getElementById('item1');
    element.className = "item active";
}
