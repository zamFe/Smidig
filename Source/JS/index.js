let locationData = {
    from: null, 
    to: null
}

let inputDelay;

function updateDropdown(loc) {

    if(inputDelay){
        clearTimeout(inputDelay);
    } 

     inputDelay = setTimeout(() => {
        fetch(`${window.location.origin}?action=getlocation&q=` + document.getElementById(loc + "-input").value)
        .then(function (response) {
            return response.text();
        }).then(function (text) {
            addToDropdown(JSON.parse(text).data, loc);
        })
        console.log("Post");
    }, 800)
}


function fromDropdownMenu(){
    document.getElementById("from-droplist").style.display = "block";
}


function toDropdownMenu(){
    document.getElementById("to-droplist").style.display = "block";
}


function getName(address, lat, lng, loc){

    console.log(address, lat, lng);
    locationData[loc] = {
        address, lat, lng
    };

    document.getElementById(loc + "-input").value = address;
    document.getElementById(loc + "-droplist").style.display = "none";
}

function setup(name){

    let username = document.getElementById("hello-span");
    username.innerText = "God Morgen, " + name;   
}

function addToDropdown(data, loc) {
    

    console.log(data);
    let template = "";

    for(let i = 0; i < data.choices.length; i++){
        template += '<div class="droplist-content" onclick="getName(\''+ data.choices[i].name + '\', \''+ data.choices[i].lat + '\', \''+ data.choices[i].lng + '\', \''+ loc + '\'  )"><span class="dropdown-span">' + data.choices[i].name + '</span></div>'
    }

    document.getElementById(loc + "-droplist").innerHTML = template;
}




setup("Candis");