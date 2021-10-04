const express = require("express");
const app = express();
const { UserSession } = require("@esri/arcgis-rest-request");
const { clientId } = require("./config.json");

const credentials = {
  clientId,
  redirectUri: "http://localhost:3000/authenticate"
};

app.get("/authorize", function (req, res) {
  // send the user to the authorization screen
  UserSession.authorize(credentials, res);
});

// the after authorizing the user is redirected to /authenticate
app.get("/authenticate", function (req, res) {
  if (credentials) {
    // the user will be redirected with an authorization code we will need to exchange for tokens.
    // After exchanging we will have a UserSession we can use in REST JS.
    UserSession.exchangeAuthorizationCode(credentials, req.query.code)
      .then((session) => {
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
