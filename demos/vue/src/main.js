import Vue from 'vue';
// Using the router to treat this like a single-page application.
import Router from 'vue-router';
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
    // Set a listener for the 'login' event. When triggered, set this instance's
    // session to the event object.
    this.$on('login', (session) => {
      this.session = session;
    });
  },
  // This template renders the correct component based on the current route.
  // The session prop is passed as well.
  template: '<router-view :session="session"/>',
});
