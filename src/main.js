import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store";
import VueKonva from 'vue-konva'
// import VuetifyColorInput from 'vuetify-color-input/a-la-carte';

Vue.config.productionTip = false
Vue.use(VueKonva)
// Vue.use(VuetifyColorInput)
new Vue({

  router,
  store,

  render: h => h(App)
}).$mount('#app')


