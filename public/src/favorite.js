function searchRoute(url) {
    //window.location.href = url //Redirect to the search
}

function removeFavorite(url) {
    event.stopPropagation();
    const user = JSON.parse(localStorage.getItem("user"));

    console.log(user)

    user.favorites.forEach(route => {
        if (route.url === url) {
            user.favorites.splice(user.favorites.indexOf(route), 1);

            updateUser(user.email, user.password, {favorites: user.favorites}).then(
                // Needs to wait on the promise from API that data was updated
                // on user before loading new layout. Otherwise layout
                // keeps deleted route
                () => {
                    loadFavoriteRoutes();
                }
            );
        }
    });
}

function loadFavoriteRoutes() {
    const info = document.getElementById("info-field")
    const list = document.getElementById("favorite-routes");
    const user = JSON.parse(localStorage.getItem("user"));

    list.innerHTML = "";

    if(user) {
        console.log(user.favorites)
        if (user.favorites.length > 0) {
            for (let item of user.favorites) {
                const url = item.url;
                const from = item.from;
                const fromName = from.indexOf(',') < 1 ? from : from.substring(0,from.indexOf(','))
                const fromArea = from.indexOf(',') < 1 ? "" : from.substring(from.indexOf(',') + 1)

                const to = item.to;
                const toName = to.indexOf(',') < 1 ? to : to.substring(0, to.indexOf(','))
                const toArea = to.indexOf(',') < 1 ? "" : to.substring(to.indexOf(',') + 1)

                let template = `
                    <div class="item" onclick="searchRoute('${url}')">
                        <div class="vs-container">
                            <div class="vs-ball"></div>
                            <div class="vs-line"></div>
                            <div class="vs-ball"></div>
                        </div>
                        <div class="route">
                            <div class="from-container">
                                <p class="name">${fromName}</p>
                                <p class="area">${fromArea}</p>
                            </div>                            
                            <div class="to-container">
                                <p class="name">${toName}</p>
                                <p class="area">${toArea}</p>
                            </div>
                        </div>
                        <div class="remove" onclick="removeFavorite('${url}')">
                            <svg class="rm-fav-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 463.47 464.2"><g class="fav" data-name="Favorite Star"><path class="star-icon" d="M124.71,430.84l24.06-140.26L46.87,191.26l140.82-20.47,63-127.6,63,127.6,140.82,20.47-77.89,75.93A114.28,114.28,0,0,0,232,374.46Z" transform="translate(-18.93 -13.82)"/></g><g class="rm-fav" data-name="Remove Favorite"><path class="minus-icon" d="M434.14,385a80,80,0,1,1-80-80A80,80,0,0,1,434.14,385ZM309,385H399.3" transform="translate(-18.93 -13.82)"/></g></svg>
                        </div>
                    </div>
                `

                list.innerHTML += template;
            }
        } else {
            const message = "Du har ingen reiser markert som favoritt"
            const infoMessage = "Legg til favoritter ved å trykke på stjerneikonet under rutesøk"

            const template = `
                <div class="msg-cont">
                    <p class="no-faves">${message}</p>
                </div>
            `
            info.innerText = infoMessage;
            list.innerHTML = template;
        }
    } else {
        const message = "Du er ikke logget inn"

        info.innerText = "";
        const template = `
            <div class="msg-cont">
                <p class="no-faves">${message}</p>
            </div>
            `

        list.innerHTML = template;
    }
}

loadFavoriteRoutes(); // Loads users favorite route on page render