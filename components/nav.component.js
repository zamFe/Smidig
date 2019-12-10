// Create a div with ID #nav to implement the nav-bar component
let container = document.getElementById("nav");

let template = `
    <div class="nav-container">
        <div class="nav-travel">
            <p>Reise</p>
        </div>
        <div class="nav-favorites">
            <p>Favoritter</p>
        </div>
        <div class="nav-profile">
            <p>Profil</p>
        </div>
    </div>
`

container.innerHTML = template;