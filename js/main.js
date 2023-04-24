let albums = [];
let albumsDisplay = [];
let displayNone = 'display-none'; //CSS property
let popup = 'blur-background';
let currentId;
let url = "https://jsonplaceholder.typicode.com/albums";
let flag = 0;
let position = -20;

function createButtons(album) {
    let buttons = [];
    let viewButton = document.createElement('BUTTON');
    viewButton.innerHTML = '<i class="fa-regular fa-eye"></i>'; 
    viewButton.classList.add('view-user');
    viewButton.setAttribute('onclick', `viewUser(${album.id})`);
    buttons.push(viewButton);

    let updateButton = document.createElement('BUTTON');
    updateButton.innerHTML = '<i class="fa-solid fa-pen"></i>'; 
    updateButton.classList.add('update-user');
    updateButton.setAttribute('onclick', `updateUser(${album.id})`);
    buttons.push(updateButton);

    let deleteButton = document.createElement('BUTTON');
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>'; 
    deleteButton.classList.add('delete-user');
    deleteButton.setAttribute('onclick', `deleteUser(${album.id})`);
    buttons.push(deleteButton);
    return buttons;
}

function createTable(album) {
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

async function jsonAddAlbum(album) {
    let jsonAlbum = JSON.stringify(album);
    console.log(jsonAlbum);
    try {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: jsonAlbum,
        });
                
        let result = await response.json();
        console.log(result);
        albums.push(album);
        albumsDisplay.push(album);
        if (albums.length == albumsDisplay.length) {
            position = -albumsDisplay.length;
        }
        createTable(album);
        closePopup('add-progress');
        closePopup('add-album');
    } catch (e) {
        alert('Duplicate ID');
    }
}

function addAlbum() {
    let form = document.getElementsByClassName('add-form')[0],
        tags = form.children,
        nextId = +albums.slice(-1)[0].id + 1,
        album = {
            userId: 0,
            id: nextId,
            title: ''
        },
        flag = 0;      

    Array.from(tags).forEach(tag => {
        if (tag.id == 'userID' && tag.value != ''){
            album.userId = +tag.value;
            flag++;
        } else if (tag.id == 'title' && tag.value != ''){
            album.title = tag.value.toLowerCase();
            flag++;
        }         
    });

    if (flag == 2){
        document.getElementsByClassName('add-progress')[0].classList.remove(displayNone);
        jsonAddAlbum(album);
    } else {
        console.log('fill');
    }
}

async function searchAlbum() {
    document.getElementsByClassName('loader-bar')[0].classList.remove(displayNone);
    document.getElementsByClassName('page')[0].classList.add(popup);
    setTimeout( () => {
        closePopup('loader-bar');
    }, 2000);
    let title = document.getElementById('search').value;
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

function displayAlbum(album) {
    let data = `<h4 class="view-id">ID: ${album.id}</h4>
                <h4 class="view-id">User ID: ${album.userId}</h4>
                <h4 class="view-title">Title: ${album.title}</h4>`;
    return data;  
}

async function profile(id) {
    let response = await fetch(`https://jsonplaceholder.typicode.com/albums/${id}/photos`);
    let profile = await response.json();
    if (profile.length != 0){
        document.getElementsByClassName('profile-photo')[0].src = profile[0].thumbnailUrl;
    }
}

function viewUser(id) {
    document.getElementsByClassName('profile-photo')[0].src = '../images/user-profile.webp';
    document.getElementsByClassName('view-album')[0].classList.remove(displayNone);
    document.getElementsByClassName('page')[0].classList.add(popup);
    let album = albums.find(album => album.id == id);
    profile(id);
    document.getElementsByClassName('album-content')[0].innerHTML = displayAlbum(album);    
}

function updateUser(id) {
    let album = albums.find(album => album.id == id);
    currentId = id;
    document.getElementsByClassName('update-album')[0].classList.remove(displayNone);
    document.getElementsByClassName('page')[0].classList.add(popup);
    
    let form = document.getElementsByClassName('update-form')[0],
        tags = form.children;
    
    Array.from(tags).forEach(tag => {
        if (tag.id == 'userID'){
            tag.value = +album.userId;
        } else if (tag.id == 'id'){
            tag.value = album.id;
        } else if (tag.id == 'title'){
            tag.value = album.title;
        } 
    });
}

async function jsonUpdateAlbum(album) {
    let jsonAlbum = JSON.stringify(album);
    try{
        let response = await fetch(`${url}/${currentId}`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json"
            },
            body: jsonAlbum,
        });
                
        let result = await response.json();
        console.log(result);

        const albumIndex = albums.findIndex((album) => album.id == currentId);
        const albumDisplayIndex = albumsDisplay.findIndex((album) => album.id == currentId);

        if (albumIndex > -1) {
            document.getElementsByClassName('album-table')[0].innerHTML = '';
            albums.splice(albumIndex, 1, album);
            albumsDisplay.splice(albumDisplayIndex, 1, album);
            albumsDisplay.map(createTable);
        }
        closePopup('update-album');
        closePopup('update-progress');
    } catch (e) {
        alert('Duplicate ID');
    }
}

function updateAlbum() {
    let flag = 0;
    let album = albums.find(album => album.id === currentId);
    let form = document.getElementsByClassName('update-form')[0],
        tags = form.children;

    Array.from(tags).forEach(tag => {
        if (tag.id == 'userID' && tag.value != album.userId){
            album.userId = +tag.value;
            flag = 1;
        } else if (tag.id == 'title' && tag.value != album.title){
            album.title = tag.value.toLowerCase();
            flag = 1;
        }         
    });

    if (flag == 1){
        document.getElementsByClassName('update-progress')[0].classList.remove(displayNone);
        document.getElementsByClassName('submit-update')[0].disabled = false;
        jsonUpdateAlbum(album);
    }
}

function deleteUser(id) {
    let album = albums.find(album => album.id === id);
    document.getElementsByClassName('delete-album')[0].classList.remove(displayNone);
    document.getElementsByClassName('page')[0].classList.add(popup);  
    currentId = album.id;
    document.getElementsByClassName('album-delete')[0].innerHTML = displayAlbum(album);       
}

async function deleteAlbum() {
    document.getElementsByClassName('delete-progress')[0].classList.remove(displayNone);
    try {
        let response = await fetch(`${url}/${currentId}`, {
            method: "DELETE"
        });
        let result = await response.json();
        console.log(result);

        const albumIndex = albums.findIndex((album) => album.id == currentId);
        const albumDisplayIndex = albumsDisplay.findIndex((album) => album.id == currentId);
        if (albumIndex > -1) {
            document.getElementsByClassName('album-table')[0].innerHTML = '';
            albums.splice(albumIndex, 1);
            albumsDisplay.splice(albumDisplayIndex, 1);
            if (albums.length != albumsDisplay.length) {
                document.getElementsByClassName('load-button')[0].classList.remove(displayNone);
            }
            albumsDisplay.map(createTable);
        }
        closePopup('delete-album');
        closePopup('delete-progress');
    } catch (e) {
        console.log(e);
    }
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

