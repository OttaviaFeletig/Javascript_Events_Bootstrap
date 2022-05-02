// let inputSearch = document.querySelector(".search-bar").value
// let url = `https://pixabay.com/api/?key=26639219-c988cadef2f5d334da840ad52&q=roses&per_page=51`;
let key = "26639219-c988cadef2f5d334da840ad52"
let url = "https://pixabay.com/api/?key=26639219-c988cadef2f5d334da840ad52"
let auth = url
console.log(url);
// const url = 'https://communityoneapi.herokuapp.com/projects';

async function getData(url) {
const response = await fetch(url);
const data = await response.json();
return data;
}

async function handleInitialLoad() {
    const data = await getData(url);
    setState(data);

    const userNames = getUserNames(getState());
    selectAuthorDOM(userNames);
    const imageType = getImageType(getState());
    selectImageTypeDOM(imageType);

    insertImagesDOM(getState());
}

const imgContainer = document.querySelector("#api-data");
// const searchField = document.querySelector(".search-bar");
const selectAuthor = document.querySelector(".select-author");
const selectType = document.querySelector(".select-type");
const launchModal = document.querySelector(".modal-content")

window.addEventListener("DOMContentLoaded", handleInitialLoad);
// searchField.addEventListener("keyup", handleSearchInputChange);
selectAuthor.addEventListener("change", handleSelectAuthor);
selectType.addEventListener("change", handleSelectType);


function useState() {
let _state = null;
function getState() {return _state;}
function setState(data) {_state = [...data.hits];}
return [getState, setState];
}

const [getState, setState] = useState();




function cardTemplate(data) { //create function that return the html
    const { hits, id, user, likes, views, webformatURL, userImageURL } = data;
    return `
    <div class="col-sm-4 mb-4">
        <div class="card" id="${data.id}">
            <a id="img-link" 
            href="#exampleModal" 
            data-bs-toggle="modal" 
            data-bs-target="#exampleModal"
            onclick="insertModalDOM(getState(), ${data.id})">
                <span class="badge rounded-pill bg-dark views"><i class="fa fa-eye"> </i> ${data.views}</span>
                <span class="badge rounded-pill bg-dark likes"><i class="fa fa-heart"> </i> ${data.likes}</span>
                <img class="card-img-top" src="${data.webformatURL}" alt="${data.user}">
                <div class="overlay"><i class="fa fa-plus"></i></div>
            </a>
        </div>
    </div>`;
}

function modalTemplate(data) { //create function that return the html
    const { id, user, tags, webformatURL, userImageURL, } = data;
    return `
        <div id="myModalContent" class="modal-header"><img src="${data.userImageURL}">
            <h5>${data.user}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="myModalBody" class="modal-body">
            
            <img src="${data.webformatURL}" width="100%" class="modal-image">

            <div class="img-overlay">
            <a class="btn btn-light btn-sm" href="${data.pageURL}" role="button" target="_blank"><i class="fa fa-link"></i> Visit Profile</a>
            <a class="btn btn-light btn-sm" href="${data.largeImageURL}" role="button" target="_blank"><i class="fa fa-download"></i> Download</a>
    
            
            <div id="myModalTags">
            <div class="tags"><p><i class="fa fa-heart"></i> ${data.likes}</p></div>
            <div class="tags"><p><i class="fa fa-tag"></i> ${data.tags}</p></div>
            </div>
            </div>
            
        </div>`;
}

//
function insertImagesDOM(data) {
    // console.log(data);
    let images = data.map((item) => cardTemplate(item)).join('');
    // console.log(images);
    imgContainer.innerHTML = images;
}

//
function insertModalDOM(data, e) {
    let imageId = e;
    console.log(imageId);
    data.forEach((item) => {
        if (item.id === imageId) {
            let images = modalTemplate(item)
            launchModal.innerHTML = images;
        } 
    });
}


// GET USER NAMES FROM DATA
function getUserNames(data) {
    const authors = data.map((item) => item.user);
    const uniqAuthor = [...new Set(authors)];
    return uniqAuthor;
}
// GET IMAGE TYPE FROM DATA
function getImageType(data) {
    //con map hacemos loop a traés de data y agarramos el type 
    const types = data.map((item) => item.type);
    const uniqTypes = [...new Set(types)];
    return uniqTypes;
}


//la funcción recibe un elemento que viene desde un input y se recibe en "e"
function handleSearchInputChange(e) {
    const value = e.target.value.toLowerCase(); //guardo en "value" la búsqueda del input recibida en "e"
    const data = getState(); //guardo en "data" los datos recibidos en api usando getState
    //recorremos todos los "item" de "user" y con includes comparamos el "value" que recibe el input en "e"
    const filteredItems = data.filter((item) => 
        item.user.toLowerCase().includes(value)
    );
    insertImagesDOM(filteredItems);
}



// Selects: CREAMOS LA LÓGICA QUE RECORRERÁ "data" 
function handleSelectAuthor(e) {
const value = e.currentTarget.value.toLowerCase();
const data = getState();
    const filteredItems = data.filter((item) => // recorremos y filtramos los "item" desde "data"
    //creamos la condición, si "value" = a all, muestra todo, sino de todos los "items" muestrame el user que coincida con "value"
    value.toLowerCase() === 'all' ? item : item.user.toLowerCase() === value.toLowerCase()
    );
    insertImagesDOM(filteredItems);
}



//selects: CREAMOS LA ESTRUCTURA HTML PARA CADA ELEMENTO SELECT
function selectAuthorDOM(data) {
    let author = ['<option selected value="all">All Authors</option>'];
    data.forEach((item) => {
        author.push(`<option value="${item}">${item}</option>`);
    });
    selectAuthor.innerHTML = author.join('');
}

// Selects: CREAMOS LA LÓGICA QUE RECORRERÁ "data" 
function handleSelectType(e) {
const value = e.currentTarget.value.toLowerCase(); //lo que se escribe, lo paso a minúscula
const data = getState(); //guardo los datos en data llamando a la función getState
const filteredItems = data.filter((item) =>
value.toLowerCase() === 'all'? item: item.type.toLowerCase() === value.toLowerCase()
);
insertImagesDOM(filteredItems);
}
//selects: CREAMOS LA ESTRUCTURA HTML PARA CADA ELEMENTO SELECT
function selectImageTypeDOM(data) {
    let imageType = ['<option selected value="all">All Types</option>'];
    data.forEach((item) => {
        imageType.push(`<option value="${item}">${item}</option>`);
    });
    selectType.innerHTML = imageType.join('');
}



// function useState() {
// let _state = null;
// function getState() {return _state;}
//     function setState(data) {
//         _state = [...data.hits];
//     }
// return [getState, setState];
// }

// const [getState, setState] = useState();



function radioOrientacion() {
    let numOrientations = document.getElementsByName('flexRadioDefault');
    let result = "all";
    for (let i = 0; i < numOrientations.length; i++) {
        result = document.querySelector('input[name="flexRadioDefault"]:checked').value;   
    }
    console.log(result);
    return result
}


function checkColor() {
    let colorSelected = document.getElementsByName('color');
    let checked = []
    console.log(colorSelected);
    for (let i = 0; i < colorSelected.length; i++) {
        if (colorSelected[i].checked) {
            checked.push(colorSelected[i].value)
        }
        var checkedColors = checked.join(',')   
    }
    // console.log(checkedColors)
    return checkedColors
}


function checkLabel() {
    // let colorSelected = document.getElementsByName('color').value;
    let colorSelected = document.getElementsByName('color');
    let label = document.getElementsByClassName('color-select');
    let checked = []
    console.log(colorSelected);
    for (let i = 0; i < colorSelected.length; i++) {
        if (colorSelected[i].checked == true) {
            label[i].classList.add("checked")
            colorSelected[i].classList.add("checked")
            console.log("hola");
        } else {
            label[i].classList.remove("checked")
            colorSelected[i].classList.remove("checked")
        }
        // console.log(checkedColors)
    }
}




let currentPage = 1
let totalPages = 0

let searchImage = async () => {
    
    let input = document.querySelector("#buscar").value

    let inputWithSpaces = input.replace(/ /g, '+');

    if (input === "") {
        mostrarError("#msg-error", "Please, type a searh term")
        return;
    }

    let orienta = radioOrientacion()
    let color = checkColor()
    console.log(color);

    let imgType = document.querySelector("#imageType").value
    let imagesPerPage = 9
    let query = `&q=${inputWithSpaces}&colors=${color}&image_type=${imgType}&orientation=${orienta}&per_page=${imagesPerPage}&page=${currentPage}`
    let url = (auth + query)
    console.log(url)

    let response = await fetch(url)
    let data = await response.json();
    setState(data)
    

    const images = getState();
    // let images = data.hits
    // console.log(images)
    getUserNames(images)
    let imagesHTML = images.map((item) => cardTemplate(item)).join('');


    const userNames = getUserNames(getState());
    selectAuthorDOM(userNames);
    const imageType = getImageType(getState());
    selectImageTypeDOM(imageType);


    divListadoImagenes = document.getElementById("api-data")
    divListadoImagenes.innerHTML = imagesHTML

    totalPages=(data.hits/imagesPerPage)
    let divPagination = document.querySelector("#pagination")

    let pagPrev = (currentPage === 1)?`<li class="page-item disabled"><a class="page-link" href="#prev" onclick="pagPrev()"><< Prev</a></li>`:`<li class="page-item"><a class="page-link" href="#prev" onclick="pagPrev()"><< Prev</a></li>`

    let pagNext = (currentPage === totalPages)?`<li class="page-item disabled"><a class="page-link" href="#prev" onclick="pagNext()">Next >></a></li>`:`<li class="page-item"><a class="page-link" href="#prev" onclick="pagNext()">Next >></a></li>`

    divPagination.innerHTML = `${pagPrev} ${pagNext}`
}











const pagPrev = () => {
    
    if (currentPage === 1) {
        return
    } else {
        currentPage--;
        searchImage();
    }
}
const pagNext = () => {
    
    if (currentPage>totalPages) {
        return
    } else {
        currentPage++
        searchImage();
    }
}


const mostrarError = (element, message) => {
    divError = document.querySelector(element)
    divError.innerHTML = `<div class="alert alert-danger d-flex justify-content-center mt-4 w-50" role="alert">${message}</div>`
    setTimeout(() => { divError.innerHTML = ``;}, 2000)
}