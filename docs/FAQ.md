## Is this a _supported_ Esri product?

It is not. We offer no guarantees, SLAs, nor a product lifecycle to support planning.

This project is an open source collaboration between developers from a variety of teams at Esri that was initially developed to scratch an itch of our own. That said, we are actively recruiting outside contributors and fully expect that the tools here will be useful to a subset of our customers.

## Comparison with the ArcGIS API for JavaScript

The ArcGIS API for JavaScript is Esri's flagship product for building web applications to visualize, edit, map and analyze geospatial data. It is a feature complete client side API for working with the REST services based ArcGIS platform.
The ArcGIS API for JavaScript includes significant client side functionality including smart mapping, 3D rendering, geometric analysis and feature editing as well as full support for working with web maps and web scenes.

The goal of this project on the other hand is to provide a convenient binding to the underlying REST API for those who need to work directly with it from JavaScript. This project includes functional equivalents of the low-level request methods and identity management in the ArcGIS API for JavaScript, along with additional thin wrappers to assist developers in scripting against the ArcGIS REST API directly in Node.js and browser applications that do _not_ incorporate a map.

We aim to make interacting with the platform as intuitive as possible, but the surface area of the project currently does not nearly encompass the entire ArcGIS REST API.

## Comparison with the ArcGIS API for Python

This project is similar to the ArcGIS API for Python in many ways. Like the ArcGIS API for Python, this library aims to be a scripting tool that simplifies interacting with the ArcGIS REST API, but where the ArcGIS API for Python highlights integration with dataframes and Jupyter Notebooks for visualization and sharing this project provides only generic tools for JavaScript applications running on a server, CLI, in a browser or as a script.

## Why TypeScript

Using TypeScript allows us to add type information to request params and response structures. This vastly simplifies development. TypeScript also has excellent support for newer `async`/`await` patterns and for generating API documentation with [TypeDoc](http://typedoc.org/).

TypeScript compiles to JavaScript so you can use @esri/arcgis-rest-js in any JavaScript project. However if you use TypeScript you will get the benefits of type checking for free.

We also _really_ like TypeScript because it supports exporting to both [ES 2015 modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) (use `import`/`export`) and [UMD](http://davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/) modules. This allows us to support a wide variety of module loaders and bundlers, including Browserify, Webpack, RequireJS, and Dojo 1 and 2.

We include [`tslib`](https://www.npmjs.com/package/tslib) as a dependency of individual npm packages to make usage of `_extends` and `_assign` in our compiled code more concise.