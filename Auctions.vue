<template>
    <div>

      <router-link :to="{ name: 'home'}">Home</router-link>

      <br /><br /><br />

      <div v-if="errorFlag" style="color: red;">
        {{ error }}
      </div>

      <div v-if="$route.params.id && auction">
        <div id="auction">
          <a href="JavaScript: void(0);" v-on:click="$router.go(-1)">Back</a>

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
              <td><a href="JavaScript: void(0);" v-on:click="$router.push({name: 'user', params: {id: auction.seller.id}})">
                {{ auction.seller.username }}
              </a></td>
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
          <br/>
          <form v-if="$root.$data.loggedInUser.id && auction.seller.id !== $root.$data.loggedInUser.id " onsubmit="return false" v-on:submit="bid(); bidErrorFlag = false;">
            <input type="text" v-model="bidAmount" size="30"
                   placeholder="Enter bid amount (in whole dollars)" pattern="[0-9]+">
            <input type="submit">
          </form>
          <div v-if="bidErrorFlag" style="color: red;">
            {{ "Please check that bid is higher than starting bid and current bid. " +
            "And that the auction is active" }}
          </div>

          <div v-if="auction.seller.id === $root.$data.loggedInUser.id && auction.startDateTime > Date.now()">
            <br/>
            Edit Your Auction Details: <br/><br/>
            <form onsubmit="return false" v-on:submit="req()">
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
              Photo:
              <input type="file" v-on:change="onFileChange" accept="image/jpeg, image/png">
              <br /><br />

              <input type="submit">
            </form>
          </div>

        </div>
      </div>

      <div v-if="!$route.params.id">
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
              <td>
                <a href="javascript:void(0);" v-on:click="getAuction(auction.id)">
                  {{ auction.title }}
                </a>
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
        bidError: "",
        errorFlag: false,
        bidErrorFlag : false,
        response: "",
        auctions: [],
        auction: "",
        bids: "",
        bidAmount: "",
        categories: [],

        categoryId: "",
        title: "",
        description: "",
        startDateTime: "",
        endDateTime: "",
        reservePrice: "",
        startingBid: "",
        imageError: "",
        imageErrorFlag: false,
        image: ''
      }
    },
    mounted: function () {
      this.getAuctions();
      this.getCategories();
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
            this.bidErrorFlag = false;
            this.$router.push({ name: 'auction', params: { id: id }});
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
      },
      bid: function () {
        this.$http.post("http://localhost:4941/api/v1/auctions/" + this.$route.params.id + "/bids" +
          "?amount=" + this.bidAmount + "&id=" + this.$route.params.id, null,
          {headers: {'X-Authorization' : this.$root.$data.loggedInUser.token}})
          .then(function (response) {
            this.bidErrorFlag = false;
            this.response = response;
            this.getAuction(this.$route.params.id);
          }, function (error) {
            this.bidError = error;
            this.bidErrorFlag = true;
          });
      },
      onFileChange: function () {
        this.image = event.target.files[0];
        console.log(this.image.type);
      }
    }
  }
</script>
