<template>
    <div>

      <router-link :to="{ name: 'home'}">Home</router-link>

      <br /><br /><br />

      <div v-if="errorFlag" style="color: red;">
        {{ error }}
      </div>

      <div v-else-if="$route.params.id">
        <div id="auction">
          <router-link :to="{ name: 'auctions'}">Back to Listings</router-link>

          <br /><br />

          <table>
            <tr>
              <td>Title</td>
              <td>Seller</td>
              <td>Auction Start</td>
              <td>Auction End</td>
              <td>Description</td>
              <td>Current Bid</td>
            </tr>
            <tr>
              <td>{{ auction.title }}</td>
              <td>{{ auction.seller.username }}</td>
              <td>{{ new Date(auction.startDateTime).toUTCString() }}</td>
              <td>{{ new Date(auction.endDateTime).toUTCString() }}</td>
              <td>{{ auction.description }}</td>
              <td>{{ auction.currentBid }}</td>
            </tr>
          </table>
          <br />
          <img style="max-width:400px" v-bind:src="'http://localhost:4941/api/v1/auctions/' + $route.params.id + '/photos'">
          <br /><br />
          <table>
            <tr>
              <td v-if="auction.bids[0]">Bid History:</td>
              <td v-else>No bids placed</td>
            </tr>
            <tr v-for="bid in bids">
              <td>{{ "Bid Amount: " + bid.amount + " &nbsp&nbspDate: " + new Date(bid.datetime).toUTCString() +
                " &nbsp&nbspBuyerID: " + bid.buyerId + " &nbsp&nbspBuyer Username: " + bid.buyerUsername}}</td>
            </tr>
          </table>
        </div>
      </div>

      <div v-else>
        <div id="auctions">

          <select v-model="filterSelection" title="" v-on:change="getAuctions">
            <option>All</option>
            <option>Active</option>
            <option>Expired</option>
          </select>

          <select v-model="categorySelection" title="" v-on:change="getAuctions">
            <option value="">All Categories</option>
            <option v-for="category in categories" v-bind:value="category.categoryId">
              {{category.categoryTitle}}
            </option>
          </select>

          <br />

          <input placeholder="Search" v-model="searchTerm" type="text" title="" v-on:keyup="getAuctions">

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

    </div>
</template>


<script>
  export default {
    data (){
      return{
        filterSelection: "All",
        categorySelection: "",
        searchTerm: "",
        endpoint: "",
        error: "",
        errorFlag: false,
        auctions: [],
        auction: "",
        bids: "",
        categories: []
      }
    },
    mounted: function () {
      this.getAuctions();
      this.getCategories();
      if(this.$route.params.id){
        this.getAuction(this.$route.params.id);
      }
    },
    updated : function () {
      if(this.$route.params.id){
        this.getAuction(this.$route.params.id);
      }
    },
    methods: {
      getAuctions: function () {
        if (this.filterSelection === "All") {
          this.endpoint = 'http://localhost:4941/api/v1/auctions?status=all';
        } else if (this.filterSelection === "Active") {
          this.endpoint = 'http://localhost:4941/api/v1/auctions?status=active';
        } else if (this.filterSelection === "Expired") {
          this.endpoint = 'http://localhost:4941/api/v1/auctions?status=expired';
        }
        this.endpoint = this.endpoint.concat("&category-id=" + this.categorySelection
          + "&q=" + this.searchTerm);
        this.$http.get(this.endpoint)
          .then(function (response) {
            this.auctions = response.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },

      getAuction: function (id) {
        this.$http.get('http://localhost:4941/api/v1/auctions/' + id)
          .then(function (response) {
            this.auction = response.data;
            this.bids = this.auction.bids.slice().reverse();
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },

      getCategories: function () {
        this.$http.get('http://localhost:4941/api/v1/categories')
          .then(function (response) {
            this.categories = response.data;
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      }
    }
  }
</script>
