// Import VueJS.
import Vue from "vue";
// Using the router to treat this like a single-page application.
import Router from "vue-router";
// Import the store plugin, Vuex.
import Vuex from "vuex";
// Import the arcgis-rest-auth bit required for deserializing local storage sessions.
import { UserSession } from "@esri/arcgis-rest-auth";
// Importing the main application.
import App from "./components/App.vue";
// Importing the authentication component that post-processes the OAuth response.
import Authenticate from "./components/Authenticate.vue";

// Tell Vue to use the vue-router plugin.
Vue.use(Router);

// Define the router.
const router = new Router({
  routes: [
    // The root path will render the main application component.
    { path: "/", component: App },
    // At /authenticate, the authentication component will be rendered.
    { path: "/authenticate", component: Authenticate }
  ]
});

// Tell Vue to use the Vuex plugin.
Vue.use(Vuex);

// Define the application store.
const store = new Vuex.Store({
  state: {
    session: null
  },
  mutations: {
    setSession(state, data) {
      state.session = data;
    }
  },
  actions: {
    updateSession({ commit }, session) {
      // Apply the changes to the state's session.
      commit("setSession", session);
      // If the browser supports local storage, re-serialize it on change
      // and update the local storage.
      if (typeof Storage !== "undefined") {
        if (session && session.serialize) {
          localStorage.setItem(
            "__ARCGIS_REST_USER_SESSION__",
            session.serialize()
          );
        } else {
          localStorage.removeItem("__ARCGIS_REST_USER_SESSION__");
        }
      }
    }
  }
});

// Define the main Vue instance.
new Vue({
  el: "#app",
  router,
  store,
  data() {
    return {};
  },
  created() {
    // Load any previously serialized session.
    this.loadSerializedSession();
  },
  methods: {
    // Function to load any serialized session from local storage.
    loadSerializedSession() {
      if (typeof Storage !== "undefined") {
        const serializedSession = localStorage.getItem(
          "__ARCGIS_REST_USER_SESSION__"
        );
        if (serializedSession !== null && serializedSession !== "undefined") {
          // If there is a serialized session, deserialize it into a new session object.
          store.dispatch(
            "updateSession",
            UserSession.deserialize(serializedSession)
          );
        }
      }
    }
  },
  render(createElement) {
    return createElement("router-view");
  }
});
