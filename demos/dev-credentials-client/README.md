# Client Web Demo for Developer Credential Package

This page will show API key and OAuth 2.0 app CRUD demo with help of `arcgis-rest-developer-credentials` package. First
step requires a user to log in
via [Authenticate with an ArcGIS identity](https://developers.arcgis.com/arcgis-rest-js/authentication/tutorials/authenticate-with-an-arcgis-identity-rest-js-browser/).
Then you can use the form to create an API key or switch to the OAuth 2.0 form to create an OAuth 2.0 app.
Once you've created an API key or OAuth 2.0 app, you can click on the item in the table below the form to edit it.

## Running this demo

1. Run `npm run build` in the repository's root directory.
2. Go into `demos/dev-credentials-client` and run `npm start` to spin up the development server.
3. Visit [http://localhost:8080](http://localhost:8080).

## Additional tools used

<table>
  <tr>
    <th>Description</th>
    <th>Tool</th>
  </tr>
  <tr>
    <td>Enhanced Multi-Select</td>
    <td><a href="https://select2.org/">Select2</a></td>
  </tr>
  <tr>
    <td>Table</td>
    <td><a href="https://datatables.net/">jQuery Data Table</a></td>
  </tr>
  <tr>
    <td>Others</td>
    <td>jQuery 3, Bootstrap 5</td>
  </tr>
</table>