let inputElem = document.getElementById('datetime-input');
let buttonElem = document.getElementById('datetime-button');

// Saves all given URL parameters to pass them on to the route search
let searchParams = new URLSearchParams(window.location.search);
let route = searchParams.toString();
console.log(route);


// Sets date and time (and link) to current time by default.
let currentDate = new Date().toISOString();
inputElem.value = currentDate.substring(0,currentDate.lastIndexOf(':'));
buttonElem.setAttribute("href", `/html/routes?${route}&datetime=${Math.floor(new Date().getTime()/1000)}`)

// Changes the link based on changes made in the input
inputElem.addEventListener('change', e => {
    let selectedTime = Math.floor(new Date(inputElem.value).getTime()/1000);
    console.log("Time set to: " + selectedTime.getTime()/1000);
    buttonElem.setAttribute("href", `/html/routes?${route}&datetime=${selectedTime}`);
})