<template>
  <div id="create">

    <router-link :to="{ name: 'home'}">Home</router-link>


    <br /><br />

    <h1>Create Auction</h1>
    <form onsubmit="return false" v-on:submit="req">
      Category ID:
      <input type="number" v-model="categoryId" placeholder="Enter categoryID">
      <br /><br />
      Listing Name:
      <input type="text" v-model="title" placeholder="Enter listing name">
      <br /><br />
      Description:
      <input type="text" v-model="description" placeholder="Enter item description">
      <br /><br />
      Start Date/Time:
      <input type="datetime-local" v-model="startDateTime" placeholder="Enter start date">
      <br /><br />
      End Date/Time:
      <input type="datetime-local" v-model="endDateTime" placeholder="Enter end date">
      <br /><br />
      Reserve Price:
      <input type="number" v-model="reservePrice" placeholder="Enter reserve price">
      <br /><br />
      Starting Price:
      <input type="number" v-model="startingBid" placeholder="Enter start price">
      <br /><br />

      <input type="submit">
    </form>

    {{ reqBody() }}
    <div v-if="errorFlag" style="color: red;">
      <br />
      Details provided entered incorrectly or not unique.
      <br />
      Please check input.
    </div>

    <div v-if="userData" style="color: red;">
      <br />
      {{ redirect() }}
      Successfully created. Redirecting home...
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
        categoryId: "",
        title: "",
        description: "",
        startDateTime: "",
        endDateTime: "",
        reservePrice: "",
        startingBid: ""
      }
    },
    mounted: function () {
    },
    methods: {
      req: function () {
        this.$http.post("http://localhost:4941/api/v1/auctions", this.reqBody(),
          {headers: {'X-Authorization' : this.$root.$data.loggedInUser.token}})
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
          categoryId: parseInt(this.categoryId),
          title: this.title,
          description: this.description,
          startDateTime: new Date(this.startDateTime).getTime(),
          endDateTime: new Date(this.endDateTime).getTime(),
          reservePrice: parseInt(this.reservePrice),
          startingBid: parseInt(this.startingBid)
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
