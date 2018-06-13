---
title: Using ArcGIS REST JS from a CDN
navTitle: From a CDN
description: Learn how to use ArcGIS REST JS from a CDN.
order: 20
group: 1-get-started
---

# Get Started using a CDN

ArcGIS REST JS is hosted on [unpkg](https://unpkg.com/). You can find URLs for individual packages in the [API reference](../../api).

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>ArcGIS REST JS</title>
</head>
<body>
  Open your console to see the demo.
</body>
  <!-- require polyfills for fetch and Promise from https://polyfill.io -->
  <script src="https://cdn.polyfill.io/v2/polyfill.js?features=es5,Promise,fetch"></script>

  <!-- require ArcGIS REST JS libraries from https://unpkg.com -->
  <script src="{% cdnUrl data.typedoc | findPackage('@esri/arcgis-rest-request') %}.js"></script>

  <script>
    // when including ArcGIS REST JS all exports are available from an arcgisRest global
    arcgisRest.request("https://www.arcgis.com/sharing/rest/info").then(response => {
      console.log(response);
    });
  </script>
</html>