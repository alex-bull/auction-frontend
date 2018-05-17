<template>
    <div>

      <div v-if="errorFlag" style="color: red;">
        {{ error }}
      </div>

      <div v-if="$route.params.id">
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
              <td>Bid History</td>
            </tr>
            <tr>
              <td>{{ getAuction($route.params.id).title }}</td>
              <td></td>
              <td>{{ new Date(getAuction($route.params.id).startDateTime).toUTCString() }}</td>
              <td>{{ new Date(getAuction($route.params.id).endDateTime).toUTCString()}}</td>
              <td></td>
              <td>{{ getAuction($route.params.id).currentBid }}</td>
              <td></td>
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
        endpoint: "",
        error: "",
        errorFlag: false,
        auctions: [],
        categories: []
      }
    },
    mounted: function () {
      this.getAuctions();
      this.getCategories();
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
        this.endpoint = this.endpoint.concat("&category-id=" + this.categorySelection);
        this.$http.get(this.endpoint)
          .then(function (response) {
            this.auctions = response.data;
            this.auctions.sort();
          }, function (error) {
            this.error = error;
            this.errorFlag = true;
          });
      },

      getAuction: function (id) {
        for(let i = 0; i < this.auctions.length; i++){
          if(this.auctions[i].id === id){
            return this.auctions[i];
          }
        }
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
