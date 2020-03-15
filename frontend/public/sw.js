// WHEN A NOTIFICATION IS REQUESTED TO BE PUSHED
self.addEventListener('push', event => {
    const data = event.data.json()
    const actions = [
        {//<div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
            action: 'good-action',
            title: 'Dismiss',
            icon: '/good.jpg'
          },
        {//<div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
            action: 'bad-action',
            title: 'THIS IS NOT OK',
            icon: '/bad.jpg'
          }
    ];
    const options = {
      body: data.body,
      image: "/face4.jpg",
      icon: "/logo192.png",
      actions: actions,
      requireInteraction: true
    }
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

    console.log(event);
  
    switch (event.action) {
      case 'good-action':
        console.log("yeye");
        break;
      case 'bad-action':
        console.log('table flip');
        break;
      default:
        console.log(`Unknown action clicked: '${event.action}'`);
        break;
    }
  });