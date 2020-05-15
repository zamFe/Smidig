const title = document.getElementById("favourite-title");

function loadFavoriteRoutes() {
    const list = document.getElementById("favourite-routes");
    const user = JSON.parse(localStorage.getItem("user"));

    if(user) {

        for(let item of user.favorites) {
            const url = item.url;

            let listElement = document.createElement("div");
            listElement.className = "detail-box";

            // Route line div
            let routeLine = document.createElement("div");
            routeLine.className = "route-line";

            // Node creation 1 and 2
            let listNode1 = document.createElement("img");
            listNode1.className = "node-icon";
            listNode1.src = "../../res/img/icons/node.png";

            let listNode2 = document.createElement("img");
            listNode2.className = "node-icon";
            listNode2.src = "../../res/img/icons/node.png";

            // Line in the node
            let listLine = document.createElement("div");
            listLine.className = "line";

            // Appending destination line travel display
            routeLine.appendChild(listNode1)
            routeLine.appendChild(listLine)
            routeLine.appendChild(listNode2);
            listElement.appendChild(routeLine);


            // Destination div container
            let routeDetail = document.createElement("div");
            routeDetail.className = "route-detail";
            routeDetail.setAttribute("alt", url);


            // Destinations
            let listTitle = document.createElement("p");
            listTitle.addEventListener("click", () => {
                window.location = routeDetail.getAttribute("alt");
            });

            listTitle.innerHTML = `Fra: <b>${item.from}</b> <br><br> Til: <b>${item.to}</b>`;
            routeDetail.appendChild(listTitle);

            listElement.appendChild(routeDetail);

            // Delete button
            const delImage = document.createElement("div");
            delImage.className = "delete-icon";
            delImage.innerHTML =
                "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 463.47 464.2\">\n" +
                "    <g id=\"Layer_1\" data-name=\"Layer 1\">\n" +
                "        <path class=\"cls-1\" d=\"M124.71,430.84l24.06-140.26L46.87,191.26l140.82-20.47,63-127.6,63,127.6,140.82,20.47-77.89,75.93A114.28,114.28,0,0,0,232,374.46Z\" transform=\"translate(-18.93 -13.82)\"/>\n" +
                "    </g>\n" +
                "    <g id=\"Layer_2\" data-name=\"Layer 2\">\n" +
                "        <path class=\"cls-2\" d=\"M434.14,385a80,80,0,1,1-80-80A80,80,0,0,1,434.14,385ZM309,385H399.3\" transform=\"translate(-18.93 -13.82)\"/>\n" +
                "    </g>\n" +
                "</svg>";
            delImage.addEventListener("click", () => {
                user.favorites.forEach(route => {
                    if(route.url === url) {
                        user.favorites.splice(user.favorites.indexOf(route), 1);

                        while(list.firstChild) { // Removes each Route element
                            list.removeChild(list.firstChild);
                        }
                         updateUser(user.email, user.password, {favorites: user.favorites}).then(
                         // Needs to wait on the promise from API that data was updated
                         // on user before loading new layout. Otherwise layout
                         // keeps deleted route
                             () => { loadFavoriteRoutes(); }
                         );
                    }
                });
            });


            listElement.appendChild(delImage);

            // Appending to parent div
            list.appendChild(listElement)

        }
    } else {
        title.innerText = "Du har ingen i favoritter";
    }
    console.log(user)
}

loadFavoriteRoutes();