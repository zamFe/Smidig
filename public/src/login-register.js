

function login()
{
}

function register()
{
    let name = document.getElementById("name-input");
    let surname = document.getElementById("surname-input");
    let email = document.getElementById("email-input");
    let password = document.getElementById("password-input");

    createUser(email, password, name, surname).then((payLoad) => {
        if(payLoad.statusCode != 200) {

        }
    })
}