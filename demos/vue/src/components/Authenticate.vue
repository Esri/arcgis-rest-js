<template>
  <div id="authenticate-wrapper">
    <loader
      size='25'
      label='Authenticating...'
      labelPosition='bottom'
    ></loader>
  </div>
</template>

<script>
import { UserSession } from '@esri/arcgis-rest-auth';
import Main from '../main';
import Loader from './Loader';

export default {
  name: 'Authenticate',
  components: { Loader },
  props: [],
  data() {
    return {};
  },
  computed: {
    clientId () {
      return this.$route.query.clientID;
    },
  },
  created() {},
  mounted() {
    setTimeout(this.processAuthentication, 500);
  },
  methods: {
    processAuthentication() {
      const session = UserSession.completeOAuth2({
        clientId: this.clientId,
      });
      Main.$emit('login', session);
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
