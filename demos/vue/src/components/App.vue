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
          <div :class="{ 'has-error': clientIdError }" class="form-group">
            <label class="control-label">Client ID</label>
            <input
              v-model="clientId"
              type="text"
              class="form-control"
              placeholder="Client ID"
            >
          </div>
          <p class="help-block">
            You can generate your own client id by creating an application on the
            <a target='_blank' href='https://developers.arcgis.com/'>
              ArcGIS for Developers
            </a>
            site. Be sure to add
            <code>
              {{ redirect_uri }}
            </code>
            as a redirect uri for your application.
          </p>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-6">
          <button class="btn btn-primary btn-block" @click="signInWithPopup()">Sign In (with popup)</button>
        </div>
        <div class="col-xs-6">
          <button class="btn btn-primary btn-block" @click="signInWithoutPopup()">Sign In (without popup)</button>
        </div>
      </div>
      <div v-if="session" class="row">
        <div class="col-xs-12 text-center">
          <p class="bg-success info-panel">
            Logged in as {{ session.username }}.
          </p>
        </div>
      </div>
      <div v-else class="row">
        <div class="col-xs-12 text-center">
          <p class="bg-info info-panel">
            Log in using one of the methods above to load rest of the page.
          </p>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading">
          <div class="row" style="margin-bottom: 0px">
            <div class="col-xs-4">
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
        <div v-if="searching" class="panel-body loading-table">
          <loader
            size='25'
            label='Fetching Data...'
            labelPosition='bottom'
          ></loader>
        </div>
        <table v-if="searchResults" class="table table-hover">
          <thead>
            <tr>
              <th>Title:</th>
              <th>ID:</th>
            </tr>
          </thead>
          <tbody v-if="searchResults.length > 0">
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
import { UserSession } from '@esri/arcgis-rest-auth';
import { request } from '@esri/arcgis-rest-request';
import Main from '../main';
import Loader from './Loader';

export default {
  name: 'App',
  components: { Loader },
  props: ['session'],
  data() {
    return {
      clientId: '',
      clientIdError: false,
      filterString: null,
      searching: null,
      searchResults: null,
    };
  },
  computed: {
    redirect_uri() {
      return `${window.location.origin}${window.location.pathname}`;
    }
  },
  created() {
    if (this.session) {
      this.clientId = this.session.clientId;
    }
  },
  mounted() {},
  watch: {
    clientId() {
      if (this.clientId === '') this.clientIdError = true;
      else this.clientIdError = false;
    },
  },
  methods: {
    requireClientId() {
      if (this.clientIdError || !this.clientId) {
        this.clientIdError = true;
        return false;
      }
      return true;
    },
    signInWithPopup() {
      if (this.requireClientId()) {
        UserSession.beginOAuth2({
          clientId: this.clientId,
          redirectUri: `${this.redirect_uri}#/authenticate?clientID=${this.clientId}`,
          popup: true,
        }).then((session) => {
          Main.$emit('login', session);
        }).catch(error => {
          console.error(error);
        });
      }
    },
    signInWithoutPopup() {
      if (this.requireClientId()) {
        UserSession.beginOAuth2({
          clientId: this.clientId,
          redirectUri: `${this.redirect_uri}#/authenticate?clientID=${this.clientId}`,
          popup: false,
        });
      }
    },
    search() {
      this.searching = true;
      setTimeout(this.requestData, 300);
    },
    requestData() {
      const query = `owner: ${this.session.username}${this.filterString ? ` AND ${this.filterString}`:''}`
      const searchUrl = `${this.session.portal}/search?q=${query}`;
      request(searchUrl, { authentication: this.session })
        .then((response) => {
          this.searching = false;
          this.searchResults = response.results;
        }).catch(error => {
          this.searching = false;
          console.error(error);
        });
    },
  },
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

.info-panel{
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
