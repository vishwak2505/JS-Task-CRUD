function clearSort(header) { //pass the header that is being sorted and displayed
    Object.keys(sortingFields).forEach(field => sortingFields[field].checked = false);
    sortingFields[header].checked = true;
}

function sorting() {
    document.getElementsByClassName('album-table')[0].innerHTML = '';
    albumsDisplay.map(createTable);
    if (albums.length != albumsDisplay.length) {
        document.getElementsByClassName('load-button')[0].classList.remove(displayNone);
    }
}

function sortAsc(header) {
    let tag = sortingFields[header].tag;
    switch (tag){
        case 'id':
        case 'userId':  albumsDisplay.sort((a, b) => b[tag] - a[tag]);
                        break;  
        case 'title' :  albumsDisplay.sort((a, b) => b[tag].localeCompare(a[tag]));
    }
        clearSort(header);
        sorting();
}

function sortDesc(header) {
    let tag = sortingFields[header].tag;
    switch (tag){
        case 'id':
        case 'userId':  albumsDisplay.sort((a, b) => a[tag] - b[tag]);
                        break;  
        case 'title' :  albumsDisplay.sort((a, b) => a[tag].localeCompare(b[tag]));
    }
    clearSort(header);
    sorting();
}