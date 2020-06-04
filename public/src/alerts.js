const publicVapidKey =
    "BKTEYj8Zc0k5p1D3WIYqPy8mg__7QdJVfqdSY5IuUJOM3OL7nHq-5qVTm0JrCy36oxa8MYcSNZRU0OQC87FcAg4";

// Render bell icon depending on if it is stored or not previously
// Runs only on first page load
function checkForNotifiedRoute() {
    let notifyStatus = JSON.parse(localStorage.getItem("notifyRoute"));
    if(notifyStatus) {
        if(notifyStatus.includes(fullRoute[index].hookURL)) {
            setBellIcon(true);
            return;
        }
    }
    setBellIcon(false);
}
checkForNotifiedRoute();

// Sets this route to notifications or removes it and sets bell icon
// to correct format depending on previous setting
function subscribeToRoute(trip) {
    let notifyRoutes = localStorage.getItem("notifyRoute");

    if(notifyRoutes){ // Exception for first time users when it's null
        notifyRoutes = JSON.parse(notifyRoutes)

        if(notifyRoutes.includes(trip.hookURL)) {
            // Localstorage already has this item, find and remove it
            for(let item of notifyRoutes) {
                if(item === trip.hookURL) {
                    notifyRoutes.splice(notifyRoutes.indexOf(item), 1);
                    localStorage.setItem("notifyRoute", JSON.stringify(notifyRoutes))
                    setBellIcon(false);
                    send(trip, true).catch(err => console.error(err));
                }
            }
        } else {
            // Check for service worker
            if ("serviceWorker" in navigator) {
                setBellIcon(true);
                notifyRoutes.push(trip.hookURL);
                localStorage.setItem("notifyRoute", JSON.stringify(notifyRoutes));
                send(trip).catch(err => console.error(err));
            }
        }
    } else {
        // Check for service worker
        if ("serviceWorker" in navigator) {
            setBellIcon(true);
            const array = [trip.hookURL];
            localStorage.setItem("notifyRoute", JSON.stringify(array));
            send(trip).catch(err => console.error(err));
        }
    }
}

// Changes to correct SVG of the bell on call
function setBellIcon(status) {
    const container = document.getElementById("bell-holder");
    let icon;
    if(status) { // Icon for when it IS in localstorage
        icon = `
            <p class="notif-text">Skru av varsler</p>
            <svg class="notif-svg" data-name="Remove Bell Icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380.06 447.71">
                <path class="notif-icon" d="M434.35,381.25C420.84,367.9,407.47,354.4,394,341a8,8,0,0,1-2.65-6.2c.07-36.74,0-73.48.07-110.23a203.35,203.35,0,0,0-1.1-22L185.78,407.14H437.3c0-6.47-.14-12.58.05-18.69A8.93,8.93,0,0,0,434.35,381.25Z" transform="translate(-63.42 -28.58)"/>
                <path class="notif-icon" d="M330.88,97.19A139.79,139.79,0,0,0,291,79.31c-2.34-.65-3-1.6-3-3.83.09-4.87.13-9.75-.06-14.62-.66-16-12.48-29.15-28.66-31.87a34.37,34.37,0,0,0-37.3,21.37c-3,7.63-2.17,15.51-2.17,23.33,0,3.51-.83,5.14-4.54,6.14-34.53,9.31-60.63,29.73-78.34,60.73-13.81,24.11-20.19,50.44-20.42,78.11-.26,31-.2,62-.12,93.06Z" transform="translate(-63.42 -28.58)"/>
                <path class="notif-icon" d="M231.72,470.14c16.93,9.24,33.76,8,49.29-3.38,11.92-8.72,18.15-20.72,18.11-36H207.77C209.05,448.39,216.53,461.87,231.72,470.14Z" transform="translate(-63.42 -28.58)"/>
                <rect class="notif-icon" x="12.32" y="229.39" width="482.26" height="55.23" transform="translate(-170.91 225.91) rotate(-45)"/>
            </svg>
        `;
        container.classList.add("notif-turnoff");
        container.classList.remove("notif-turnon");
    } else { // Icon for when it's NOT in localstorage
        icon = `
            <p class="notif-text">Få varsler</p>
            <svg class="notif-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 457.39 447.76">
                <g data-name="Bell Icon">
                    <path class="notif-icon" d="M432.14,401H65.26c0-4.39.44-8.75-.1-13-.92-7.12,1.78-12,6.92-16.88,12.37-11.65,24.13-23.94,36.21-35.89a8.79,8.79,0,0,0,2.94-6.85c-.08-38.62-.25-77.24.07-115.85.23-27.67,6.61-54,20.42-78.11,17.71-31,43.81-51.42,78.34-60.73,3.71-1,4.54-2.63,4.54-6.14,0-7.82-.81-15.7,2.17-23.33a34.36,34.36,0,0,1,37.3-21.37c16.18,2.72,28,15.84,28.66,31.87.19,4.87.15,9.75.06,14.62,0,2.23.66,3.18,3,3.83,49.37,13.76,79.43,46.67,93.77,95,4.87,16.41,6.7,33.22,6.67,50.3-.07,36.75,0,73.49-.07,110.23a8,8,0,0,0,2.65,6.2c13.5,13.36,26.87,26.86,40.38,40.21a8.93,8.93,0,0,1,3,7.2C432,388.42,432.14,394.53,432.14,401ZM226.56,464c16.93,9.24,33.76,8,49.29-3.38,11.92-8.72,18.15-20.72,18.11-36H202.61C203.89,442.25,211.37,455.73,226.56,464Z" transform="translate(-20.51 -22.39)"/>
                </g>
                <g data-name="Bell Icon">
                    <path class="notif-icon" d="M20.51,205.36C25.45,131.23,57.17,72,114.39,26.07l32.41,32.6A24.14,24.14,0,0,1,145,60.32a193.33,193.33,0,0,0-67.73,90.87,171.76,171.76,0,0,0-10.54,50c-.16,3.2-1.08,4.57-4.64,4.5-12.36-.23-24.74-.11-37.11-.13C23.71,205.55,22.49,205.45,20.51,205.36ZM355,61a195.2,195.2,0,0,1,52.72,60.12c14,24.9,22.54,51.56,24.42,80.18.22,3.29,1.31,4.45,4.75,4.4,12.48-.2,25-.12,37.46,0,2.79,0,3.64-.81,3.5-3.66a219.67,219.67,0,0,0-8-48.27C455.82,103.05,428,61.39,387.09,28.45c-1-.83-2.14-1.58-2.69-2l-32.64,32Z" transform="translate(-20.51 -22.39)"/>
                </g>
            </svg>
        `;
        container.classList.add("notif-turnon");
        container.classList.remove("notif-turnoff");
    }
    container.innerHTML = icon;
}


// Register SW, Register Push, Send Push
async function send(trip, unsub = false) {
    let answer = await Notification.requestPermission();
    console.log(answer)
    if (answer !== "granted"){
        return;
    }
    // Register Service Worker
    const register = await navigator.serviceWorker.register("/worker.js", {
        scope: "/"
    });

    let serviceWorker;

    if (register.installing) {
        serviceWorker = register.installing;
        console.log('Service worker installing');
    } else if (register.waiting) {
        serviceWorker = register.waiting;
        console.log('Service worker installed & waiting');
    } else if (register.active) {
        serviceWorker = register.active;
        console.log('Service worker active');
    }

    serviceWorker.addEventListener("statechange", async function(e) {
        console.log("sw statechange : ", e.target.state);
        if (e.target.state === "activated") {
            // use pushManger for subscribing here.
            console.log("Just now activated. now we can subscribe for push notification")
            // Register Push
            const subscription = await register.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
            });

            // Send Push Notification
            console.log(subscription)
            await fetch(`/${unsub?"un":""}subscribe?id=` + trip.hookURL + "&departure=" + trip.startTime + "&arrival=" + trip.endTime, {
                method: "POST",
                body: JSON.stringify(subscription),
                headers: {
                    "content-type": "application/json"
                }
            });
        }
    });


}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
