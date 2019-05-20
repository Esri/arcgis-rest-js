const fetch = require("node-fetch");
require("isomorphic-form-data");
const express = require("express");
const app = express();
const { setDefaultRequestOptions } = require('@esri/arcgis-rest-request');
const { UserSession } = require("@esri/arcgis-rest-auth");
const { clientId } = require("./config.json");

// use node-fetch for each request instead of relying on a global
setDefaultRequestOptions({ fetch })

const credentials = {
  clientId,
  redirectUri: "http://localhost:3000/authenticate"
};

app.get("/authorize", function(req, res) {
  UserSession.authorize(credentials, res);
});

app.get("/authenticate", function(req, res) {
  if (credentials) {
    UserSession.exchangeAuthorizationCode(
      credentials,
      req.query.code
    ).then(session => {
      res.send(session.token);
    });
  } else {
    res.send("please visit http://localhost:3000/authorize");
  }

});

app.listen(3000, function() {
  console.log("visit http://localhost:3000/authorize to test the application!");
});
