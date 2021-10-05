<template>
  <div class="px-4 py-0">
    <h4 class="p-0 text-center">Timer ({{timer.currentState}})</h4>
    <div class="font-bold text-5xl text-center">
      <TimeDisplay :time="timer.currentTime"/>
    </div>

    <div class="flex flex-row">
      <div class="text-center flex-grow mx-2">
        <label>Sets</label>
        <ScrollPicker v-model="state.nSets" :options="state.setRange"/>
      </div>
      <div class="text-center flex-grow mx-2">
        <label>Active</label>
        <div class="flex flex-row items-center">
          <ScrollPicker v-model="state.activeMinutes" :options="state.minuteRange"/>
          <div class="font-bold">:</div>
          <ScrollPicker v-model="state.activeSeconds" :options="state.secondRange"/>
        </div>
      </div>
      <div class="text-center flex-grow mx-2">
        <label>Rest</label>
        <div class="flex flex-row items-center">
          <ScrollPicker v-model="state.restMinutes" :options="state.minuteRange"/>
          <div class="font-bold">:</div>
          <ScrollPicker v-model="state.restSeconds" :options="state.secondRange"/>
        </div>
      </div>
    </div>

    <div class="flex flex-row p-4">
      <Button class="outline" @click="stopTimer()">Stop</Button>
      <div class="flex-grow"></div>
      <Button @click="startTimer()">Start</Button>
    </div>

  </div>
</template>


<script>
import {computed, reactive, onUnmounted} from 'vue'
import ScrollPicker from "../base/ScrollPicker";
import TimeDisplay from "./TimeDisplay";
import _ from "lodash";

function prependZeros(range) {
  return range.map((value) => {
    return ('0'+value).substr(-2, 2)
  })
}

let [SECOND, MINUTE] = [1000, 60*1000]

export default {
  components: {ScrollPicker, TimeDisplay},
  setup() {
    let state = reactive({
      nSets: 1,
      activeMinutes: '1',
      activeSeconds: '00',
      restMinutes: '1',
      restSeconds: '00',
      setRange: _.range(1,50),
      minuteRange: _.range(0, 60).map(value => value.toString()),
      secondRange: prependZeros(_.range(0, 60, 5)),
    })
    let activeTime = computed(() => {
      return state.activeMinutes*MINUTE + state.activeSeconds*SECOND
    })
    let restTime = computed(() => {
      return state.restMinutes*MINUTE + state.restSeconds*SECOND
    })



    function adjustActiveTime(deltaS) {
      let delta = deltaS*SECOND
      let time = state.activeMinutes*MINUTE + state.activeSeconds*SECOND
      time = Math.max(time + delta, 0)
      state.activeMinutes = Math.floor(time/MINUTE).toString()
      state.activeSeconds = prependZeros(time - state.activeMinutes*MINUTE)
    }

    function adjustRestTime(deltaS) {
      let delta = deltaS*SECOND
      let time = state.restMinutes*MINUTE + state.restSeconds*SECOND
      time = Math.max(time + delta, 0)
      state.restMinutes = Math.floor(time/MINUTE).toString()
      state.restSeconds = prependZeros(time - state.restMinutes*MINUTE)
    }


    let STATES = {ACTIVE: 'ACTIVE', REST: 'REST', COMPLETE: 'COMPLETE'}

    let timer = reactive({
      startTime: null,
      stopTime: null,
      currentState: null,
      currentSet: 0,
      currentTime: 0,
      interval: null,
      paused: true,
    })
    window.timer = timer

    function updateTimer() {
      console.log('update')
      let now = new Date()
      if (timer.startTime === null || timer.currentState === null) {
        timer.startTime = new Date()
        timer.currentState = STATES.ACTIVE
      }
      if (timer.currentState === STATES.ACTIVE) {

        if (now > new Date(timer.startTime.valueOf() + activeTime.value)) {
          timer.startTime = new Date(timer.startTime.valueOf() + activeTime.value)
          timer.currentState = STATES.REST
        }
      }
      if (timer.currentState === STATES.REST) {
        console.log('rest')
        if (timer.currentSet >= state.nSets - 1) {
          console.log('complete!')
          timer.currentState = STATES.COMPLETE
          timer.currentTime = 0
          timer.startTime = null
          clearInterval(timer.interval)
          return
        }
        if (now > new Date(timer.startTime.valueOf() + restTime.value)) {
          timer.startTime = new Date(timer.startTime.valueOf() + restTime.value)
          timer.currentState = STATES.ACTIVE
          timer.currentSet++
        }
      }
      timer.currentTime = now - timer.startTime
    }

    function startTimer() {
      timer.paused = false
      if (timer.currentState === STATES.COMPLETE) {
        timer.currentState = null
      }
      if (!timer.stopTime) {
        timer.startTime = new Date()
      } else {
        timer.startTime = new Date(timer.startTime.valueOf() + (new Date() - timer.stopTime))
        timer.stopTime = null
      }
      timer.interval = setInterval(updateTimer, 500)
    }

    function stopTimer() {
      timer.paused = true
      timer.stopTime = new Date()
      clearInterval(timer.interval)
    }

    onUnmounted(() => {
      clearInterval(timer.interval)
    })

    return {state, timer, startTimer, stopTimer}
  }
}

</script>

<style>

</style>