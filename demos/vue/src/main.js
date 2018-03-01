import Vue from 'vue';
import Router from 'vue-router';
import App from './components/App.vue';
import Authenticate from './components/Authenticate.vue';

Vue.use(Router);

const router = new Router({
  routes: [
    { path: '/', component: App },
    { path: '/authenticate', component: Authenticate },
  ],
});

export default new Vue({
  el: '#app',
  router,
  data() {
    return {
      session: null,
    }
  },
  created() {
    this.$on('login', (session) => {
      this.session = session;
    });
  },
  template: '<router-view :session="session"/>',
});
