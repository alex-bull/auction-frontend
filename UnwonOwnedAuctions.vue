<template>
    <div>

      <h1>Your Un-Won/Expired Actions</h1>

      <router-link :to="{ name: 'home'}">Home</router-link>

      <br />

      <div v-if="errorFlag" style="color: red;">
        {{ error }}
      </div>

      <div v-if="!$root.$data.loggedInUser.id">
        {{ redirect() }}
      </div>

      <div id="auctions">

        <br />

        <table>
          <tr v-for="auction in auctions">
            <td><router-link :to="{ name: 'auction', params: { id: auction.id }}">
              {{ auction.title }}
            </router-link></td>
            <td><img style="max-width:250px" v-bind:src="'http://localhost:4941/api/v1/auctions/' + auction.id + '/photos'"></td>
          </tr>
        </table>

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
        auctions: [],
        auction: ""
      }
    },
    mounted: function () {
      this.getAuctions();
    },
    methods: {
      getAuctions: function () {
        this.endpoint = "http://localhost:4941/api/v1/auctions?status=expired&seller=" + this.$root.$data.loggedInUser.id;
        this.$http.get(this.endpoint, {headers: {'X-Authorization' : this.$root.$data.loggedInUser.token}})
          .then(function (response) {
            this.auctions = response.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      redirect: function () {
          this.$router.push({name: 'home'});
      },
    }
  }
</script>
