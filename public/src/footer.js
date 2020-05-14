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
    window.location.href = "/favorite.html"
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
            <svg class="footer-img" data-name="Search Glass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 461.82 473.64"><defs><style>.cls-1{fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:25px;}</style></defs><path class="cls-1" d="M169.17,30.91A132.66,132.66,0,1,1,36.51,163.57,132.65,132.65,0,0,1,169.17,30.91Zm144.28,286-55.09-55.1m31.27,74.17L420.18,466.48c33.78,33.77,74.86-4.57,39.71-39.71L329.34,296.22Z" transform="translate(-24.01 -18.41)"/></svg>
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
