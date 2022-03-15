const express = require("express");
const app = express();
const { ArcGISIdentityManager } = require("@esri/arcgis-rest-request");
const { clientId } = require("./config.json");

const credentials = {
  clientId,
  redirectUri: "http://localhost:3000/authenticate",
  expiration: 10
};

app.get("/authorize", function (req, res) {
  // send the user to the authorization screen
  ArcGISIdentityManager.authorize(credentials, res);
});

// the after authorizing the user is redirected to /authenticate
app.get("/authenticate", function (req, res) {
  if (credentials) {
    // the user will be redirected with an authorization code we will need to exchange for tokens.
    // After exchanging we will have a ArcGISIdentityManager we can use in REST JS.
    ArcGISIdentityManager.exchangeAuthorizationCode(credentials, req.query.code)
      .then((session) => {
        console.log(session);
        // get the users info
        return session.getUser();
      })
      .then((user) => {
        // send the info to the browser
        res.send(`<pre>${JSON.stringify(user, null, 2)}</pre>`);
      });
  } else {
    res.send("please visit http://localhost:3000/authorize");
  }
});

app.listen(3000, function () {
  console.log("visit http://localhost:3000/authorize to test the application!");
});
