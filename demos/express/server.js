require("isomorphic-fetch");
require("isomorphic-form-data");
const express = require("express");
const app = express();
const { UserSession } = require("@esri/arcgis-rest-auth");
const { clientId } = require("./config.json");

const credentials = {
  clientId,
  redirectUri: "http://localhost:3000/authenticate"
};

app.get("/authorize", function(req, res) {
  UserSession.authorize(credentials, res);
});

app.get("/authenticate", function(req, res) {
  UserSession.exchangeAuthorizationCode(
    credentials,
    req.query.code
  ).then(session => {
    res.send(session.token);
  });
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
