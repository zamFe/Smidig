
let firstNameSpan = document.getElementById("firstname-span");
let lastNameSpan = document.getElementById("lastname-span");
let emailSpan = document.getElementById("email-span");

let email = "";
let password = "";

getUserInfo();

console.log(email);
console.log(password);

DisplayInfo(email, password);

/*
createUser("randomannet", "passss", "andreas", "østny").then((value) => {
    getUser("randomannet", "passss").then((v) => {
        console.log(v.data)

        firstNameSpan.innerHTML = v.data.firstName;
        lastNameSpan.innerHTML = v.data.lastName;
        emailSpan.innerHTML = v.data.email;

    })
})
 */

function DisplayInfo(email, pass) {

    console.log(email + ", " + pass);

    getUser(email, password).then((v) => {
        if (v.statusCode != 200) {
            alert("Feil brukernavn eller passord");
            window.location.href = "Login.html";
        }
        console.log(v);
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
    alert("Trykket på logg ut knappen");

    localStorage.setItem("user", null);
    window.location.href = "index.html";
}
