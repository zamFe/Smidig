let firstNameSpan = document.getElementById("firstname-span");
let lastNameSpan = document.getElementById("lastname-span");
let emailSpan = document.getElementById("email-span");


function getUserInfo() {
    let info = JSON.parse(localStorage.getItem("user"));

    const email = info.email;
    const password = info.password;
    DisplayInfo(email, password);
}

function DisplayInfo(email, password) {

    getUser(email, password).then((v) => {
        if (v.statusCode != 200) {
            window.location.href = "Login.html";
        }
        firstNameSpan.innerText = v.data.firstName;
        lastNameSpan.innerText = v.data.lastName;
        emailSpan.innerText = v.data.email;
    })
}

function logout() {
    localStorage.setItem("user", null);
    window.location.href = "index.html";
}

getUserInfo();