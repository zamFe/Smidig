const nameElem = document.getElementById("full-name")
const emailElem = document.getElementById("email");
const clearHistoryElem = document.getElementById("clear-history-btn");


function getUserInfo() {
    let info = JSON.parse(localStorage.getItem("user"));

    const email = info.email;
    const password = info.password;
    displayInfo(email, password);
}

function checkHistory() {
    if(!localStorage.getItem("history")) {
        clearHistoryElem.style.opacity = "0.3";
        clearHistoryElem.style.pointerEvents = "none";
    }
}

function clearSearchHistory() {
    localStorage.removeItem("history")
    clearHistoryElem.style.opacity = "0.3";
    clearHistoryElem.style.pointerEvents = "none";
}

function displayInfo(email, password) {

    getUser(email, password).then((v) => {
        if (v.statusCode != 200) {
            localStorage.removeItem("user");
            window.location.href = "login.html";
        }
        nameElem.innerText = `${v.data.firstName} ${v.data.lastName}`;
        emailElem.innerText = v.data.email;
    })
}

function logout() {
    localStorage.setItem("user", null);
    window.location.href = "index.html";
}

getUserInfo();
checkHistory();