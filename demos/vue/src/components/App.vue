<template>
  <div id="app-wrapper">
    <div class="jumbotron">
      <div class="container">
        <div id="page-header" class="row">
          <div id="logo-container" class="col-sm-3">
            <img id="logo" src="../assets/logo.svg">
          </div>
          <div class="col-sm-9">
            <h2>
              ArcGIS Rest JS Vue Demo
            </h2>
            <p>
              A simple vue application utilizing the arcgis-rest-js library.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-xs-12">
          <!-- Hook the has-error class to the boolean clientIdError. -->
          <div :class="{ 'has-error': clientIdError }" class="form-group">
            <label class="control-label">ClientID</label>
            <!-- Hook this input up to the clientId property. -->
            <input
              v-model="clientId"
              type="text"
              class="form-control"
            >
          </div>
          <p class="help-block">
            You can generate your own clientid by creating an application on the
            <a target='_blank' href='https://developers.arcgis.com/documentation/core-concepts/security-and-authentication/browser-based-user-logins/'>
              ArcGIS for Developers
            </a>
            website. Be sure to add
            <code>
              {{ redirect_uri }}
            </code>
            as a redirect uri for your application.
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-6">
          <!-- On click, this button will call the signInWithPopup function. -->
          <button class="btn btn-primary btn-block" @click="signInWithPopup">Sign In (with popup)</button>
        </div>
        <div class="col-xs-6">
          <!-- On click, this button will call the signInWithoutPopup function. -->
          <button class="btn btn-primary btn-block" @click="signInWithInlineRedirect">Sign In (inline redirect)</button>
        </div>
      </div>
      <!-- If there is a current session, render this bit. -->
      <div v-if="session" class="row">
        <div class="col-xs-12 text-center">
          <p class="bg-success info-panel">
            <!-- Display the current user's username. -->
            Logged in as {{ session.username }}.
          </p>
        </div>
      </div>
      <!-- If there is not a current session, render this instead. -->
      <div v-else class="row">
        <div class="col-xs-12 text-center">
          <p class="bg-info info-panel">
            Log in using one of the methods above to load rest of the page.
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-6 col-xs-offset-3 text-center">
          <button class="btn btn-block btn-warning" @click="signout">Sign Out</button>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading">
          <div class="row" style="margin-bottom: 0px">
            <div class="col-xs-4">
              <!-- This button will call the search function. It's disabled if there is no current session. -->
              <button @click="search" :disabled="!session" class="btn btn-success btn-block">
                <span class="glyphicon glyphicon-search"></span>
                Search Your Content
              </button>
            </div>
            <div class="col-xs-8">
              <div class="input-group">
                <div class="input-group-addon">
                  <span class="glyphicon glyphicon-filter"></span>
                </div>
                <!-- Hook up this input the the filter string property. It's disabled if there is no current session. -->
                <input
                  v-model="filterString"
                  :disabled="!session"
                  type="text"
                  class="form-control"
                  placeholder="Filter"
                >
              </div>
            </div>
          </div>
        </div>
        <!-- Render this only if their is a current search pending. -->
        <div v-if="searching" class="panel-body loading-table">
          <loader
            size='25'
            label='Fetching Data...'
            labelPosition='bottom'
          ></loader>
        </div>
        <!-- Render if there are search results. -->
        <table v-if="searchResults" class="table table-hover">
          <thead>
            <tr>
              <th>Title:</th>
              <th>ID:</th>
            </tr>
          </thead>
          <!-- If there are any search results, render them. -->
          <tbody v-if="searchResults.length > 0">
            <!-- Iterate over the search results and render a table row for each. -->
            <tr
              v-for="(item, index) in searchResults"
              :key="index"
            >
              <td>
                {{ item.title }}
              </td>
              <td>
                {{ item.id }}
              </td>
            </tr>
          </tbody>
          <!-- If no results were found, render this information. -->
          <tbody v-else>
            <tr class="danger">
              <td>
                No results found.
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
// Import the arcgis-rest-auth bit.
import { UserSession } from "@esri/arcgis-rest-auth";
// Import the arcgis-rest-request bit.
import { request } from "@esri/arcgis-rest-request";
// Import a simple loading indicator.
import Loader from "./Loader";

export default {
  name: "App",
  components: { Loader },
  data() {
    return {
      // Store these values on this instance.
      clientId: process.env.VUE_APP_CLIENTID || "QVQNb3XfDzoboWS0",
      clientIdError: false,
      filterString: null,
      searching: null,
      searchResults: null
    };
  },
  computed: {
    // Simple computed property to access the current applications path to
    // set it as the redirect_uri.
    redirect_uri() {
      return `${window.location.origin}${window.location.pathname}`;
    },
    session() {
      return this.$store.state.session;
    }
  },
  created() {
    // Upon creation, check to see if the session prop exists. If it does,
    // pre-populate the client id value.
    if (this.$store.state.session) {
      this.clientId = this.$store.state.session.clientId;
    }
  },
  mounted() {},
  watch: {
    // Set a watcher on the client id to validate it when it changes.
    clientId() {
      if (this.clientId === "") this.clientIdError = true;
      else this.clientIdError = false;
    }
  },
  methods: {
    // Function to validate that the client id exists.
    requireClientId() {
      if (this.clientIdError || !this.clientId) {
        this.clientIdError = true;
        return false;
      }
      return true;
    },
    // The signup with a popup workflow. When popup is true, the beginOAuth2 function
    // returns a promise.
    signInWithPopup() {
      if (this.requireClientId()) {
        UserSession.beginOAuth2({
          clientId: this.clientId,
          // Passing the clientid here is only a requirement of this demo where we allow
          // dynamic clientids via input. Typically you would have this hard-coded on
          // the authorization callback.
          redirectUri: `${this.redirect_uri}#/authenticate?clientID=${
            this.clientId
          }`,
          popup: true
        })
          .then(session => {
            // Upon successful login, update the application's store with this new
            // session.
            this.$store.dispatch("updateSession", session);
          })
          .catch(error => {
            console.error(error);
          });
      }
    },
    // The signup with an inline redirect workflow. In this case the user is just redirected to
    // the authorization page.
    signInWithInlineRedirect() {
      if (this.requireClientId()) {
        UserSession.beginOAuth2({
          clientId: this.clientId,
          redirectUri: `${this.redirect_uri}#/authenticate?clientID=${
            this.clientId
          }`,
          popup: false
        });
      }
    },
    // Function to log the use out of the current session.
    signout() {
      this.$store.dispatch("updateSession", null);
      this.searchResults = null;
    },
    // Function to call to search for a user's content.
    search() {
      // Update the properties for a new search.
      this.searchResults = null;
      this.searching = true;
      // Timeout is for effect.
      setTimeout(this.requestData, 300);
    },
    // Request data from AGOL.
    requestData() {
      // Construct a search query for only items the user owns. Add a filter if it exists.
      const query = `owner: ${this.$store.state.session.username}${
        this.filterString ? ` AND ${this.filterString}` : ""
      }`;
      // Construct the url for the endpoint with the session's portal and the constructed
      // query.
      const searchUrl = `${this.$store.state.session.portal}/search?q=${query}`;
      // Make the request. Tack on the current authentication session.
      request(searchUrl, { authentication: this.$store.state.session })
        .then(response => {
          this.searching = false;
          this.searchResults = response.results;
        })
        .catch(error => {
          this.searching = false;
          console.error(error);
        });
    }
  }
};
</script>

<style>
.jumbotron {
  padding-top: 0px;
  padding-bottom: 0px;
}

#logo-container {
  display: flex;
  justify-content: center;
  align-content: center;
}

#logo {
  width: 150px;
  height: 150px;
}

.info-panel {
  padding: 15px;
}

.loading-table {
  width: 100%;
  height: 150px;
  display: flex;
  align-content: center;
  justify-content: center;
}
</style>
