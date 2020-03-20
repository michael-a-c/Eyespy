// WHEN A NOTIFICATION IS REQUESTED TO BE PUSHED
self.addEventListener('push', event => {
    const data = event.data.json()
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
            action: 'good-action',
            title: leftText,
            icon: '/good.png'
          },
        {//<div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
            action: 'bad-action',
            title: rightText,
            icon: '/bad.png'
          }
    ];
    const options = {
      body: data.body,
      image: "/face3.jpg",
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
      case 'good-action':
        console.log("yeye");
        break;
      case 'bad-action':
        console.log('table flip');
        const url = event.notification.data
        const promiseChain = clients.openWindow(url);
        event.waitUntil(promiseChain);
        break;
      default:
        console.log(`Unknown action clicked: '${event.action}'`);
        break;
    }
  });