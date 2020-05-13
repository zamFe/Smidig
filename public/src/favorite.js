const title = document.getElementById("favourite-title");

function loadFavoriteRoutes () {
    const list = document.getElementById("favourite-routes");
    const user = JSON.parse(localStorage.getItem("user"));

    if(user) {
        const routes = user.favorites;
        for(let item of routes) {
            let listElement = document.createElement("div");

            let listTitle = document.createElement("p");
            listTitle.addEventListener("click", () => {
                alert("Clicked on destination")
            });

            listTitle.innerText = `${item.from} ⮞ ${item.to}`;
            listElement.appendChild(listTitle);

            const delImage = document.createElement("img");
            delImage.src = "res/img/icons/redx.png";
            delImage.addEventListener("click", () => {
                alert("You wanna remove me?");
            });
            listElement.appendChild(delImage);
        }
    } else {
        title.innerText = "Du har ingen i favoritter";
    }

}

loadFavoriteRoutes();