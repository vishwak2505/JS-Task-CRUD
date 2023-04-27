function sorting(albumsSort) {
    document.getElementsByClassName('album-table')[0].innerHTML = '';
    albumsSort.map(createTable);
    if (albums.length != albumsSort.length) {
        document.getElementsByClassName('load-button')[0].classList.remove(displayNone);
    }
}

function sortData(albumsSort, columnIndex, order) {
    if (albumsSort.length == 0){
        return;
    }
    albumsSort.sort((a, b) => { 
        if (typeof a[columnIndex] == 'number' ){
            if (order == 'asc') {
                return b[columnIndex] - a[columnIndex];
            } else if (order == 'desc'){
                return a[columnIndex] - b[columnIndex];
            }   
        } else if (typeof a[columnIndex] == 'string'){
            if (order == 'asc') {
                return b[columnIndex].localeCompare(a[columnIndex]);
            } else if (order == 'desc'){
                return a[columnIndex].localeCompare(b[columnIndex]);
            }
        }
    });
    sorting(albumsSort);
    return albumsSort;
}


