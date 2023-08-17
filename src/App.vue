<template>
  <div v-if="state.message">{{state.message}}</div>
  <!-- <VCal style="display: none"/> -->
  <router-view/>
  <div class="spacer"></div>
  <NavBar></NavBar>

</template>

<script>
import NavBar from "./components/NavBar.vue";
import {reactive} from 'vue'
import {Calendar as VCal} from 'v-calendar'
import Timer from './components/Timer.vue'

export default {
  components: {NavBar, VCal, Timer},
  setup() {
    let state = reactive({message: ''})

    return {state}
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
  color: #5ed7ff;
  opacity: 1;
}
.spacer {
  height: 4rem;
}
</style>
