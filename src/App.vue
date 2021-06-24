<template>
  <router-view/>
  <NavBar></NavBar>

</template>

<script>
import {useRouter} from 'vue-router'
import NavBar from "./components/NavBar.vue";

export default {
  components: {NavBar},
  setup() {

  }
}

</script>

<style>
label {
  font-weight: 700;
}
.page-title {
  margin: 0;
  text-align: center;
  background-color: #444;
  color: greenyellow;
  opacity: 1;
}
</style>
