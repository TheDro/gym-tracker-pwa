<template>
  <span>{{time.minutes}}:{{time.seconds}}</span>
</template>


<script>
import {computed, reactive} from 'vue'
let [SECOND, MINUTE] = [1000, 60*1000]

function prependZeros(value) {
  return ('0'+value).substr(-2, 2)
}

export default {
  props: {
    time: {type: Number, default: 0}
  },
  setup(props) {
    let time = computed(() => {
      let minutes = Math.floor(props.time/MINUTE).toString()
      let seconds = prependZeros(Math.floor((props.time - minutes*MINUTE)/SECOND))
      return {minutes, seconds}
    })



    return {time}
  }
}

</script>

<style>

</style>