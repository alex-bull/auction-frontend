<template>
  <div>
    <h1>Home page</h1>


    <router-link :to="{ name: 'auctions' }">Auction Overview</router-link>
    <br/><br/>
    <div v-if="$root.$data.loggedInUser.id">
      <a href="javascript:void(0);" v-on:click="logout">Logout</a>
      <br/><br/>
      <router-link :to="{ name: 'create' }">Create Auction</router-link>
      <br/><br/>
      <router-link :to="{ name: 'wonauctions' }">Your Won Auctions</router-link>
      <br/><br/>
      <router-link :to="{ name: 'bidonauctions' }">Your Bid-on Auctions</router-link>
      <br/><br/>
      <router-link :to="{ name: 'activeauctions' }">Your Active Auctions</router-link>
      <br/><br/>
      <router-link :to="{ name: 'completedauctions' }">Your Completed Auctions</router-link>
      <br/><br/>
      <router-link :to="{ name: 'unwonauctions' }">Your Un-Won/Expired Auctions</router-link>
    </div>
    <div v-if="!$root.$data.loggedInUser.id">
      <router-link :to="{ name: 'register' }">Register</router-link>
      <br/><br/>
      <router-link :to="{ name: 'login' }">Login</router-link>
    </div>
    <br/><br/>

    <div v-if="successFlag" style="color: red;">You have logged out successfully</div>
    <div v-if="errorFlag" style="color: red;">Failed to log out</div>


  </div>
</template>

<script>
  export default {
    data() {
      return {
        userData: "",
        error: "",
        errorFlag: false,
        successFlag: false,
        username: "",
        password: ""
      }
    },
    mounted: function () {
    },
    methods: {
      logout: function () {
        this.$http.post("http://localhost:4941/api/v1/users/logout", '',
          {headers: {'X-Authorization' : this.$root.$data.loggedInUser.token}})
          .then(function () {
            this.$root.$data.loggedInUser.id = null;
            this.$root.$data.loggedInUser.token = null;
            this.errorFlag = false;
            this.successFlag = true;

          }, function (error) {
            this.error = error;
            this.errorFlag = true;
            this.successFlag = false;
          });
      }
    }
  }

</script>
