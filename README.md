# An ArcGIS REST API Client for JavaScript

This repository is for discussing and creating a fully featured JavaScript client API for browsers and Node.js.

## Origins

The idea for this library originated in a [Slack conversation between @patrickarlt and @ajturner](https://esri-runtime.slack.com/archives/C0CPMTHGD/p1499287765858737). @ajturner was looking for a library to automate creation of Feature Layers in ArcGIS Online for the Hub project.

## Key Collaborators

This list includes people who contributed to the original conversation and those who have previously contributed to similar projects.

* @ajturner - ArcGIS Hub
* @dbouwman - ArcGIS Hub
* @tomwayson - ArcGIS Hub
* @patricakrlt - ArcGIS for Developers
* @noahmulfinger - ArcGIS for Developers
* @araedavis - ArcGIS for Developers
* @nixta - Developer Outreach
* @jgravois - Developer Outreach

## Use Cases and Target Audience

This API would simplify interactions with the ArcGIS REST API, enabling the creation of powerful scripting tools in both Node.js and the browser that currently require deep knowledge of the REST API, and coordinating chained calls with a variety of complex parameters. This library would also enable downstream projects like the ArcGIS for Developers website and ArcGIS Hub to achieve identity management similar to the ArcGIS API for JavaScript.

While the tools proposed here would be useful in internal projects such as ArcGIS for Developers and ArcGIS Hub, they also strongly target outside developers who need to script and automate the platform but do not know or are not willing to integrate the ArcGIS API for Python into their projects. This project will also have appeal to enterprise developers who have existing Node.js systems and want to integrate with ArcGIS.

## Required Functionality

* Manage feature layers
   * Create new feature layers
   * Add/Remove/Update fields in feature layers
   * Query and edit features
   * Get statistics
* Make interacting with premium ArcGIS Online services more intuitive
   * Geocoding
   * Routing
   * Geoenrichment
   * Spatial Analysis
   * Elevation Analysis
* Managing groups and users
   * Create/invite new users
   * Create/edit/delete/share with groups
* Manage content
   * Create, edit and delete items, maps and scenes
* Handle authentication and identity
* Compatible with Node 6+ and the 2 latest releases of every browser and IE 11.

## Comparison With Other Products

While this project shares some similarities with existing products such as the ArcGIS API for JavaScript and the ArcGIS API for Python, it is also unique. Like the ArcGIS API for Python, this library aims at being a low level scripting tools for interacting with and simplifying usage of the ArcGIS REST APIs, but where the ArcGIS API for Python focuses primarily on scripting and integration with Jupyter Notebooks this project provides generic tools for JavaScript applications running on a server, CLI, in a browser or as a script.

This project does have functional overlap with the ArcGIS API for JavaScript however the JavaScript API closed source, specifically designed for the browser. The ArcGIS API for JavaScript provides reusable widgets that obfuscate underlying interaction with the REST API and in low level tasks exposes them via an experience that is similar to using the REST API directly. Examples of this include the search and analysis widgets. This project would instead aim to expose and demystify the underlying REST API and simplify common complex tasks not handled by the JavaScript API such as creating and modifying feature layer schema.

## Prior Projects

* [node-arcgis](https://github.com/Esri/node-arcgis) - Originally started by Nik Wise and currently maintained by John Gravois this library wraps a large amount of functionality for ArcGIS Online into a single API. However this library lacks much key functionality and does not handle authentication at all leaving it to the user to obtain and manage tokens. This library also lacks a significant test suite.
* [geoservices.js](https://github.com/Esri/geoservices-js) - Originally created by Jerry Seivert to wrap the [Geoservices](https://geoservices.github.io/) specification it is currently maintained by John Gravois. However this library does not fully implement the specification, handle authentication with ArcGIS or work in browsers.
* ArcGIS for Developers - The developers website has a large amount of internal tooling for working with Portal APIs and publishing feature services, we have plans to add additional features that would require either creating our own implementations or writing a common implementation in this project.
* Koop -
* ArcGIS Hub -

## Project Architecture

As with any new JavaScript project there are numerous decisions to make regarding which technologies to use. I will make some recommendations here but these are all up for debate.

* Implement this project as a [monorepo managed with Lerna](https://lernajs.io/). The mono repo approach will allow us to manage distinct packages like `arcgis-rest-geocoding` and separate functionality while sharing build, test and documentation tooling.
* Author the library in [TypeScript](https://www.typescriptlang.org/). Using TypeScript will allow us to add type information to request params and response structures which vastly simplifies development. TypeScript also has excellent support for newer `async`/`await` patterns with miminal code overhead and can publish to any module format we might need to support. Additionally TypeScript has excellent support for generating API documentation with [TypeDoc](http://typedoc.org/). TypeScript also has better internal adoption since Dojo 2 is using it as well as the JS API, Insights and the ArcGIS for Developers site.
* Would recommend using a Node/browser HTTP library like [Axios](https://github.com/mzabriskie/axios) which also has support for mocking in tests via [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter).
* Testing is a concern. I initially thought that we could simply use Karma to test all the code. However Karma can only be used to test browser based code. We could however use the `jasmine` command line tool it would just mean we would have to compile the TypeScript source first and then run the Jasmine CLI tools. Karma would use the `karma-typescript` plugin and run the browser tests. An alternative to this might be to use [The Intern](https://theintern.github.io/) setup according to this [blog post about testing with TypeScript](https://www.sitepen.com/blog/2015/03/24/testing-typescript-with-intern/). However the Intern doesn't have super great support for TypeScript currently though these issues should be solved in this Falls Intern 4 release.

It is worth noting that a TypeScript/Intern approach aligns perfectly with the direction of the JavaScript API team.

## Packages

* [`arcgis-rest-core`](./packages/arcgis-core/) - Handles common functionality across all aspects of `arcgis-rest`.
* [`arcgis-rest-auth`](./packages/arcgis-core) - Provides methods for authenticating named users and applications for `arcgis-rest`.
* [`arcgis-rest-geocoding`](./packages/arcgis-geocoding) - Geocoding wrapper for `arcgis-rest`
