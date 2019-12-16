let inputElem = document.getElementById('datetime-input');
let buttonElem = document.getElementById('datetime-button');

let searchParams = new URLSearchParams(window.location.search);
let route = searchParams.toString();
console.log(route);

buttonElem.setAttribute("href", `/html/routes?${route}&datetime=${Math.floor(new Date().getTime()/1000)}`)

inputElem.addEventListener('change', e => {
    let selectedTime = Math.floor(new Date(inputElem.value).getTime()/1000);
    console.log("Time set to: " + selectedTime.getTime()/1000);
    buttonElem.setAttribute("href", `/html/routes?${route}&datetime=${selectedTime}`);
})