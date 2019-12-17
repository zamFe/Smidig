let fullRoute;

let urlParams = new URLSearchParams(window.location.search);

let searchData = {
    from: urlParams.get('from'),
    to: urlParams.get('to'),
    currentTime: urlParams.get('datetime')
}

console.log(searchData);

if(!searchData.currentTime){
    searchData.currentTime = Math.floor(new Date().getMilliseconds()/1000)
}
fetch(`${window.location.origin}?action=getroute&from=${searchData.from}&to=${searchData.to}&datetime=${searchData.currentTime}`)
    .then(function (response) {
        return response.text();
    }).then(function (text) {
        fullRoute = JSON.parse(text).data;

    // Creates an error message upon API Call failures
    console.log(fullRoute);
    let container = document.getElementById('error-container');
    if(typeof(fullRoute) !== 'object') {
        container.innerHTML = "";
        if(fullRoute.substring(0,6) == 'Error:'){
            let errorBox = document.createElement('div');
            errorBox.style.position = 'absolute';
            errorBox.style.width = '100%';
            errorBox.style.height = '15vh';
            errorBox.style.zIndex = '100';
            errorBox.style.margin = '0 0 auto 0';
            errorBox.style.top = '0px';
            errorBox.style.fontSize = '1rem';
            errorBox.style.backgroundColor = 'rgba(200,100,100,.9)';
            errorBox.style.color = '#ffffff';
            errorBox.style.textAlign = 'center';
            let errorTextElem = document.createElement('p');
            errorTextElem.innerText = fullRoute;
            errorBox.appendChild(errorTextElem);
            container.appendChild(errorBox);
        }
    } else {
        container.innerHTML = "";
    }


        fullRoute.sort((a,b) => (a.startTime > b.startTime) ? 1 : -1);
        setUp();
})

//from: (59.9233,10.79249)
//to: (60.7945331,11.067997699999978)