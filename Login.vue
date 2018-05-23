<template>
  <div id="login">
    <router-link :to="{ name: 'home'}">Home</router-link>

    <br /><br />

    <h1>Login</h1>

      Username:
      <input type="text" v-model="username" placeholder="Enter username">
      <br /><br />
      Password:
      <input type="password" v-model="password" placeholder="Enter password">
      <br /><br />

      <input type="submit" v-on:click="req(); errorFlag=false">


    <div v-if="errorFlag" style="color: red;">
      <br />
      Details provided do not match records.
      {{reqBody()}}
      <br />
      Please check input.
    </div>

    <div v-if="userData" style="color: red;">
      <br />
      {{ redirect() }}
      Successfully logged in. Redirecting home...
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        userData: "",
        error: "",
        errorFlag: false,
        username: "",
        password: ""
      }
    },
    mounted: function () {
    },
    methods: {
      req: function () {
        this.$http.post("http://localhost:4941/api/v1/users/login", this.reqBody())
          .then(function (response) {
            this.errorFlag = false;
            this.userData = response.data;
            this.$root.$data.loggedInUser = response.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      reqBody: function () {
        return JSON.stringify({
          username: this.username,
          password: this.password
        })
      },
      redirect: function () {
        let thisInstance = this;
        setTimeout(function() {
          thisInstance.$router.push({name: 'home'})
        }, 2000);
      }
    }
  }

</script>

