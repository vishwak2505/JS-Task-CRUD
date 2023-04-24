function sorting() {
    document.getElementsByClassName('album-table')[0].innerHTML = '';
    albumsDisplay.map(createTable);
    if (albums.length != albumsDisplay.length) {
        document.getElementsByClassName('load-button')[0].classList.remove(displayNone);
    }
}

function sortIdAsc() {
    albumsDisplay.sort((a, b) => b.id - a.id);
    sorting();
}

function sortIdDesc() {
    albumsDisplay.sort((a, b) => a.id - b.id);
    sorting();
}

function sortUserIdAsc() {
    albumsDisplay.sort((a, b) => b.userId - a.userId);
    sorting();
}

function sortUserIdDesc() {
    albumsDisplay.sort((a, b) => a.userId - b.userId);
    sorting();
}

function sortTitleAsc() {
    albumsDisplay.sort((a, b) => b.title.localeCompare(a.title));
    sorting();
}

function sortTitleDesc() {
    albumsDisplay.sort((a, b) => a.title.localeCompare(b.title));
    sorting();
}