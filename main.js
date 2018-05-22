import Vue from 'vue'
import App from './App.vue'
import Home from './Home.vue'
import Auctions from './Auctions.vue';
import Register from './Register.vue';
import Login from './Login.vue';
import Create from './Create.vue';

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import VueResource from 'vue-resource';
Vue.use(VueResource);

Vue.http.options.emulateJSON = true;

const routes = [
  {
      path: "/",
      name: "home",
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
  },
  {
    path: "/register",
    name: "register",
    component : Register
  },
  {
    path: "/login",
    name: "login",
    component : Login
  },
  {
    path: "/create",
    name: "create",
    component : Create
  }
];


const router = new VueRouter({
  routes: routes,
  mode: 'history'
});

new Vue({
  el: '#app',
  router: router,
  render: h => h(App),
  data: {
    loggedInUser: Object
  }
});
