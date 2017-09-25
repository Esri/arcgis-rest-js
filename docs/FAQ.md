## Why TypeScript

Using TypeScript allows us to add type information to request params and response structures. This vastly simplifies development. TypeScript also has excellent support for newer `async`/`await` patterns and for generating API documentation with [TypeDoc](http://typedoc.org/).

TypeScript compiles to JavaScript so you can use @esri/arcgis-rest-js in any JavaScript project. However if you use TypeScript you will get the benefits of type checking for free.

We also _really_ like TypeScript because it supports exporting to both [ES 2015 modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) (use `import`/`export`) and [UMD](http://davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/) modules/. This allows us to support a wide variety of module loaders and bundlers, including Browserify, Webpack, RequireJS, and Dojo 1 and 2.

## Comparison With Other Products

While this project shares some similarities with existing products such as the ArcGIS API for JavaScript and the ArcGIS API for Python, it is also unique. Like the ArcGIS API for Python, this library aims at being a low level scripting tools for interacting with and simplifying usage of the ArcGIS REST APIs, but where the ArcGIS API for Python focuses primarily on scripting and integration with Jupyter Notebooks this project provides generic tools for JavaScript applications running on a server, CLI, in a browser or as a script.

This project does have functional overlap with the ArcGIS API for JavaScript however the JavaScript API is closed source and specifically designed for the browser. The ArcGIS API for JavaScript provides reusable widgets that obfuscate underlying interaction with the REST API and in low level tasks exposes them via an experience that is similar to using the REST API directly. Examples of this include the search and analysis widgets. This project would instead aim to expose and demystify the underlying REST API and simplify common complex tasks not handled by the JavaScript API such as creating and modifying feature layer schema.
