// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from 'Components/App'
import router from './routes'
import store from "./store";
import VueAxios from 'vue-axios'
import Axios from 'axios'
import FlagIcon from 'vue-flag-icon'
import VueVisible from 'vue-visible'
import VueProgressiveImage from 'vue-progressive-image' // https://www.vuetoolbox.com/projects/vue-progressive-image
import VueParticles from 'vue-particles'
import vuetify from '@/plugins/vuetify'
import Veevalidate from 'vee-validate'
import VueLoading from 'vuejs-loading-plugin'
import VueSweetalert2 from 'vue-sweetalert2';

Vue.use(Veevalidate)
Vue.use(vuetify)
Vue.use(VueParticles)
Vue.use(VueProgressiveImage)
Vue.use(FlagIcon)
Vue.use(VueVisible)
Vue.use(VueAxios, Axios)
Vue.use(VueLoading)
Vue.use(VueSweetalert2);

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');