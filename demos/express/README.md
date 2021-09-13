# ArcGIS REST JS Express Demo

This demo explains how to trigger OAuth 2.0 via custom server-side code

## Setup

1. Make sure you run `npm run build` in the root folder to setup the dependencies
2. Create a new application on https://developers.arcgis.com
3. Add `http://localhost:3000/authenticate` as a redirect uri for your application.
4. Copy the `config.json.template` file, rename it to `config.json`
5. Copy your application's client id into your new `config.json` file.

## Running the demo

6. `npm start`
7. Visit http://localhost:3000/authorize to start the OAuth 2.0 process.
