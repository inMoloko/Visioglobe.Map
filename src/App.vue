<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

  window.$ = window.jQuery = require('jquery');
  //import 'visioglobe'
  //window.vg = require('visioglobe');
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
</style>
