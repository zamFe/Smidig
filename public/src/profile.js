
createUser("esmlsl", "passss", "andreas", "�stny").then((value) => {
    getUser("esmlsl", "passss").then((v) => {
        console.log(v.data) 
    })
})

