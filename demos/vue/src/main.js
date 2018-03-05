// Import VueJS.
import Vue from 'vue';
// Using the router to treat this like a single-page application.
import Router from 'vue-router';
// Import the arcgis-rest-auth bit required for deserializing local storage sessions.
import { UserSession } from '@esri/arcgis-rest-auth';
// Importing the main application.
import App from './components/App.vue';
// Importing the authentication component that post-processes the OAuth response.
import Authenticate from './components/Authenticate.vue';

// Tell Vue to use the vue-router plugin.
Vue.use(Router);

// Define the router.
const router = new Router({
  routes: [
    // The root path will render the main application component.
    { path: '/', component: App },
    // At /authenticate, the authentication component will be rendered.
    { path: '/authenticate', component: Authenticate },
  ],
});

// Defining the application. It is being exported so it can be accessed in
// the other components to set up event tracking.
export default new Vue({
  el: '#app',
  router,
  data() {
    return {
      // The session object will be mounted on the main Vue instance and passed
      // to the child components.
      session: null,
    }
  },
  created() {
    // Enable some functionality if localStorage is supported.
    if (typeof(Storage) !== "undefined") {
      // Check to see if there is a previous session. If so, load it.
      this.loadSerializedSession();
      // If the browser supports local storage, add a watcher to the session
      // property to re-serialize it on change.
      this.$watch('session', (newValue, oldValue) => {
        if (newValue && newValue.serialize) {
          localStorage.setItem('__ARCGIS_REST_USER_SESSION__', newValue.serialize());
        } else {
          localStorage.removeItem('__ARCGIS_REST_USER_SESSION__');
        }
      });
    }
    // Set a listener for the 'login' event. When triggered, set this instance's
    // session to the event object.
    this.$on('login', (session) => {
      this.session = session;
    });
    // Set a listener for the 'logout' event. When triggered, destroy the session.
    this.$on('logout', () => {
      this.session = null;
    });
  },
  methods: {
    // Function to load any serialized session from local storage.
    loadSerializedSession() {
      const serializedSession = localStorage.getItem('__ARCGIS_REST_USER_SESSION__');
      if (serializedSession !== null && serializedSession !== "undefined") {
        // If there is a serialized session, deserialize it into a new session object.
        this.session = UserSession.deserialize(serializedSession);
      }
    },
  },
  // This template renders the correct component based on the current route.
  // The session prop is passed as well.
  template: '<router-view :session="session"/>',
});
