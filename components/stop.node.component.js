let container = document.getElementById("main-container");

let template = `
     <div id="departure">
                <div id="time-container">
                    <p>00:00</p>
                </div>
                <div id="node-container">
                    <img class="Node" src="../img/icons/node.png" alt="">
                </div>
                <div id="name-container">
                    <p>[Navn på stop]</p>
                </div>

            </div>
`;

container.innerHTML += template;

//TODO: function to build route from template with data from API