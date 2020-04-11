// WHEN A NOTIFICATION IS REQUESTED TO BE PUSHED
self.addEventListener('push', event => {
  // Set up options from data
  const data = event.data.json()
  let image = data.image

  console.log(image)

  let options;

  if (data.data) {
    let actions = [
      {//<div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        action: 'dismiss-notification',
        title: data.data.leftText,
        icon: '/good.png'
      },
      {//<div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        action: 'live-view',
        title: data.data.rightText,
        icon: '/bad.png'
      }
    ];

    options = {
      body: data.body,
      image: image,
      icon: "/logo192.png",
      actions: actions,
      data: data.data.url,
      requireInteraction: true
    }
  } else {
    options = {
      body: data.body,
      image: image,
      icon: "/logo192.png",
      requireInteraction: true
    }
  }


  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
})

// WHEN A NOTIFICATION SELECTION IS CLICKED
self.addEventListener('notificationclick', function (event) {
  if (!event.action) {
    // Was a normal notification click
    // console.log('Notification Click.');
    return;
  }

  switch (event.action) {
    case 'dismiss-notification':
      // console.log("dismissed notification");
      break;
    case 'live-view':
      const url = event.notification.data
      if (url != "") {
        const promiseChain = clients.openWindow(url);
        event.waitUntil(promiseChain);
      }
      break;
    default:
      // console.log(`Unknown action clicked: '${event.action}'`);
      break;
  }
});