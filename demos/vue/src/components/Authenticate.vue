<template>
  <div id="authenticate-wrapper">
    <!-- Just a simple loading indicator -->
    <loader
      size='25'
      label='Authenticating...'
      labelPosition='bottom'
    ></loader>
  </div>
</template>

<script>
// Import the arcgis-rest-auth bit.
import { UserSession } from '@esri/arcgis-rest-auth';
// Import the main Vue instance. Will be used for event dispatching.
import Main from '../main';
// Import a simple loading indicator.
import Loader from './Loader';

export default {
  name: 'Authenticate',
  components: { Loader },
  props: [],
  data() {
    return {};
  },
  computed: {
    // Simple computed property to make it easier to access the client id
    // in the url.
    clientId () {
      return this.$route.query.clientID;
    },
  },
  created() {},
  mounted() {
    // When this component is rendered, set a timeout to process the authentication.
    // The timing is just for effect to show it's working.
    setTimeout(this.processAuthentication, 500);
  },
  methods: {
    processAuthentication() {
      // Complete the OAuth2 process. If in a popup, the window will close before
      // this finishes and will be handled by the beginOAuth2 function. If not in
      // a popup, it will proceed to the next couple lines.
      const session = UserSession.completeOAuth2({
        // Required as it is a piece of the key in the popup method. If not using
        // a popup, this shouldn't be required.
        clientId: this.clientId,
      });
      // If this component isn't in a popup, it will emit an event on the main Vue
      // instance that a successful login occurred with the session object attached.
      Main.$emit('login', session);
      // The app is the rerouted to the main application.
      this.$router.replace('/');
    },
  },
};
</script>

<style>
#authenticate-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
}
</style>
