import fetch from 'isomorphic-fetch';

function parseJSON(response) {
    return response.json().then(function (json) {
      const newResponse = Object.assign(response, { json });
  
      if (response.status < 300) {
        return newResponse;
      } else {
        throw newResponse;
      }
    });
  }
  

var signedFlureeFetch = (uri, body, auth) => {
    var headers = {'Content-Type': 'application/json'}
    if(auth) {
      headers['Authorization'] = 'Bearer '.concat(auth)
    } 
    
    var fetchOpts = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    };
  
    return fetch(uri, fetchOpts)
  }
  
  export { signedFlureeFetch, parseJSON };
  