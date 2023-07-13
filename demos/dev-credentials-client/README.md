# Client Web Demo for Developer Credential Package

This page will show API key and OAuth 2.0 app CRUD demo with help of `arcgis-rest-developer-credentials` package. First
step requires a user to log in
via [Authenticate with an ArcGIS identity](https://developers.arcgis.com/arcgis-rest-js/authentication/tutorials/authenticate-with-an-arcgis-identity-rest-js-browser/).
Next, you will use the form create an API key, which will be stored in RAM for simplicity purpose.
To retrieve or update, please click a specific key in the table and continue your operation. If the named token is
expired, page will be auto-logout.

## Running this demo

1. Run `npm run build` in the repository's root directory.
2. Run `npm start` to spin up the development server.
3. Visit [http://localhost:8080](http://localhost:8080).

## Credits

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