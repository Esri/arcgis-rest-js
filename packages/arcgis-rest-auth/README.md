# `arcgis-rest-auth`

Provides authentication methods for `arcgis-rest`

```js
import { request } from 'arcgis-rest-core';
import { UserAuthentication, AppAuthentication } from 'arcgis-rest-auth';

const auth = new AppAuthentication({
  clientId: '123'; // required
  clientSecret: '123' // required
  token: '123' // optional, an access token if you have one
  expires: Date.now() // when the provided token expires
  portal: 'https://www.arcgis.com/sharing/rest' // which portal generated this token
});

auth.on('error', (error) => {
  // unable to authenticate a request so get a new token and retry.
  auth.refreshToken().then(() => {
    error.request.retry();
  });
});

request({
  url: '...'
  authentication: auth,
  params: {
    //...
  }
}).then((response) => {
  // Success!
}).catch((error) => {
  // Error! Both HTTP AND server errors will end up here...
});

request.defaultAuthhandler
```
