import Vue from 'vue'
import App from './App.vue'
import Home from './Home.vue'
import Auctions from './Auctions.vue';

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import VueResource from 'vue-resource';
Vue.use(VueResource);

Vue.http.options.emulateJSON = true;

const routes = [
  {
      path: "/",
      component: Home
  },
  {
      path: "/auctions",
      name: "auctions",
      component : Auctions
  },
  {
      path: "/auctions/:id",
      name: "auction",
      component : Auctions
  }
];


const router = new VueRouter({
  routes: routes,
  mode: 'history'
});


let vm = new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
