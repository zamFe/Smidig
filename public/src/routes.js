// Global page element variables
const container = document.getElementById("routes-result-container");
const favStar = document.getElementById("favorite-star");
const star = document.getElementsByClassName("star-fav")[0];

let activeFilter = "(0.1, 0.1 ,0.1 ,2.0)" //Default to convenience

//Redirects to index if there are no query params.
if(window.location.href.indexOf('?') === -1) {
    window.location.href = `/`
}

// Sets the from and to names and adds eventlistener to the swap button
function setFromAndTo() {
    let from;

    if(urlParams.get("fromname").lastIndexOf(',') < 0) {
        from = urlParams.get("fromname")
    } else {
        from = urlParams.get("fromname").substring(0, urlParams.get("fromname").lastIndexOf(','))
    }

    const titleFrom = document.getElementById("title-from");
    titleFrom.innerHTML = `${from}`

    let to;
    if(urlParams.get("toname").lastIndexOf(',') < 0) {
        to = urlParams.get("toname");
    } else {
        to = urlParams.get("toname").substring(0, urlParams.get("toname").lastIndexOf(','))

    }
    const titleTo = document.getElementById("title-to");
    titleTo.innerHTML = `${to}`
}
const swapRouteButton = document.getElementById('swap-from-to');
swapRouteButton.addEventListener('click', e => {
    let from = urlParams.get('to');
    let fromName = urlParams.get('toname');
    let to = urlParams.get('from');
    let toName = urlParams.get('fromname');
    let datetime = urlParams.get('datetime');
    window.location = `../routes.html?from=${from}&to=${to}&fromname=${fromName}&toname=${toName}&datetime=${datetime}`;
});

/*
* DATA CONVERSION SECTION:
* These functions deal with converting data like time and months to proper values
*/
function convertTime(time) {
    let date = new Date(time*1000);
    let convertedTime = `${date.getHours()}:${('0'+date.getMinutes()).slice(-2)}`

    if(date.getHours() < 10) {
        convertedTime = '0' + `${date.getHours()}:${('0'+date.getMinutes()).slice(-2)}`
    }
    return convertedTime;
}
function convertMonthToMonthname(monthIndex) {
    switch (monthIndex) {
        case 0: return "Januar";
        case 1: return "Februar";
        case 2: return "Mars";
        case 3: return "April";
        case 4: return "Mai";
        case 5: return "Juni";
        case 6: return "Juli";
        case 7: return "August";
        case 8: return "September";
        case 9: return "Oktober";
        case 10: return "November";
        case 11: return "Desember";
        default: return "Error: Undefined month"
    }
}
function secondsToTime(end, start) {
    let time = end - start;
    let hour = Math.floor(time / 3600);
    let min = Math.ceil(time % 3600 / 60);
    let convTime = "";

    if (hour !== 0) {
        convTime += `${hour} timer `;
    }
    convTime += min + " min";
    return convTime;
}


/*
*  FAVORITES SECTION:
*  This part of the code handles userdata and favorites
 */
// Retrieves user information from Localstorage
function retrieveUser() {
    return JSON.parse(localStorage.getItem("user"));
}
// Fetches URL params and creates route object for user
function getCurrentRoute() {
    const url = window.location.search;

    return {
        from: urlParams.get("fromname"),
        to: urlParams.get("toname"),
        url: `date-time.html${url}`
    };
}
// Renders star in if user is logged in for adding a favorite route
function checkUserAndStarData() {
    const user = retrieveUser();

    if(user) {
        favStar.style.visibility = "visible";
        checkIfRouteInFavorite(user);
    } else {
        favStar.style.visibility = "hidden";
    }
}
function checkIfRouteInFavorite(user) {
    const newRoute = getCurrentRoute();

    if(user.favorites.length > 0) {
        user.favorites.forEach(favRoute => {
            if(favRoute.from === newRoute.from && favRoute.to === newRoute.to) {
                star.classList.add("star-fav-active")
                star.classList.remove("star-fav-default")
            } else {
                star.classList.remove("star-fav-active")
                star.classList.add("star-fav-default")
            }
        });
    } else {
        star.classList.remove("star-fav-active")
        star.classList.add("star-fav-default")
    }

}
// Check whether to add or remove from favorite list on user
favStar.addEventListener("click", event => {

    const user = retrieveUser();
    const newRoute = getCurrentRoute();

    // Exception if no other favorite route has been added
    if(user.favorites.length === 0) {
        user.favorites.push(newRoute);
        star.classList.add("star-fav-active")
        star.classList.remove("star-fav-default")
        updateUser(user.email, user.password, {favorites: user.favorites});
        return;
    }


    for(let i = 0; i < user.favorites.length; i++) {
        if(user.favorites[i].from === newRoute.from && user.favorites[i].to === newRoute.to) {
            user.favorites.splice(user.favorites.indexOf(user.favorites[i]), 1) // Find route and remove
            star.classList.remove("star-fav-active")
            star.classList.add("star-fav-default")
        }


        if(i+1 === user.favorites.length) {
            star.classList.add("star-fav-active")
            star.classList.remove("star-fav-default")
            user.favorites.push(newRoute);
            updateUser(user.email, user.password, {favorites: user.favorites})
            break;
        }
    }
    updateUser(user.email, user.password, {favorites: user.favorites});
});


/*
* SMALL DETAIL GETTERS
* These functions retrieve small pieces of information necessary for rendering
* such as classes for individual nodes, action SVGs or status of routes.
 */

function getServiceClasses(operator) {
    switch(operator) {
        case "Vy" : return "vy-service"
        case "Nobina Norge AS" :
        case "Sporveien T-banen AS" : return "sporveien-service"
        case "Unibuss AS": //return "unibuss-service"
        case "Ruter" : return "ruter-service"
        default: return "walk-time"
    }
}

function getActionSVG(action) {
    const walk = `<svg class="walk-svg svg" data-name="Walk" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300.52 460.41"><path class="walk action-icon" d="M210.2,191.89c-4.45,2.54-8.53,4.85-12.6,7.18q-15.75,9-31.47,18.05a5.7,5.7,0,0,0-2.16,2.4q-12.27,27.25-24.38,54.59c-1.44,3.27-2.56,6.64-5,9.37A20,20,0,0,1,101.43,262c5.47-12.45,10.82-24.94,16.18-37.44q6.81-15.9,13.5-31.85a21.61,21.61,0,0,1,8.37-9.88c22.35-14.61,44.73-29.17,67-43.93,5.77-3.83,11.6-7.21,18.52-8.32a39.87,39.87,0,0,1,6-.61c8.52-.06,17.06-.22,25.58,0,21.78.65,37.78,21.88,32.53,43q-14,56.55-28.15,113.08a9.07,9.07,0,0,0,1.08,7.53q17.47,29.31,34.6,58.83c1.13,1.94,1.47,4.37,2,6.61q9.27,41.66,18.5,83.31c.73,3.28,2.22,6.42,2.73,9.72,2,13.14-7.88,26.08-21.1,27.81-14.89,1.95-27.45-8.54-28.77-23.51-.47-5.38-2.15-10.66-3.33-16q-7.47-33.68-15-67.32a7.8,7.8,0,0,0-1.66-3.46Q228,345.87,206,322.18c-2.73-2.93-5.94-5.48-8.29-8.67-7.1-9.66-9.3-20.41-6.68-32.23,4.63-20.92,9.06-41.88,13.58-62.83q2.63-12.12,5.23-24.25C209.93,193.6,210,193,210.2,191.89ZM184.29,329.27c-.14.53-.3,1.06-.41,1.6-2.89,14.44-5.75,28.88-8.68,43.31a7.66,7.66,0,0,1-1.36,3q-14,18.09-28,36.11c-6.82,8.74-13.65,17.48-20.57,26.15a25,25,0,0,0,33.26,36.6c4-2.62,6.57-6.48,9.39-10.15q23.65-30.8,47.26-61.62a8.26,8.26,0,0,0,1.39-2.82c2.69-9.91,5.28-19.86,8-29.76a3.34,3.34,0,0,0-1-3.78q-17.53-17.31-34.92-34.77c-1.36-1.35-2.51-2.92-3.75-4.39ZM320.08,64.17a45.09,45.09,0,0,0-90.18,1.17c.35,24.79,20.77,44.87,45.3,44.53A45.06,45.06,0,0,0,320.08,64.17ZM308.92,174.78q-5.48,22.46-11.05,44.87a3.5,3.5,0,0,0,1,3.67c5.49,5.94,10.87,12,16.35,17.91a5.64,5.64,0,0,0,2.44,1.55q28.61,8.29,57.23,16.46a19.78,19.78,0,0,0,5.56.75c10.28-.15,18.3-7.5,19.69-17.91,1.24-9.22-5.11-18.57-14.53-21.34-15.68-4.61-31.37-9.19-47-13.86a5.68,5.68,0,0,1-2.76-2c-7.9-11.06-15.72-22.19-23.57-33.29-.67-.95-1.39-1.86-2.23-3C309.59,170.89,309.38,172.87,308.92,174.78Z" transform="translate(-99.74 -19.79)"/></svg>`
    const train = `<svg class="train-svg svg" data-name="Train" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490.71 316.62"><path class="train action-icon" d="M477.28,252.19Q427.62,201.71,377.14,152c-25.54-25.17-56.68-37.24-92.47-37.26q-139.37-.06-278.75,0v66.74c11.11,0,21.89-.09,32.66,0,10,.11,17.11,7.13,17.15,17.16q.15,32.92,0,65.85c-.93,26.09-33,15.06-50,17.84v83.14c146-1.48,292.55,2.9,438.36-1.68C494.1,354.77,514.69,286.78,477.28,252.19ZM256.53,263.42c0,12-6.74,18.61-18.86,18.62q-65,0-130.09,0c-11.74,0-18.5-6.75-18.52-18.44q0-31.86,0-63.73c0-11.64,6.82-18.35,18.6-18.36q65.06,0,130.09,0c12.1,0,18.77,6.65,18.78,18.71Q256.58,231.81,256.53,263.42Zm178.6,8.35c-3,7.17-8.83,10.34-16.61,10.31-18.29-.09-36.58,0-54.87,0-18.46,0-36.93,0-55.4,0-11.68,0-18.4-6.79-18.41-18.55,3.46-79.59-18.62-84.33,55.83-82a32.43,32.43,0,0,1,23.94,9.87Q400.29,222,431,252.69C436.47,258.2,438.16,264.61,435.13,271.77Z" transform="translate(-5.77 -114.76)"/><path class="train action-icon" d="M289.83,387.06c15.91,65.6,99.47,52.38,100-4.87H190.49C189.77,441.07,280.08,450,289.83,387.06Z" transform="translate(-5.77 -114.76)"/><path class="train action-icon" d="M105.4,382.71H5.92C5.2,447.7,106.34,447.51,105.4,382.71Z" transform="translate(-5.77 -114.76)"/></svg>`;
    const bus = `<svg class="bus-svg svg" data-name="Bus" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 484.99 246.28"><path class="bus action-icon" d="M7.68,174A117.33,117.33,0,0,1,10.21,153c2.89-14.6,12-23.21,27.23-24.9a184.3,184.3,0,0,1,20.06-1.23q176.43-.1,352.87,0c40.09,0,57.45,12,69.5,49.84,14.72,46.15,13.74,93.67,11,141.2-.62,10.64-7.32,15.84-18.16,15.89-10.56,0-21.14.49-31.67,0-7.69-.37-11.81,2-15.33,9.2-9.6,19.52-26.13,29.56-48.43,29.22-21.61-.32-37.83-10.1-46.95-29.27-3.49-7.32-7.83-9-15.38-9-39.85.35-79.7.48-119.54.06-8.83-.09-13.24,2.54-17.45,10.44-17.88,33.53-66.09,39.41-87.16,8.36-11.85-17.46-24.47-20-42.1-18.61a183.19,183.19,0,0,1-20.16,0C13,333.76,7.79,328.8,7.64,313.66c-.24-24-.06-48-.07-72C7.56,219.11,7.37,196.53,7.68,174Zm343.93,37.31c45.89,6.91,70.9,49,113.7,68.36,1.38-39.32,2-74.24-12.49-107.53-7-16.18-18.72-25-37.86-24.19-20.52.91-41.12.21-63.35.21ZM43.86,148.9c-4.47.19-11.74,6.49-12.38,10.75-2.17,14.28-2.33,28.91-2.2,43.39,0,2.46,5.26,6.93,8.16,7,26.75.54,53.51.32,81.3.32V148.4C93.42,148.4,68.6,147.85,43.86,148.9Zm283.75.27H247.39v60.17h80.22Zm-174.69-1c-2.81,0-5.61.35-9.55.6v60.75h79.51V148.12C198.79,148.12,175.86,148.1,152.92,148.14Zm7.84,171.77c-.25-16.18-14.33-29.61-30.52-29.1-15.64.48-29.09,13.84-29.38,29.18-.31,15.86,13.6,29.36,30.2,29.31C148.17,349.26,161,336.55,160.76,319.91Zm247.3-.45c-.57-15.39-14.32-28.58-29.87-28.67C362,290.7,347.87,304.6,348,320.47c.08,16.2,13.73,29.08,30.56,28.83S408.65,335.55,408.06,319.46Z" transform="translate(-7.5 -126.86)"/></svg>`;
    const metro = `<svg class="metro-svg svg" data-name="Metro" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 443.39 443.46"><path class="metro action-icon" d="M248.88,36C128.32,36.73,27.62,137.6,28.46,256.75c.87,123.94,100.57,224.12,223,222.64,122.69-1.49,219.6-98.91,220.38-219.5C472.64,135.2,371.59,35.17,248.88,36Zm1.58,428.26c-116.7,0-206.61-91.83-206.77-211.28C43.55,143.28,137.54,51.37,249.91,51.3c115.72-.08,206.76,91.88,207,209.05C457.07,371.89,363.63,464.18,250.46,464.21Z" transform="translate(-28.45 -35.95)"/><path class="metro action-icon" d="M156.41,171.43h72.28V381H272V170.43h71.85V134.38H156.41Z" transform="translate(-28.45 -35.95)"/></svg>`;
    const tram = `<svg class="tram-svg svg" data-name="Tram" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 462.06 384.91"><path class="tram action-icon" d="M480.86,276.24a72.35,72.35,0,0,0-2.5-18c-6.77-24.71-13.93-49.31-21-73.93-5.06-17.64-15.23-25.21-33.73-25.21H300.87c2.62-1.86,4-2.88,5.43-3.83,14.53-9.7,29.11-19.33,43.6-29.1,10.48-7.06,10.6-19.62.16-26.61Q304.73,69.16,259.25,39c-6.13-4.1-12.28-4.14-18.42,0C210.42,59.2,180,79.42,149.67,99.86a18.9,18.9,0,0,0-6.25,7.62c-3.07,6.84-.35,14,6.6,18.66q23.91,16,47.92,32c-.1.33-.19.66-.28,1h-5.23q-59.19,0-118.38,0c-15.41,0-26.62,8.5-30.87,23.29C36,207.68,28.65,232.9,21.69,258.22a70.55,70.55,0,0,0-2.54,17.51c-.29,22.29-.15,44.59-.1,66.88,0,18.85,13.24,32,32.2,32q198.74,0,397.47,0c19.18,0,32.23-13.15,32.25-32.42C481,320.18,481.15,298.21,480.86,276.24ZM95.72,282H49.17c.63-5.44.6-10.64,1.91-15.48,5.18-19.15,10.86-38.16,16.17-57.28.88-3.19,2.25-4.29,5.61-4.16,7.5.28,15,.08,22.86.08Zm92.43,0H127V205.33h61.13Zm-2.93-169.15c2.66-1.81,4.6-3.15,6.56-4.45C210,96.23,228.26,84,246.59,72c1.42-.93,4.21-1.62,5.35-.87,20.77,13.57,41.38,27.37,62.56,41.49-1.39,1.11-2.38,2-3.49,2.76-19.18,12.8-38.34,25.63-57.6,38.3-1.42.93-4.21,1.62-5.35.87C227.29,141,206.68,127.16,185.22,112.86ZM280.58,282H219.3V205.47h61.28ZM373,282h-61.1V205.32H373Zm77,.1H404.35V205.17c8.41,0,16.71-.08,25,.11a4,4,0,0,1,2.76,2.39c6,20.76,12.05,41.51,17.68,62.37C450.78,273.72,449.93,277.9,449.93,282.09Z" transform="translate(-18.97 -35.88)"/><path class="tram action-icon" d="M98,420.76c18.5-.69,37.3-14.71,40.7-30.34H53C58.45,408.59,77.77,421.52,98,420.76Z" transform="translate(-18.97 -35.88)"/><path class="tram action-icon" d="M188.63,420.79c19.17-.08,37.14-12.72,42.74-30.32h-86C151.11,408.27,169.22,420.87,188.63,420.79Z" transform="translate(-18.97 -35.88)"/><path class="tram action-icon" d="M311.35,420.79c19.41.08,37.46-12.45,43.27-30.33h-86C274.15,408,292.18,420.71,311.35,420.79Z" transform="translate(-18.97 -35.88)"/><path class="tram action-icon" d="M404.28,420.79c19.16-.08,37.15-12.74,42.72-30.31H361C366.76,408.29,384.86,420.87,404.28,420.79Z" transform="translate(-18.97 -35.88)"/></svg>`;
    const ferry = `<svg class="ferry-svg svg" data-name="Ferry" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 483.56 389.1"><path class="action-icon" d="M487.8,215.08c-29.41,0-58.81-.1-88.22.1-4.31,0-6.94-1.36-9.51-4.73-18.63-24.43-37.47-48.71-56.23-73-7.95-10.31-18.21-15.78-31.44-15.71-24.44.13-48.88,0-73.32,0h-7V92.89c-10.8,0-20.86-.23-30.9.11-4.62.15-7.07-1.17-8.86-5.69-5.19-13.1-11.07-25.93-16.42-39-1.38-3.36-3.19-4.59-6.79-4.43-6.43.29-12.88.08-20.26.08,3,7.63,5.61,14.54,8.53,21.3,1.52,3.5,1.5,6.26-1,9.39a131.65,131.65,0,0,0-9.88,14C134.39,92.11,131.77,93,128,93c-28.26-.14-56.52-.08-84.78-.08H35.63v28.84H11.76v30.6H92v62.35H11.76V350.23a375.21,375.21,0,0,0,57.64,4.46c25.55-.05,50.38-5.19,75.37-9.53C178,339.4,211.16,333,244.61,329.05c16.43-1.93,33.57-.05,50.14,2.05a459.07,459.07,0,0,1,96,23c3.76,1.34,4.74-1,6.26-3.09q31.45-43.29,62.89-86.61,16-22,31.94-44c1-1.36,1.85-2.79,3.49-5.27Zm-264.89-.48H116.78V152.35H222.91Zm25.94.08V151.94c11.74,0,23,.09,34.17,0,12.39-.13,22.85,4.33,30.65,13.83,9.79,11.92,19,24.3,28.47,36.5,3,3.86,5.88,7.79,9.38,12.43Z" transform="translate(-11.76 -43.89)"/><path class="action-icon" d="M266.29,370.35c-25.87,3.12-51.59,7.88-77.19,12.89-40.74,8-81.55,14.26-123.25,11.11a354.94,354.94,0,0,1-54.09-8.65v37c26.4,6.11,53.06,10.47,80.43,10.25,28-.23,55.34-5.42,82.72-10.57s54.6-10.85,82.14-14.46c37.53-4.94,74.66-.4,111,9.64,6.78,1.88,10.22.59,13.72-5.16,4.93-8.1,10.73-15.66,16.5-23.95C354.64,374.73,311.34,364.92,266.29,370.35Z" transform="translate(-11.76 -43.89)"/></svg>`;
    switch(action) {
        case "T-bane": return metro;
        case "Gå": return walk;
        case "Tog": return train;
        case "Buss": return bus;
        case "Trikk": return tram;
        case "Ferge": return ferry;
        default: return walk;
    }
}

function getStatus(route) {
    const currentTime = Math.floor(Date.now() / 1000);
    const startTime = route.startTime;
    const endTime = route.endTime;

    // 0 not yet started;
    // 1 i rute
    // 2 forsinkelse //TODO:
    // 3 kansellert //TODO:
    // 4 ferdig

    let status = 1; //On Route by default
    let statusStyle;

    if(route.delay) {
        if(route.delay.cancelled) {
            status = 3;
        } else {
            status = 2
        }
    }

    let message = "Ikke startet";
    if(currentTime < startTime) {
        status = 0;
    }

    if(currentTime > endTime) {
        status = 4
    }

    switch (status) {
        case 1:
            statusStyle = "in-route";
            message = "I rute";
            break;
        case 2:
            statusStyle = "delayed";
            message = route.delay.statusMessage;
            break;
        case 3:
            statusStyle = "cancelled";
            message = route.delay.statusMessage;
            break;
        case 4:
            statusStyle = "complete";
            message = "Reisen er ferdig";
            break;
        default:
            statusStyle = "not-started";
            message = "Ikke startet";
    }

    return `
        <div class="status">
            <div class="status-indicator ${statusStyle}"></div>
            <p class="status-text">${message}</p>
        </div>
    `;
}

//Function sets a delay on first click, and sets cancellation on second click
//This is only intended for testing purposes, to simulate a delay on a route.
function setDelay(event, stepIndex, routeIndex){
    event.stopPropagation();

    const destinations = {
        from: fullRoute[routeIndex].route[stepIndex].from.address,
        to:  fullRoute[routeIndex].route[stepIndex].to.address
    }

    if(fullRoute[routeIndex].route[stepIndex].hasWarning) {
        fullRoute[routeIndex].delay = {cancelled: true, duration: 5, statusMessage: `Endring i rute som følge av innstilling`} //Cancels on second click
        fullRoute[routeIndex].route[stepIndex].isCancelled = true;
        rerouteTrip(fullRoute, routeIndex, stepIndex, activeFilter);
    } else {
        fullRoute[routeIndex].delay = {cancelled: false, duration: 5, statusMessage: `Forsinket`}
        fullRoute[routeIndex].route[stepIndex].hasWarning = true;
    }

    localStorage.setItem("route", JSON.stringify(fullRoute))

    renderRouteList();

}


/*
* PAGE RENDERING SECTION
* The functions below deal with rendering the contents of the page itself
* */

function renderDate(dateString) {
    container.innerHTML += `
        <div class="route-date">
            <p>${dateString}</p>
        </div>
    `
}
function goToDetails(index) {
    window.location.href = `route-details.html${window.location.search}&index=${index}`
}
function generatePath(route, index) {
    let list = [];

    for(let i = 0; i < route.length; i++) {
        const part = route[i];
        if(part.action === "Overgang") {
            continue; //Skip transitions
        }

        if(route.length > 6) {
            if(part.action === "Gå") {
                continue;
            }
        }

        let warnIcon = `<svg class="warning-svg" data-name="Warning icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 486.27 486.27"><path class="warn-icon" d="M250,6.86C115.72,6.86,6.86,115.72,6.86,250S115.72,493.14,250,493.14,493.14,384.28,493.14,250,384.28,6.86,250,6.86ZM222.24,78.67h55.52V300.32H222.24ZM250,409.77a41.68,41.68,0,1,1,41.68-41.68A41.68,41.68,0,0,1,250,409.77Z" transform="translate(-6.86 -6.86)"/></svg>`
        if (part.isCancelled) {
            warnIcon = `<svg class="warning-svg" data-name="Warning icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 486.27 486.27"><path class="warn-icon cancelled-warn" d="M250,6.86C115.72,6.86,6.86,115.72,6.86,250S115.72,493.14,250,493.14,493.14,384.28,493.14,250,384.28,6.86,250,6.86ZM222.24,78.67h55.52V300.32H222.24ZM250,409.77a41.68,41.68,0,1,1,41.68-41.68A41.68,41.68,0,0,1,250,409.77Z" transform="translate(-6.86 -6.86)"/></svg>`
        }

        const svg = getActionSVG(part.action);
        const service = getServiceClasses(part.operatorName);

        let template = `
            <div class="route-path-part ${part.isCancelled ? "cancelled-part" : ""}" onclick="setDelay(event, ${i}, ${index})">
                <div class="path-action">
                    ${part.hasWarning || part.alertHashcodes ? warnIcon : ""}
                    ${svg}
                </div>
                <div class="path-service ${service}">
                    ${part.serviceNumber ? part.serviceNumber : secondsToTime(part.endTime, part.startTime)}
                </div>
            </div>
        `

        // Make sure you can't put a delay on your legs
        if(part.action === "Gå") {
            template = `
                <div class="route-path-part">
                    <div class="path-action">
                        ${part.hasWarning ? warnIcon : ""}
                        ${svg}
                    </div>
                <div class="path-service ${service}">
                    ${part.serviceNumber ? part.serviceNumber : secondsToTime(part.endTime, part.startTime)}
                </div>
            </div>
            `
        }

        list.push(template);
    }
    return list.join("")
}
function generateRoute(trip, index) {

    let route = trip[index];

    if (index < trip.length - 1) {
        route.notRecommended = route.endTime >= trip[index + 1].endTime;
    }


    const startTime = convertTime(route.startTime);
    const endTime = convertTime(route.endTime);

    const path = generatePath(route.route, index);
    const price = `NOK ${route.cost},-`;
    const status = getStatus(route);

    if(route.delay){
        if(route.delay.cancelled) {
            let cancelledLatLng;
            let cancelledStartTime;
            for(let i = 0; i < route.route.length; i++) {
                if(route.route[i].hasWarning){
                    cancelledLatLng = `(${route.route[i].from.lat},${route.route[i].from.lng})`;
                    cancelledStartTime = route.route[i].startTime;
                }
            }
        }
    }

    const fromName = urlParams.get("fromname").substring(0, urlParams.get("fromname").lastIndexOf(','))
    const toName = urlParams.get("toname").substring(0, urlParams.get("toname").lastIndexOf(','))

    let template = `
        <div class="route-container${route.notRecommended? " notRecommended" : ""}" onclick=goToDetails(${index})>
            <div class="route-time">
                <div class="time-destination dest-start">
                    <p class="destination">${fromName}</p>
                    <p class="time">${startTime}</p>
                </div>
                
                <p class="time travel-time">${secondsToTime(route.endTime, route.startTime)}</p>
                <div class="time-destination dest-end">
                    <p class="destination">${toName}</p>
                    <p class="time">${endTime}</p>
                </div>
            </div>
            <div class="route-path">
                <div class="line vf"></div>
                <div class="start-point vf"></div>
                <div class="end-point vf"></div>
                ${path}
            </div>
            <div class="route-info">
                ${status}
                <p class="price">${price}</p>
            </div>
        </div>
    `;

    container.innerHTML += template;
}

//Renders the route from localstorage
function renderRouteList() {
    let list = JSON.parse(localStorage.getItem("route"));
    container.innerHTML = ""; //Empty the container before render

    if(list.length < 1) {
        container.innerHTML = `
            <div class="no-route-container">
                <p class="no-route">Fant ingen ruter på denne strekningen</p>
            <div>
        `
        return;
    }

    const currentTime = parseInt(urlParams.get("datetime"));
    let dates = [];

    for(let i = 0; i < fullRoute.length; i++){

        if(currentTime > fullRoute[i].endTime) {
            continue; //Skip any routes that are already done
        }

        const routeDate = new Date(list[i].startTime * 1000);
        let dateString = routeDate.getDate() === new Date().getDate() ? "I dag" : `${routeDate.getDate()}. ${convertMonthToMonthname(routeDate.getMonth())}`;
        if(!dates.includes(routeDate.getDate())){
            dates.push(routeDate.getDate());
            renderDate(dateString);
        }

        generateRoute(fullRoute, i);
    }
}

function setFilterSelection(selected){
    const dept = document.getElementById("filter-none");
    const time = document.getElementById("filter-time");
    const price = document.getElementById("filter-price");
    const green = document.getElementById("filter-green");

    const reLoad = `
        <div id="routes-result-container">
            <div class="route-container loading"></div>
            <div class="route-container loading"></div>
            <div class="route-container loading"></div>
            <div class="route-container loading"></div>
            <div class="route-container loading"></div>
        </div> `

    switch(selected){
        case "fast": // Speed
            activeFilter = "(0.1, 0.1 ,2.0 ,1.0)";
            dept.classList.remove("filter-selected");
            time.classList.add("filter-selected");
            price.classList.remove("filter-selected");
            green.classList.remove("filter-selected");
            container.innerHTML = reLoad;
            renderRoutes(activeFilter);
            document.getElementById("filter-description").innerText = "Kortest Reisetid"
            return;
        case "price": // Price
            activeFilter = "(2.0, 0.1 ,0.1 ,0.1)"
            dept.classList.remove("filter-selected");
            time.classList.remove("filter-selected");
            price.classList.add("filter-selected");
            green.classList.remove("filter-selected");
            container.innerHTML = reLoad;
            renderRoutes(activeFilter);
            document.getElementById("filter-description").innerText = "Lavest pris"
            return;
        case "green": // Environment
            activeFilter = "(0.1, 2.0 ,0.1 ,0.1)"
            dept.classList.remove("filter-selected");
            time.classList.remove("filter-selected");
            price.classList.remove("filter-selected");
            green.classList.add("filter-selected");
            container.innerHTML = reLoad;
            renderRoutes(activeFilter);
            document.getElementById("filter-description").innerText = "Lavest C02 utslipp"
            return;
        default: // Convenience
            activeFilter = "(0.1, 0.1 ,0.1 ,2.0)"
            dept.classList.add("filter-selected");
            time.classList.remove("filter-selected");
            price.classList.remove("filter-selected");
            green.classList.remove("filter-selected");
            container.innerHTML = reLoad;
            renderRoutes(activeFilter);
            document.getElementById("filter-description").innerText = "Minst mulig overganger"
            return;
    }
}

//Toggles filter visibility
let isFilterVisible = false;
const filterElem = document.getElementById("filter-by-container");
const expandElem = document.getElementById("filter-expander")
document.getElementById("current-filter").addEventListener("click", () => {
    if(isFilterVisible) {
        filterElem.classList.remove("filter-visible")
        document.getElementById("filter-by").classList.remove("open-filter")
        isFilterVisible = false;
        expandElem.innerHTML = `<polygon points="360 0 360 72 180 216 0 72 0 0 180 144 360 0"/>`;
    } else {
        filterElem.classList.add("filter-visible")
        document.getElementById("filter-by").classList.add("open-filter")
        isFilterVisible = true;
        expandElem.innerHTML = `<polygon points="0 216 0 144 180 0 360 144 360 216 180 72 0 216"/>`;
    }
})

// Create dynamic route alternatives of search
function setUp() {
    setFromAndTo()
    localStorage.setItem("route", JSON.stringify(fullRoute));
    renderRouteList();
}


// Initializing Function calls
renderRoutes("(0.1, 0.1 ,0.1 ,2.0)"); //Default priority Convenience
checkUserAndStarData(); // Loads star if user logged in
