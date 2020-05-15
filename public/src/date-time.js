const dateInput = document.getElementById('date-input');
const timeInput = document.getElementById('time-input');
const buttonElem = document.getElementById('datetime-button');

// Saves all given URL parameters to pass them on to the route search
let searchParams = new URLSearchParams(window.location.search);
let route = searchParams.toString();
console.log(route);

let path = `routes.html?${route}&datetime=${Math.floor(new Date().getTime()/1000)}`;

let selectedDate;
let selectedTime;

function updatePath() {
    const dateTime = `${selectedDate} ${selectedTime}`;
    let bits = dateTime.split(/\D/);
    const date = new Date(bits[0], --bits[1], bits[2], bits[3], bits[4])
    path = `routes.html?${route}&datetime=${Math.floor(date.getTime()/1000)}`;
    console.log(selectedTime)
    console.log(new Date().getTimezoneOffset())
    if(!selectedTime || !selectedDate) {
        buttonElem.style.pointerEvents = "none"
        buttonElem.style.opacity = "0.4"
    } else {
        buttonElem.style.pointerEvents = "auto"
        buttonElem.style.opacity = "1"
    }
}

function setDateTime() {
    let currentDateTime = new Date();
    console.log(currentDateTime)

    let month = currentDateTime.getMonth()+1 < 10 ? `0${currentDateTime.getMonth()+1}` : currentDateTime.getMonth()+1;
    let day = currentDateTime.getDate() < 10 ? `0${currentDateTime.getDate()}` : currentDateTime.getDate();

    //Expects format: 2020-05-14
    setDate(`${currentDateTime.getFullYear()}-${month}-${day}`);

    let hour = currentDateTime.getHours() < 10 ? `0${currentDateTime.getHours()}` : currentDateTime.getHours();
    let minute = currentDateTime.getMinutes() < 10 ? `0${currentDateTime.getMinutes()}` : currentDateTime.getMinutes();

    //Expects format: 13:07
    setTime(`${hour}:${minute}`);
}

function setDate(currentDate) {
    console.log(currentDate)
    dateInput.value = currentDate;
    selectedDate = currentDate;
    buttonElem.setAttribute("href", `routes.html?${route}&datetime=${Math.floor(new Date().getTime()/1000)}`)

// Changes the link based on changes made in the input
    dateInput.addEventListener('change', e => {
        selectedDate = e.target.value;
        updatePath()
    })
}

function setTime(currentTime) {
    timeInput.value = currentTime;
    selectedTime = currentTime;
    buttonElem.setAttribute("href", `routes.html?${route}&datetime=${Math.floor(new Date().getTime()/1000)}`)

// Changes the link based on changes made in the input
    timeInput.addEventListener('change', e => {
        selectedTime = e.target.value;
        updatePath()
    })
}

setDateTime()

function findRoutes() {
    window.location.href = path;
}

let fromPlace = searchParams.get("fromname");
let toPlace = searchParams.get("toname");
let value = `Når ønsker du å reise fra <span class="route-name">${fromPlace}</span>, til <span class="route-name">${toPlace}</span>?`;

document.getElementById("route").innerHTML = value;