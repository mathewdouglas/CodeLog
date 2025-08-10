// storage.js
export const storage = window.localStorage;

export async function getServerJson() {
    const response = await fetch("./data.json");
    return response.json();
}

// Checks if local storage is available
export function storageAvailable() {
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

export function checkLocalStorage(initSidebarItems, setJson) {
    var item = storage.getItem('CodeLogData');
    if (item == null) {
        getServerJson()
            .then(data => {
                setJson(data);
                initSidebarItems(JSON.stringify(data));
                storage.setItem('CodeLogData', JSON.stringify(data));
            });
    } else {
        setJson(JSON.parse(item));
        initSidebarItems(item);
    }
}

export function updateLocalStorage(json) {
    storage.setItem('CodeLogData', JSON.stringify(json));
    console.log("Storage Updated");
}
