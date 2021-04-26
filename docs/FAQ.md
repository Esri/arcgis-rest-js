## Is this a _supported_ Esri product?

With the release of ArcGIS Platform in January 2021, Esri is now officially supporting ArcGIS REST JS. Documentation is available on [ArcGIS Developer](https://developers.arcgis.com/arcgis-rest-js/) and [Esri Technical Support](https://support.esri.com/en/contact-tech-support) will respond to support incidents.

This project is still an open source collaboration between developers from a variety of teams at Esri that was initially developed to scratch an itch of our own. We welcome outside contributors and fully expect that the tools here will be useful to any developer looking to integrate ArcGIS Platform services into their apps.

## Comparison with the ArcGIS API for JavaScript

The [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/) is Esri's flagship product for building web applications to visualize, edit, map and analyze geospatial data. It is a feature complete client side API for working with the REST services based on ArcGIS Platform.
The ArcGIS API for JavaScript includes significant client side functionality including smart mapping, 3D rendering, geometric analysis and feature editing as well as full support for working with web maps and web scenes.

The goal of this project on the other hand is to provide a convenient binding to the underlying REST APIs for those who need to work directly with it from JavaScript. This project includes functional equivalents of the low-level request methods and identity management in the ArcGIS API for JavaScript, along with additional thin wrappers to assist developers in scripting against the ArcGIS REST APIs directly in Node.js and browser applications that do _not_ render a map.

We aim to make interacting with the platform as intuitive as possible, but the surface area of the project currently does not nearly encompass the entirety of the ArcGIS REST APIs.

## Comparison with the ArcGIS API for Python

This project is similar to the [ArcGIS API for Python](https://developers.arcgis.com/python/) in many ways. Like the ArcGIS API for Python, this library aims to be a scripting tool that simplifies interacting with the ArcGIS REST API, but where the ArcGIS API for Python highlights integration with dataframes and Jupyter Notebooks for visualization and sharing this project provides only generic tools for JavaScript applications running on a server, CLI, in a browser or as a script.

## Who is using these packages?

REST JS is trusted in ArcGIS applications serving **many** thousands of users.

* ArcGIS [Hub](https://hub.arcgis.com)
* ArcGIS [Developer](https://developers.arcgis.com)
* ArcGIS [Storymaps](https://storymaps.arcgis.com/en/)
* ArcGIS [Solutions](https://solutions.arcgis.com/)
* ArcGIS Enterprise
* ArcGIS [Urban](https://www.esri.com/en-us/landing-page/product/2018/arcgis-urban)
* ArcGIS [Analytics for IoT](https://www.esri.com/en-us/landing-page/product/2018/arcgis-analytics-for-iot)

And since its on GitHub, Esri developers are _far_ from the only ones using ArcGIS REST JS. Besides the usual culprits, we've seen the library running in:

* [Chrome Extensions](https://chrome.google.com/webstore/detail/echo-for-arcgis/mkeckgendkgcofhhenfkknonnkoboobm?hl=en-US)
* [Lambda Functions](https://medium.com/@adamjpfister/know-your-apis-6dc6ea3d084c)
* [Web Components](https://github.com/esridc/hub-components)
* [React Components](https://twitter.com/oppoudel/status/1022209378378805249)
* [Observable](https://observablehq.com/@jgravois/introduction-to-esri-arcgis-rest-js)

## Why TypeScript

Using TypeScript allows us to add type information to request params and response structures. This vastly simplifies development. TypeScript also has excellent support for newer `async`/`await` patterns and for generating API documentation with [TypeDoc](http://typedoc.org/).

TypeScript compiles to JavaScript so you can use @esri/arcgis-rest-js in any JavaScript project. However if you use TypeScript you will get the benefits of type checking for free.

We also _really_ like TypeScript because it supports exporting to both [ES 2015 modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) (use `import`/`export`) and [UMD](http://davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/) modules. This allows us to support a wide variety of module loaders and bundlers, including Browserify, Webpack, RequireJS, and Dojo 1 and 2.

We include [`tslib`](https://www.npmjs.com/package/tslib) as a dependency of individual npm packages to make usage of `_extends` and `_assign` in our compiled code more concise.
