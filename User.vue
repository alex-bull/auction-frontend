<template>
    <div>

      <router-link :to="{ name: 'home'}">Home</router-link>

      <br /><br /><br />

      <div v-if="errorFlag" style="color: red;">
        {{ error }}
      </div>

      <div v-if="!$root.$data.loggedInUser.id" style="color: red">
        {{ redirect() }}
      </div>


      <div v-if="user.username && $root.$data.loggedInUser.id">
        <div id="auction">
          <a href="JavaScript: void(0);" v-on:click="$router.go(-1)">Back</a>

          <br /><br />

          <table>
            <tr>
              <td>Username</td>
              <td>Given Name</td>
              <td>Family Name</td>
              <td v-if="user.email">Email</td>
              <td v-if="user.email">Account Balance</td>
            </tr>
            <tr>
              <td>{{ user.username }}</td>
              <td>{{ user.givenName }}</td>
              <td>{{ user.familyName }}</td>
              <td v-if="user.email">{{ user.email }}</td>
              <td v-if="user.email">{{ '$' + user.accountBalance }}</td>
            </tr>
          </table>
          <div v-if="user.email">
            <br/><br/>
            Edit:<br/>
            Given Name:
            <input type="text" placeholder="Enter new given name" v-model="givenname"><br/>
            Family Name:
            <input type="text" placeholder="Enter new family name" v-model="familyname"><br/>
            <input type="submit" v-on:click="patch">
          </div>
        </div>
      </div>

    </div>
</template>


<script>
  export default {
    data (){
      return{
        endpoint: "",
        error: "",
        errorFlag: false,
        response: "",
        user: "",
        payload: [],
        familyname: "",
        givenname: ""
      }
    },
    mounted: function () {
      this.getUser();
    },
    methods: {
      getUser: function () {
        this.errorFlag = false;
        this.$http.get('http://localhost:4941/api/v1/users/' + this.$route.params.id,
          {headers: {'X-Authorization' : this.$root.$data.loggedInUser.token}})
          .then(function (response) {
            this.user = response.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      patch: function () {
        this.errorFlag = false;
        this.payload = {};
        if(this.givenname){
          this.payload.givenName = this.givenname;
        }
        if(this.familyname){
          this.payload.familyName = this.familyname;
        }
        console.log(JSON.stringify(this.payload));
        this.payload = JSON.stringify(this.payload);
        this.$http.patch('http://localhost:4941/api/v1/users/' + this.$route.params.id,
          this.payload,
          {headers: {'X-Authorization' : this.$root.$data.loggedInUser.token}})
          .then(function (response) {
            this.user = response.data;
            this.getUser();
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      redirect: function () {
        this.$router.push({name: 'home'});
      }
    }
  }
</script>
