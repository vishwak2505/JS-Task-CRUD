function clearSort() {
    Object.keys(sortingFields).forEach(field => sortingFields[field] = false);
}

function sorting() {
    document.getElementsByClassName('album-table')[0].innerHTML = '';
    albumsDisplay.map(createTable);
    if (albums.length != albumsDisplay.length) {
        document.getElementsByClassName('load-button')[0].classList.remove(displayNone);
    }
}

function sortIdAsc() {
    albumsDisplay.sort((a, b) => b.id - a.id);
    clearSort();
    sortingFields.AscId = true;
    sorting();
}

function sortIdDesc() {
    albumsDisplay.sort((a, b) => a.id - b.id);
    clearSort();
    sortingFields.DescId = true;
    sorting();
}

function sortUserIdAsc() {
    albumsDisplay.sort((a, b) => b.userId - a.userId);
    clearSort();
    sortingFields.AscUserId = true;
    sorting();
}

function sortUserIdDesc() {
    albumsDisplay.sort((a, b) => a.userId - b.userId);
    clearSort();
    sortingFields.DescUserId = true;
    sorting();
}

function sortTitleAsc() {
    albumsDisplay.sort((a, b) => b.title.localeCompare(a.title));
    clearSort();
    sortingFields.AscTitle = true;
    sorting();
}

function sortTitleDesc() {
    albumsDisplay.sort((a, b) => a.title.localeCompare(b.title));
    clearSort();
    sortingFields.DescTitle = true;
    sorting();
}