---
title: Using ArcGIS REST JS in AMD with Require.js or Dojo
navTitle: AMD (Require.js or Dojo)
description: Learn how to integrate the ArcGIS REST JS library into project using AMD with Require.js or Dojo.
order: 50
group: 1-get-started
---

# Get Started with ArcGIS REST JS and AMD

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

  <!-- The ArcGIS API for JavaScript includes its own AMD loader -->
  <script src="https://js.arcgis.com/4.7/"></script>

  <!-- require ArcGIS REST JS from https://unpkg.com -->
  <script src="{% cdnUrl data.typedoc | findPackage('@esri/arcgis-rest-request') %}"></script>

  <script>
    require(["@esri/arcgis-rest-request"], function(arcgisRequest) {
      arcgisRequest.request("https://www.arcgis.com/sharing/rest/info").then(response => {
        console.log(response);
      });
    });
  </script>
</html>
```