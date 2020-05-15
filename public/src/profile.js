
let firstNameSpan = document.getElementById("firstname-span");
let lastNameSpan = document.getElementById("lastname-span");
let emailSpan = document.getElementById("email-span");

let email = "";
let password = "";

getUserInfo();

DisplayInfo(email, password);

function DisplayInfo(email, pass) {

    getUser(email, password).then((v) => {
        if (v.statusCode != 200) {
            window.location.href = "Login.html";
        }
        firstNameSpan.innerHTML = v.data.firstName;
        lastNameSpan.innerHTML = v.data.lastName;
        emailSpan.innerHTML = v.data.email;
    })
}

function getUserInfo() {
    let info = JSON.parse(localStorage.getItem("user"));

    email = info.email;
    password = info.password;
}

function logout() {
    localStorage.setItem("user", null);
    window.location.href = "index.html";
}
