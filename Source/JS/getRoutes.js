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
        console.log(fullRoute);
        setUp();
})

//from: (59.9233,10.79249)
//to: (60.7945331,11.067997699999978)