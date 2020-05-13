const parent = document.getElementById("footer");

let currentURL = window.location.pathname;
console.log(currentURL.substring(0, currentURL.lastIndexOf('.')));

let isSearchActive = false;
let isFavoriteActive = false;
let isLoginActive = false;
let isProfileActive = false;

//Assings currently active site. Defaults to search if no others are met
switch (currentURL.substring(0, currentURL.lastIndexOf('.'))) {
    case "/favorite": isFavoriteActive = true; break;
    case "/profile": isProfileActive = true; break;
    case "/login":
    case "/register": isLoginActive = true; break;
    default: isSearchActive = true; break;
}

function redirectToSearch() {
    window.location.href = "/"
}

function redirectToLogin() {
    window.location.href = "/login.html"
}

function redirectToFavorites() {
    window.location.href = "/favourites.html"
}

function redirectToProfile() {
    window.location.href = "/profile.html"
}

const loggedIn = `
    <div class="nav-container">
        <div class="nav-option ${isSearchActive ? "active-option" : ""}" onclick="redirectToSearch()">
            <img class="footer-img" src="res/img/icons/routeSearch.png" alt="Gå til reisesøk">
            <span class="footer-text"></span>
        </div>
        <div class="nav-option ${isFavoriteActive ? "active-option" : ""}" onclick="redirectToFavorites()">
            <img class="footer-img" src="res/img/icons/starFooter.png" alt="Gå til favoritter">
            <span class="footer-text"></span>
        </div>
        <div class="nav-option ${isProfileActive ? "active-option" : ""}" onclick="redirectToProfile()">
            <img class="footer-img" src="res/img/icons/profilFooter.png" alt="Gå til profil">
            <span class="footer-text"></span>
        </div>
    </div>
`

const loggedOut = `
    <div class="nav-container">
        <div class="nav-option ${isSearchActive ? "active-option" : ""}" onclick="redirectToSearch()">
            <img class="footer-img" src="res/img/icons/routeSearch.png" alt="Gå til reisesøk">
            <span class="footer-text"></span>
        </div>
        <div class="nav-option ${isLoginActive ? "active-option" : ""}" onclick="redirectToLogin()">
            <span class="footer-text">Logg Inn</span>
        </div>
    </div>
`

const userIsLoggedIn = JSON.parse(localStorage.getItem("user"));

if(userIsLoggedIn) {
    parent.innerHTML = loggedIn
} else {
    parent.innerHTML = loggedOut
}
