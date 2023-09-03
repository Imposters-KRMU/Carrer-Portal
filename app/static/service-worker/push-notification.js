"use strict";

const applicationServerPublicKey =
  "BH8-hIchXKMI6AKSee8gD0hhPThRqaEhIEtMJwcTjEQhiOKdG-_2tTIO-6hOAK4kwg5M9Saedjxp4hVE-khhWxY";

function urlB64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

("use strict");

/* eslint-enable max-len */

self.addEventListener("install", function (event) {
  console.log("Service Worker installing.");
});

self.addEventListener("activate", function (event) {
  console.log("Service Worker activating.");
});

self.addEventListener("push", function (event) {
  console.log("[Service Worker] Push Received.");
  const pushData = event.data.text();
  console.log(`[Service Worker] Push received this data - "${pushData}"`);
  let data, title, body;
  data = JSON.parse(pushData);
  try {
    title = data.notification_title;
    body = data.notification_body;
  } catch (e) {
    console.log(e);
  }
  const options = {
    body: body,
    icon: "/static/images/logo-circular.png",
    badge: "/static/images/favicon.ico",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      id: data.id,
      url: data.notification_link,
    },
  };
  console.log(title, options);

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(
      event.notification.data.url +
        "?notification_id=" +
        event.notification.data.id
    )
  );
});
