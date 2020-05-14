const title = document.getElementById("favourite-title");

function loadFavoriteRoutes () {
    const list = document.getElementById("favourite-routes");
    const user = JSON.parse(localStorage.getItem("user"));

    if(user) {
        const routes = user.favorites;
        for(let item of routes) {
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


            // Destinations
            let listTitle = document.createElement("p");
            listTitle.addEventListener("click", () => {
                alert("Clicked on destination")
            });

            listTitle.innerText = `Fra: ${item.from} \n\n Til: ${item.to}`;
            routeDetail.appendChild(listTitle);
            routeDetail.setAttribute("alt", item.url);

            listElement.appendChild(routeDetail);

            // Delete button
            const delImage = document.createElement("img");
            delImage.className = "delete-icon";
            delImage.src = "res/img/icons/redx.png";
            delImage.addEventListener("click", () => {
                alert("You wanna remove me?");
            });


            listElement.appendChild(delImage);

            // Appending to parent div
            list.appendChild(listElement)

        }
    } else {
        title.innerText = "Du har ingen i favoritter";
    }

}

loadFavoriteRoutes();