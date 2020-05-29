console.log("Service Worker Loaded...");
let dataKept;

self.addEventListener("push", e => {
    console.log(e);
    const data = e.data.json();
    dataKept = data;
    self.addEventListener('notificationclick', function(el) {
        var notification = el.notification;
        var updateurl = data.updateurl;
        var action = el.action;
        console.log(updateurl);

        if (action === 'close') {
            notification.close();
        } else {
            clients.openWindow('./xz.html?updateurl='+updateurl);
            notification.close();
        }
    });
    self.registration.showNotification(data.title,data);
});

onmessage = function(e) {
    console.log('Message received from main script');
    console.log('Posting message back to main script');
    postMessage(dataKept);
}

