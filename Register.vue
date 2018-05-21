<template>
  <div id="register">

    <router-link :to="{ name: 'home'}">Home</router-link>

    <br /><br />

    <h1>Register User</h1>
    <form onsubmit="return false" v-on:submit="req">
      Username:
      <input type="text" v-model="username" placeholder="Enter username" pattern="\w+">
      <br /><br />
      Given Name:
      <input type="text" v-model="givenName" placeholder="Enter given name" pattern="\w+">
      <br /><br />
      Family Name:
      <input type="text" v-model="familyName" placeholder="Enter family name" pattern="\w+">
      <br /><br />
      Email:
      <input type="email" v-model="email" placeholder="Enter email">
      <br /><br />
      Password:
      <input type="password" v-model="password" placeholder="Enter password">
      <br /><br />

      <input type="submit">
    </form>

    <div v-if="errorFlag" style="color: red;">
      <br />
      Details provided entered incorrectly or not unique.
      <br />
      Please check input.
    </div>

    <div v-if="userData" style="color: red;">
      <br />
      {{ redirect() }}
      Successfully registered. Redirecting home...
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
        email: "",
        username: "",
        password: "",
        givenName: "",
        familyName: ""
      }
    },
    mounted: function () {
    },
    methods: {
      req: function () {
        this.$http.post("http://localhost:4941/api/v1/users", this.reqBody())
          .then(function (response) {
            this.errorFlag = false;
            this.userData = response.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      reqBody: function () {
        return JSON.stringify({
          username: this.username,
          givenName: this.givenName,
          familyName: this.familyName,
          email: this.email,
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
