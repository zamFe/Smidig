console.log("Service Worker Loaded...");

self.addEventListener("push", e => {
    console.log(e);
    const data = e.data.json();
    console.log("data worker")
    console.log(data)

    return self.registration.showNotification(data.title, data);
});

self.addEventListener("notificationclick", function (event) {
    console.log(event.notification)
    event.notification.close();
    event.waitUntil(clients.openWindow("loading.html?id=" + event.notification.data));
});

