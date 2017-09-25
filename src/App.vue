<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    margin: 0;
  }

  #app {
    height: 100%;
    width: 100%;
  }

  .v-toaster div.v-toast.v-toast-error {
    background-color: #df6d69;
    border-color: #df6d69;
  }
</style>
