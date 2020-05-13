
createUser("esmlsl", "passss", "andreas", "østny").then((value) => {
    getUser("esmlsl", "passss").then((v) => {
        console.log(v.data) 
    })
})

