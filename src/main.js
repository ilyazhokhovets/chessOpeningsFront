import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store";
// import Chessboard from "./chessboardjs/js/chessboard"
// Vue.prototype.Chessboard = window.Chessboard;

Vue.config.productionTip = false

new Vue({
  // Chessboard,
  router,
  store,
  render: h => h(App)
}).$mount('#app')