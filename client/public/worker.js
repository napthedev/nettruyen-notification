console.log("Service Worker Loaded...");

self.addEventListener("push", function (event) {
  console.log("Received notification...");

  const { title, ...options } = event.data.json();

  event.waitUntil(registration.showNotification(title, options));
});
