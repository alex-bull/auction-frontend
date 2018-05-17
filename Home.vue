<template>
  <div>
    <h1>Home page</h1>


    <router-link :to="{ name: 'auctions' }">Auction Overview</router-link>

    <router-link :to="{ name: 'register' }">Register</router-link>

    <router-link :to="{ name: 'login' }">Login</router-link>



  </div>
</template>
