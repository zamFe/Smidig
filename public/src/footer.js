const parent = document.getElementById("footer");

let currentURL = window.location.pathname;

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
            <svg class="footer-img" data-name="Search Glass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 461.82 473.64">
                <path class="icon" d="M169.17,30.91A132.66,132.66,0,1,1,36.51,163.57,132.65,132.65,0,0,1,169.17,30.91Zm144.28,286-55.09-55.1m31.27,74.17L420.18,466.48c33.78,33.77,74.86-4.57,39.71-39.71L329.34,296.22Z" transform="translate(-24.01 -18.41)"/>
            </svg>
            <span class="footer-text">Rutesøk</span>
        </div>
        <div class="nav-option ${isFavoriteActive ? "active-option" : ""}" onclick="redirectToFavorites()">
            <svg class="footer-img" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500.49 476">
                <path class="icon" d="M250,35.47l69.69,141.22,155.84,22.64L362.77,309.25l26.62,155.21L250,391.18,110.61,464.46l26.62-155.21L24.47,199.33l155.84-22.64Z" transform="translate(0.25 -9.49)"/>
            </svg>            
            <span class="footer-text">Favoritter</span>
        </div>
        <div class="nav-option ${isProfileActive ? "active-option" : ""}" onclick="redirectToProfile()">
            <svg class="footer-img" data-name="Profile Icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 470.87 413.15">
                <path class="icon" d="M337.17,304.53c36.34-26,60-68.19,60-115.77,0-79.06-65.22-143.16-145.68-143.16S105.77,109.7,105.77,188.76c0,48,24,90.39,60.82,116.37-108,33.15-130,123.63-130,123.63H469.22S446.88,337.16,337.17,304.53Z" transform="translate(-17.45 -30.6)"/>
             </svg>
             <span class="footer-text">Profil</span>
        </div>
    </div>
`

const loggedOut = `
    <div class="nav-container">
        <div class="nav-option ${isSearchActive ? "active-option" : ""}" onclick="redirectToSearch()">
            <svg class="footer-img" data-name="Search Glass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 461.82 473.64"><path class="icon" d="M169.17,30.91A132.66,132.66,0,1,1,36.51,163.57,132.65,132.65,0,0,1,169.17,30.91Zm144.28,286-55.09-55.1m31.27,74.17L420.18,466.48c33.78,33.77,74.86-4.57,39.71-39.71L329.34,296.22Z" transform="translate(-24.01 -18.41)"/></svg>
            <span class="footer-text">Rutesøk</span>
        </div>
        <div class="nav-option ${isLoginActive ? "active-option" : ""}" onclick="redirectToLogin()">
            <span class="login-text">Logg Inn</span>
        </div>
    </div>
`

const userIsLoggedIn = JSON.parse(localStorage.getItem("user"));

if(userIsLoggedIn) {
    parent.innerHTML = loggedIn
} else {
    parent.innerHTML = loggedOut
}