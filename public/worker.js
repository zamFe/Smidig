console.log("Service Worker Loaded...");
let dataKept;

self.addEventListener("push", e => {
    console.log(e);
    const data = e.data.json();
    dataKept = data;
    console.log("data worker")
    console.log(data)

    return self.registration.showNotification(data.title, data);
});

self.addEventListener("notificationclick", function (event) {
    console.log(event.notification)
    event.notification.close();
    event.waitUntil(clients.openWindow("loading.html?id=" + event.notification.data));
});

onmessage = function (e) {
    console.log('Message received from main script');
    console.log('Posting message back to main script');
    postMessage(dataKept);
}

