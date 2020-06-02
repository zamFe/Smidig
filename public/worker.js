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
    event.waitUntil(clients.openWindow("xz.html?id=" + event.notification.data));
});
/*
self.addEventListener('notificationclick', function (el) {
    var notification = el.notification;
    var updateurl = data.updateurl;
    console.log("------worker-----")
    console.log(updateurl)
    var action = el.action;
    console.log(updateurl);

    if (action === 'close') {
        notification.close();
    } else {
        clients.openWindow('./xz.html?updateurl=' + updateurl);
        notification.close();
    }
});*/



onmessage = function (e) {
    console.log('Message received from main script');
    console.log('Posting message back to main script');
    postMessage(dataKept);
}

