<template>
    <div id="app">
      <router-view/>
    </div>
</template>

<script>
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../../node_modules/bootstrap/dist/js/bootstrap.min.js'
import '../../static/js/bar.js'
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Advent Pro', sans-serif;
  background-color: white;
}

.v-input__icon{
  width: auto;
}

.v-data-table span{
      font-size: 16px;
  }

.v-application .pl-4 {
    padding-left: 1.5rem!important;
}
</style>
