let locationData = {
    from: null, 
    to: null
}

let inputDelay;

document.getElementById("dark-screen").addEventListener("click", (e) =>  {  
    e.stopPropagation();
    document.getElementById("from-droplist").style.display = "none"; 
    document.getElementById("dark-screen").style.display = "none";
})

document.getElementById("dark-screen").addEventListener("click", (e) =>  {
   e.stopPropagation();
    document.getElementById("to-droplist").style.display = "none";
    document.getElementById("dark-screen").style.display = "none"; 
})

function updateDropdown(loc) {

    if(inputDelay){
        clearTimeout(inputDelay);
    } 

     inputDelay = setTimeout(() => {
        fetch(`${window.location.origin}/api/routes?action=getlocation&q=` + document.getElementById(loc + "-input").value)
        .then(function (response) {
            return response.text();
        }).then(function (text) {
            addToDropdown(JSON.parse(text).data, loc);
        })
        console.log("Post");
    }, 600)
}

document.getElementById("swap-from-to").addEventListener("click", (e) => {
    let tempData = locationData.from;
    locationData.from = locationData.to;
    locationData.to = tempData;
    document.getElementById("from-input").value = locationData.from.address;
    document.getElementById("to-input").value = locationData.to.address;
})


function fromDropdownMenu(){
    document.getElementById("dark-screen").style.display = "block";
    document.getElementById("from-droplist").style.display = "block";
}


function toDropdownMenu(){
    document.getElementById("dark-screen").style.display = "block";
    document.getElementById("to-droplist").style.display = "block";
}


function getName(address, lat, lng, loc){

    console.log(address, lat, lng);
    locationData[loc] = {
        address, lat, lng
    };

    if(locationData.from && locationData.to){
        document.getElementById("swap-from-to").style.display = "inline-block";
    } else {
        document.getElementById("swap-from-to").style.display = "none";
    }


    document.getElementById(loc + "-input").value = address;
    document.getElementById(loc + "-droplist").style.display = "none";
    document.getElementById("dark-screen").style.display = "none";
}

function setup(name){

    let username = document.getElementById("hello-span");
    username.innerText = "God Morgen, " + name + "!";   
}

function addToDropdown(data, loc) {
    
    // Creates an error message upon API Call failures
    console.log(data);
    let container = document.getElementById('error-container');
    if(typeof(data) !== 'object') {
        container.innerHTML = "";
        if(data.substring(0,6) == 'Error:'){
            let errorBox = document.createElement('div');
            errorBox.style.position = 'absolute';
            errorBox.style.width = '100%';
            errorBox.style.height = '12vh';
            errorBox.style.zIndex = '100';
            errorBox.style.margin = '0 0 auto 0';
            errorBox.style.top = '0px';
            errorBox.style.fontSize = '2rem';
            errorBox.style.backgroundColor = 'rgba(255,100,100,.8)';
            errorBox.style.color = '#ffffff';
            errorBox.style.textAlign = 'center';
            let errorTextElem = document.createElement('p');
            errorTextElem.innerText = data;
            errorBox.appendChild(errorTextElem);
            container.appendChild(errorBox);

            data = fallbackData.dropDownData;
        }
    } else {
        container.innerHTML = "";
    }

    let template = "";

    for(let i = 0; i < data.choices.length; i++){
        template += '<div class="droplist-content" onclick="getName(\''+
            data.choices[i].address +
            '\', \''+
            data.choices[i].lat +
            '\', \''+ data.choices[i].lng +
            '\', \''+ loc + '\'  )"><span class="dropdown-span">' +
            data.choices[i].address + '</span></div>'
    }
    document.getElementById(loc + "-droplist").innerHTML = template;
}

function checkLocation(){
    if(locationData.from.address == locationData.to.address){
        alert("Samme lokasjoner støttes ikke!");
    } else {
        window.location.href="html/datetime.html?from=(" + locationData.from.lat + 
        "," + locationData.from.lng + ")&to=(" + locationData.to.lat + 
        "," + locationData.to.lng +")&fromname=" + 
        encodeURI(locationData.from.address) + "&toname=" + encodeURI(locationData.to.address);      
    }
    
}


setup("Ola Nordmann");


/*
window.location.href='html/datetime.html?from=('+ locationData.from.lat + ',' + locationData.from.lng +')&to=('+ locationData.to.lat + ',' + locationData.to.lng +')&fromname=' + encodeURI(locationData.from.address) + '&toname=' + encodeURI(locationData.to.address)"
*/