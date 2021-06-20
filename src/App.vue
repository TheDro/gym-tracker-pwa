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
</style>
