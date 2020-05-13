//const notification = windows.createNotification({});

function login()
{
    let email = document.getElementById("username-input").value;
    //if(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
    //    alert("vennligst oppgi en gyldig epost!");
    //    return;
    //}

    let password = document.getElementById("password-input").value;

    getUser(email, password).then((payLoad) => {
        if(payLoad.statusCode == 200) {
           window.location.href = "./profile.html";
        }
        else {
            alert("kunne ikke logge inn!");
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
            /*
            notification({
                closeOnClick: true,
                displayCloseButton: false,
                positionClass: 'nfc-top-right',
                onclick: false,
                showDuration: 3500,
                theme: 'success',
                title: 'Feil!',
                message: 'Kunne ikke opprette profilen'
            });
             */
            alert("Kunne ikke logge inn");
        } else {
            window.location.href = "./profile.html";
        }
    })
}