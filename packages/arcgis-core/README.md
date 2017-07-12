# `arcgis-rest-core`

## Simple Usage

```js
import { request } from 'arcgis-rest-core';

request({
  url: 'https://www.arcgis.com/sharing/rest',
  params: {
    //...
  }
}).then((response) => {
  // Success!
}).catch((error) => {
  // Error! Both HTTP AND server errors will end up here...
});
```
