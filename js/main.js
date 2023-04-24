let albums = [];
let albumsDisplay = [];
let displayNone = 'display-none'; //CSS property
let popup = 'blur-background'; //CSS property
let currentId;
let url = "https://jsonplaceholder.typicode.com/albums";
let flag = 0;
let position = -20;

function createButtons(album) { //pass the album object to create buttons 
    let buttons = [];
    let viewButton = document.createElement('BUTTON');
    viewButton.innerHTML = '<i class="fa-regular fa-eye"></i>'; 
    viewButton.classList.add('view-user');
    viewButton.addEventListener('click', ()=> {
        viewUser(album);
    });
    buttons.push(viewButton);

    let updateButton = document.createElement('BUTTON');
    updateButton.innerHTML = '<i class="fa-solid fa-pen"></i>'; 
    updateButton.classList.add('update-user');
    updateButton.addEventListener('click', ()=> {
        updateUser(album);
    });
    buttons.push(updateButton);

    let deleteButton = document.createElement('BUTTON');
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>'; 
    deleteButton.classList.add('delete-user');
    deleteButton.addEventListener('click', ()=> {
        deleteUser(album);
    });
    buttons.push(deleteButton);
    return buttons;
}

function createTable(album) { //pass the album object to create the table 
    let table = document.getElementsByClassName('album-table')[0],
        row = table.insertRow(0);
   
    let c1 = row.insertCell(0),
        c2 = row.insertCell(1),
        c3 = row.insertCell(2),
        c4 = row.insertCell(3);

    c1.classList.add('album-table-id');    
    c2.classList.add('album-table-userid');
    c3.classList.add('album-table-title');
    c4.classList.add('album-table-options');

    c1.innerText = album.id;
    c2.innerText = album.userId;
    c3.innerText = album.title;

    let buttons = createButtons(album);

    buttons.forEach(button => c4.appendChild(button));

    if (flag == 0){
        row.classList.add('album-table-oddrow');  
        flag = 1;
    } else {
        row.classList.add('album-table-evenrow');  
        flag = 0;
    }
}

async function getAlbums() {
    let response = await fetch(url);
    albums = await response.json();
    if (albums.length != 0 ){
        albumsDisplay = albums.slice(position);
        albumsDisplay.map(createTable);
    } else {
        alert("END");
    }
}

(function init() {
    getAlbums();
})();

function closePopup(className) {
    document.getElementsByClassName(className)[0].classList.add(displayNone);
    document.getElementsByClassName('page')[0].classList.remove(popup);
}

function create() {
    document.getElementsByClassName('add-album')[0].classList.remove(displayNone);
    document.getElementsByClassName('page')[0].classList.add(popup);
}

async function searchAlbum() {
    document.getElementsByClassName('loader-bar')[0].classList.remove(displayNone);
    document.getElementsByClassName('page')[0].classList.add(popup);
    setTimeout( () => {
        closePopup('loader-bar');
    }, 1000);
    let title = document.getElementById('search').value;
    albumsDisplay = albums.filter((album) => album.title.includes(title));
    document.getElementsByClassName('album-table')[0].innerHTML = '';
    document.getElementsByClassName('load-button')[0].classList.remove(displayNone);
    document.getElementsByClassName('load-button')[0].innerHTML = 'Reload';
    if (albumsDisplay.length == 0) {
        document.getElementsByClassName('album-table')[0].innerHTML = 'No records found';
    } else {
        document.getElementsByClassName('create-album')[0].classList.add(displayNone);
        albumsDisplay.map(createTable);
    }
}

function loadMore() {
    document.getElementsByClassName('loader-bar')[0].classList.remove(displayNone);
    document.getElementsByClassName('page')[0].classList.add(popup);
    setTimeout( () => {
        closePopup('loader-bar');
    }, 1000); 
    document.getElementById('search').value = '';
    document.getElementsByClassName('load-button')[0].innerHTML = 'Load More...';
    document.getElementsByClassName('album-table')[0].innerHTML = '';
    position -= 20;
    albumsDisplay = albums.slice(position);
    albumsDisplay.map(createTable);
    if (albums.length == albumsDisplay.length) {
        document.getElementsByClassName('load-button')[0].classList.add(displayNone);
        position = -albums.length;
    }
}



