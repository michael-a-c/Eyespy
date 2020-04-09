let Requests = {
  requestBody: async function (reqMethod, endpoint, request) {
    try {
      const response = await fetch(endpoint,
        {
          method: reqMethod,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(request)
        });
      if (!response.ok) { throw response }

      let data = response.json();
      return data;

    } catch (err) {
      return err;
    }
  },

  signup: async function (request) {
    return await this.requestBody("POST", "/api/user/signup", request)
  },
  signin: async function (request) {
    return await this.requestBody("POST", "/api/user/signin", request)
  },

  signout: async function () {
    try {
      const response = await fetch("/api/user/signout")
      if (!response.ok) { throw response; }
      let data = response.json();
      return data;

    } catch (err) {
      return err;

    }
  },
  startStream: async function(request){
    return await this.requestBody("POST", "/api/stream/start", request)

  },

  stopStream: async function(request){
      return await this.requestBody("POST", "/api/stream/stop", request)
  },

  adddevice: async function (request) {
    return await this.requestBody("PUT", "/api/user/add-new-device", request)
  },

  removedevice: async function (request) {
    return await this.requestBody("PUT", "/api/user/remove-device", request)
  },

  sendemail: async function (request) {
    return await this.requestBody("POST", "/api/email/sendemail", request)
  },



  getUserStreams: async function(){
    try{
      const response = await fetch("/api/stream/list")
      if (!response.ok) { throw response; }
      let data = response.json();
      return data;

    } catch(err){
      return err;
    }
  },

  getdevices: async function () {
    try {
      const response = await fetch("/api/user/devices")
      if (!response.ok) { throw response; }
      let data = response.json();
      return data;

    } catch (err) {
      return err;

    }
  },

  /*SMSalert: async function (request) {
    try {
      const response = await fetch("/api/user/SMSalert", {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) { throw response; }
      let data = response.json();
      return data;

    } catch (err) {
      return err;

    }
  }*/

}

export default Requests