<template>
  <h1 class="bg-green-100 text-center" >{{state.message}}</h1>
</template>

<script>
import {reactive} from 'vue'

export default {
  setup() {
    let state = reactive({message: 'Workout'})

    return {state}
  }
}

</script>

<style>

</style>
