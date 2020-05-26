function login() {
    let email = document.getElementById("username-input").value;
    let password = document.getElementById("password-input").value;

    // Wait for feedback on login
    getUser(email, password).then((payLoad) => {
        if(payLoad.statusCode === 200) {
           window.location.href = "./profile.html";
        } else {
            alert(payLoad.status);
        }
    });
}

function register() {
    let name = document.getElementById("name-input").value;
    let surname = document.getElementById("surname-input").value;
    let email = document.getElementById("email-input");
    let password = document.getElementById("password-input");

    // Re-styling so it only shows uncorrect requirements
    let mailText = document.getElementById("email");
    mailText.innerText = "E-post";
    email.style.borderBottom = "3px solid #00957a";

    const passRequireText = document.getElementsByClassName("pass-require-text")[0];
    passRequireText.style.color = "Black";
    password.style.borderBottom = "3px solid #00957a";


    const regExpMail = /.*([a-zA-Z0-9]+)@([a-zA-Z\d]+).[a-z]{2,}/;
    const regExpPass = /.{8,}/;

    const mailMet = regExpMail.test(email.value);
    const passwordMet = regExpPass.test(password.value);

    // Only allow creation if mail and password meets requirements
    // Since this application at this state does not connect to DB there is no
    // hard requirements on password strength for users
    if(mailMet && passwordMet) {
        // Create user since all requirements were met
        createUser(email.value, password.value, name, surname).then((payLoad) => {
            if (payLoad.statusCode !== 200) {
                alert(payLoad.status);
            } else {
                window.location.href = "./profile.html";
            }
        });
    } else {
        if(!mailMet) {
            mailText.innerHTML = `E-post<span style="font-size: 1.5vh; color: red"> ikke gyldig (Eks: ola@nordmann.no)</span>`;
            email.style.borderBottom = "3px solid red";
        }
        if(!passwordMet) {
            password.style.borderBottom = "3px solid red";
            passRequireText.style.color = "red";
        }
    }
}