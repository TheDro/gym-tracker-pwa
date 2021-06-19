<template>
  <h1>{{state.message}}</h1>
</template>

<script>
import {reactive} from 'vue'

export default {
  setup() {
    let state = reactive({message: 'Hello World'})
  
    return {state}
  }
}

</script>

<style>

</style>
