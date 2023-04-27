let albums = [];
let albumsDisplay = [];
let displayNone = 'display-none'; //CSS property
let popup = 'blur-background'; //CSS property
let currentId;
let url = "https://jsonplaceholder.typicode.com/albums";
let position = -20;
let sortingFields = {
    columnIndex: 'id',
    order: 'desc',
}

function createHead(album) {
    let table = document.getElementsByClassName('album-table-head')[0],
        row = table.insertRow(),
        columnName = Object.keys(album); 

    for (let i = 0; i < 3; i++) {
        let pos = -1;
        if (columnName[i] == 'id') {
            pos = 0;
        } 
        let c = row.insertCell(pos);
        c.classList.add(`album-table-${columnName[i].toLowerCase()}`);

        let headTitle = document.createElement('DIV');
        headTitle.innerHTML = columnName[i].toUpperCase();
        headTitle.classList.add('head-title');
        
        let sortButtons = document.createElement('DIV');
        sortButtons.classList.add('sort-options');
        
        let sortAscButton = document.createElement('BUTTON');
        let sortAscClasses = ['sort-button', 'asc'];
        sortAscButton.innerHTML = '<i class="sort-icon fa-solid fa-sort-up"></i>';
        sortAscButton.classList.add(...sortAscClasses);
        sortAscButton.addEventListener('click', () => {
            sortingFields.columnIndex = columnName[i];
            sortingFields.order = 'asc';
            sortData(albumsDisplay, sortingFields.columnIndex, sortingFields.order);
        });
        
        let sortDescButton = document.createElement('BUTTON');
        let sortDescClasses = ['sort-button', 'desc'];
        sortDescButton.innerHTML = '<i class="sort-icon fa-solid fa-caret-down"></i>';
        sortDescButton.classList.add(...sortDescClasses);
        sortDescButton.addEventListener('click', () => {
            sortingFields.columnIndex = columnName[i];
            sortingFields.order = 'desc';
            sortData(albumsDisplay, sortingFields.columnIndex, sortingFields.order);
        });
        
        sortButtons.appendChild(sortAscButton);
        sortButtons.appendChild(sortDescButton);
        
        c.appendChild(headTitle);
        c.appendChild(sortButtons);
    }   
    let c = row.insertCell(-1);
    c.classList.add('album-table-options');
    c.innerHTML = `<div class="head-title">
                    Options
                </div>`;

}

function createButtons(album) { //pass the album object to create buttons 
    let buttons = [];
    
    let viewButton = document.createElement('BUTTON');
    viewButton.innerHTML = '<i class="fa-regular fa-eye"></i>'; 
    viewButton.classList.add('view-user');
    viewButton.addEventListener('click', () => viewUser(album));
    buttons.push(viewButton);

    let updateButton = document.createElement('BUTTON');
    updateButton.innerHTML = '<i class="fa-solid fa-pen"></i>'; 
    updateButton.classList.add('update-user');
    updateButton.addEventListener('click', () => updateUser(album));
    buttons.push(updateButton);

    let deleteButton = document.createElement('BUTTON');
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>'; 
    deleteButton.classList.add('delete-user');
    deleteButton.addEventListener('click', () => deleteUser(album));
    buttons.push(deleteButton);
    
    return buttons;
}

function createTable(album) { //pass the album object to create the table 
    let table = document.getElementsByClassName('album-table')[0],
        row = table.insertRow(0),
        columnName = Object.keys(album); 

    for (let i = 0; i < 3; i++) {
        let pos = -1;
        if (columnName[i] == 'id'){
            pos = 0;
        }
        let c = row.insertCell(pos);
        c.classList.add(`album-table-${columnName[i].toLowerCase()}`);  
        c.innerText = album[columnName[i]]; 
    }
    
    let c = row.insertCell(-1);    
    c.classList.add('album-table-options');
    
    let buttons = createButtons(album);
    buttons.forEach(button => c.appendChild(button));
}

async function getAlbums() {
    let response = await fetch(url);
    albums = await response.json();
    if (albums.length != 0 ){
        createHead(albums[0]);
        albumsDisplay = albums.slice(position);
        albumsDisplay.map(createTable);
    } else {
        alert("END");
    }
    closePopup('loader-bar');
}

(function init() {
    getAlbums();
})();

function closePopup(className) { //pass the div class to close popup
    document.getElementsByClassName(className)[0].classList.add(displayNone);
    document.getElementsByClassName('page')[0].classList.remove(popup);
}

function create() {
    document.getElementsByClassName('add-album')[0].classList.remove(displayNone);
    document.getElementsByClassName('page')[0].classList.add(popup);
}

async function searchAlbum() {
    let titleTag = document.getElementById('search');
    let title = titleTag.value.trim();
    if (title.length <= 2) {
        return;
    }
    document.getElementsByClassName('create-album')[0].classList.add(displayNone);
    document.getElementsByClassName('loader-bar')[0].classList.remove(displayNone);
    document.getElementsByClassName('page')[0].classList.add(popup);
    setTimeout( () => {closePopup('loader-bar');}, 1000);
    albumsDisplay = albums.filter((album) => album.title.includes(title));
    document.getElementsByClassName('album-table')[0].innerHTML = '';
    document.getElementsByClassName('load-button')[0].classList.remove(displayNone);
    document.getElementsByClassName('load-button')[0].innerHTML = 'Reload';
    if (albumsDisplay.length == 0) {
        document.getElementsByClassName('album-table')[0].innerHTML = 'No records found';
    } else {
        albumsDisplay.map(createTable);
    }
}

function loadMore() {
    let {columnIndex, order} = sortingFields;
    document.getElementsByClassName('loader-bar')[0].classList.remove(displayNone);
    document.getElementsByClassName('page')[0].classList.add(popup);
    setTimeout( () => {
        closePopup('loader-bar');
    }, 1000); 
    let search = document.getElementById('search');
    if (search.value == '') {
        position -= 20;
    } else {
        search.value = '';
    }
    document.getElementsByClassName('create-album')[0].classList.remove(displayNone);
    document.getElementsByClassName('load-button')[0].innerHTML = 'Load More...';
    document.getElementsByClassName('album-table')[0].innerHTML = '';
    albumsSort = albums.slice(position);
    albumsDisplay = sortData(albumsSort, columnIndex, order);  
    if (albums.length == albumsDisplay.length) {
        document.getElementsByClassName('load-button')[0].classList.add(displayNone);
        position = -albums.length;
    }
}

