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
  }

}

export default Requests