# Running this demo locally

1. Make sure you run `npm run bootstrap` in the root folder to setup the dependencies
2. Register a new app on https://developers.arcgis.com
3. Add a redirect URL of `http://localhost:3000/authenticate` to your app.
4. Copy the `config.json.template` file, rename it to `config.json`
5. Copy your apps client id into your new `config.json` file.
6. `npm start`
7. Visit http://localhost:3000/authorize to start the OAuth 2.0 process.

