// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Toaster from 'v-toaster'
import 'v-toaster/dist/v-toaster.css'
Vue.config.productionTip = false;
Vue.use(Toaster, {timeout: 5000});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
