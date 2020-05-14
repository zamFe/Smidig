function login()
{
    let email = document.getElementById("username-input").value;

    let password = document.getElementById("password-input").value;

    getUser(email, password).then((payLoad) => {
        if(payLoad.statusCode == 200) {
           window.location.href = "./profile.html";
        }
        else {
            alert(payLoad.status);
        }
    })
}

function register()
{
    let name = document.getElementById("name-input").value;
    let surname = document.getElementById("surname-input").value;
    let email = document.getElementById("email-input").value;
    let password = document.getElementById("password-input").value;

    createUser(email, password, name, surname).then((payLoad) => {
        if (payLoad.statusCode != 200) {
            alert(payLoad.status);
        } else {
            window.location.href = "./profile.html";
        }
    })
}