console.log("Service Worker Loaded...");

self.addEventListener("push", e => {
    console.log(e);
    const data = e.data.json();
    self.registration.showNotification(data.title, {
        body: "Notified by VY!",
//        icon: "http://image.ibb.co/frYOFd/tmlogo.png"
    });
});