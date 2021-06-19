<template>
  <h1 class="bg-red-100" >{{state.message}}</h1>
</template>

<script>
import {reactive} from 'vue'

export default {
  setup() {
    let state = reactive({message: 'Exercises'})
  
    return {state}
  }
}

</script>

<style>

</style>
