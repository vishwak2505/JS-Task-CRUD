async function jsonAddAlbum(album) { //pass the album object to perform the post request
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
            setTimeout(() => tag.value = '', 2000);
        } else if (tag.id == 'title' && tag.value != ''){
            album.title = tag.value.toLowerCase();
            flag++;
            setTimeout(() => tag.value = '', 2000);
        }         
    });

    if (flag == 2){
        document.getElementsByClassName('add-progress')[0].classList.remove(displayNone);
        jsonAddAlbum(album);
    } else {
        console.log('fill');
    }
}

function displayAlbum(album) { //pass the album object display the album contents
    let data = `<h4 class="view-id">ID: ${album.id}</h4>
                <h4 class="view-id">User ID: ${album.userId}</h4>
                <h4 class="view-title">Title: ${album.title}</h4>`;
    return data;  
}

async function profile(id) { //pass the album id to fetch the profile photo
    let response = await fetch(`https://jsonplaceholder.typicode.com/albums/${id}/photos`);
    let profile = await response.json();
    if (profile.length != 0){
        document.getElementsByClassName('profile-photo')[0].src = profile[0].thumbnailUrl;
    }
}

function viewUser(album) { //pass the album object display the album contents
    document.getElementsByClassName('profile-photo')[0].src = '../images/user-profile.webp';
    document.getElementsByClassName('view-album')[0].classList.remove(displayNone);
    document.getElementsByClassName('page')[0].classList.add(popup);
    profile(album.id);
    document.getElementsByClassName('album-content')[0].innerHTML = displayAlbum(album);    
}

function updateUser(album) { //pass the album object update the album contents
    currentId = album.id;
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

async function jsonUpdateAlbum(album) { //pass the album object to perform patch request
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
        if (tag.id == 'userID' && tag.value != '' && tag.value != album.userId){
            album.userId = +tag.value;
            flag = 1;
        } else if (tag.id == 'title' && tag.value != '' && tag.value != album.title){
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

function deleteUser(album) { //pass the album object delete the album
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