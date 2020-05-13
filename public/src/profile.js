
let firstNameSpan = document.getElementById("firstname-span");
let lastNameSpan = document.getElementById("lastname-span");
let emailSpan = document.getElementById("email-span");


createUser("randomannet", "passss", "andreas", "østny").then((value) => {
    getUser("randomannet", "passss").then((v) => {
        console.log(v.data)

        firstNameSpan.innerHTML = v.data.firstName;
        lastNameSpan.innerHTML = v.data.lastName;
        emailSpan.innerHTML = v.data.email;

    })
})