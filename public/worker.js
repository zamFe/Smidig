console.log("Service Worker Loaded...");

self.addEventListener("push", e => {
    const data = e.data.json();

    return self.registration.showNotification(data.title, data);
});

self.addEventListener("notificationclick", function (event) {
    event.notification.close();
    event.waitUntil(clients.openWindow("loading.html?id=" + event.notification.data));
});

