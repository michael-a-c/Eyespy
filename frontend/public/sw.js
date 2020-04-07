// WHEN A NOTIFICATION IS REQUESTED TO BE PUSHED
self.addEventListener('push', event => {
    // Set up options from data
    const data = event.data.json()
    let image = data.image
    if (!data.image) {
      image = ""
    }
    let leftText = data.data.leftText
    if (!data.data.leftText) {
      leftText = "N/A"
    }
    let rightText = data.data.rightText
    if (!data.data.rightText) {
      rightText = "N/A"
    }
    const actions = [
        {//<div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
            action: 'dismiss-notification',
            title: leftText,
            icon: '/good.png'
          },
        {//<div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
            action: 'live-view',
            title: rightText,
            icon: '/bad.png'
          }
    ];
    const options = {
      body: data.body,
      image: image,
      icon: "/logo192.png",
      data: data.data.url,
      actions: actions,
      requireInteraction: true
    }
    console.log(event.data.json())
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  })

// WHEN A NOTIFICATION SELECTION IS CLICKED
self.addEventListener('notificationclick', function(event) {
    if (!event.action) {
      // Was a normal notification click
      console.log('Notification Click.');
      return;
    }
    console.log("event:");
    console.log(event);
  
    switch (event.action) {
      case 'dismiss-notification':
        console.log("dismissed notification");
        break;
      case 'live-view':
        const url = event.notification.data
        const promiseChain = clients.openWindow(url);
        event.waitUntil(promiseChain);
        break;
      default:
        console.log(`Unknown action clicked: '${event.action}'`);
        break;
    }
  });