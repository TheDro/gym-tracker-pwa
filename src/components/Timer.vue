<template>
  <div class="text-center py-1 background" :style="{'background-color': state.backgroundColor}">
    
    <div class="timer-row gap-2 flex items-center justify-center">
      <Button 
        class="icon large"
        @click="addSet(-1)">
        <Icon name="minus" />
      </Button>
      {{ timerState.nSets - Math.floor(timerState.currentPeriod/2) }} sets left
      <Button 
        class="icon large"
        @click="addSet(1)">
        <Icon name="plus" />
      </Button>
    </div>

    <div class="text-2xl" v-if="state.status === 'pristine'">
      <div class="timer-row" stylee="display: inline-block; width: 50%">
        <Button
          class="icon large"
          @click="incrementAll(-15, 'active')">
          --15
        </Button>

        <Icon name="active" style="transform: translateY(2px)" class="pl-2"/>
        {{ formatTime(timerState.activePeriod) }}

        <Button
          class="icon large"
          @click="incrementAll(15, 'active')">
          15++
        </Button>
      </div>

      <div class="timer-row">
        <Button
          class="icon large"
          @click="incrementAll(-15, 'rest')">
          --15
        </Button>

        <Icon name="rest" style="transform: translateY(2px)" class="pl-2"/>
        {{ formatTime(timerState.restPeriod) }}

        <Button
          class="icon large"
          @click="incrementAll(15, 'rest')">
          15++
        </Button>
      </div>
     
    </div>

    <div class="timer-double-row text-7xl flex items-center justify-center" v-if="state.status !== 'pristine'">
      <Button v-if="state.status !== 'pristine'"
        class="icon large"
        @click="incrementAll(-15)">
        --15
      </Button>

      <Icon 
        style="line-height: 0"
        class="pl-2" 
        :size="32" 
        :name="timerState.currentPeriodType" 
      />
      <span class="pr-2" style="transform: translateY(-0.25rem)">
        {{ formatTime(timerState.remainingTimeDisplay) }}
      </span>
      <Button v-if="state.status !== 'pristine'"
        class="icon large"
        @click="incrementAll(15)">
        15++
      </Button>
    </div>
    
    <div class="timer-row">
      <Button v-if="state.status === 'running' || state.status === 'paused'"
        class="icon large"
        @click="increment(-15)">
        -15
      </Button>
      
      <Button
        :disabled="state.status === 'running'"
        class="icon large"
        aria-label="reset" 
        @click="reset()">
        <Icon name="reset" />
      </Button>

      <Button
        class="icon large"
        aria-label="play/pause"
        @click="playPause()">
        <Icon :name="state.playButton"/>
      </Button>

      <Button v-if="state.status === 'running' || state.status === 'paused'"
        class="icon large"
        @click="increment(15)">
        15+
      </Button>
    </div>
  </div>
</template>

<script>
import {reactive, computed, watchEffect} from 'vue'
import {every} from '../helpers/date_helper'

let timerState = reactive({
  nSets: 3,
  activePeriod: 60,
  restPeriod: 60,
  currentPeriod: 1,
  currentPeriodType: 'active', // active or rest
  startedAt: null,
  remainingTime: null,
  remainingTimeDisplay: null,
})
timerState.remainingTime = timerState.activePeriod
timerState.remainingTimeDisplay = timerState.remainingTime

watchEffect(() => {
  timerState.currentPeriodType = timerState.currentPeriod % 2 == 1 ? 'active' : 'rest'
})

export default {
  props: {
    exercise: {type: Object, required: false},
  },
  components: {},
  setup(props, context) {
    let state = reactive({
      status: 'pristine',
      backgroundColor: 'white',
      playButton: 'play',
    })
    let running = computed(() => {
      return timerState.startedAt !== null
    })
    watchEffect(() => {
      if (timerState.startedAt === null && timerState.remainingTime === timerState.activePeriod) {
        state.status = 'pristine'
      } else if (timerState.startedAt !== null) {
        state.status = 'running'
      } else if (timerState.currentPeriod >= timerState.nSets*2) {
        state.status = 'complete'
      } else {
        state.status = 'paused'
      }
    })
    watchEffect(() => {
      if (state.status === 'running' && timerState.currentPeriodType === 'active') {
        state.backgroundColor = 'lightgreen'
      } else if (state.status === 'running' && timerState.currentPeriodType === 'rest') {
        state.backgroundColor = 'lightskyblue'
      } else if (state.status === 'paused') {
        state.backgroundColor = 'rgb(255, 255, 154)' // light yellow
      } else {
        state.backgroundColor = 'white'
      }
    })
    watchEffect(() => {
      state.playButton = state.status === 'running' ? 'pause' : 'play'
    })
    

    let handle = null

    function updateLoop() {
      let actualRemainingTime = timerState.remainingTime - 
        (new Date() - timerState.startedAt)/1000
      if (actualRemainingTime < 0) {
        timerState.currentPeriod += 1
        timerState.startedAt = new Date(timerState.startedAt.valueOf() + 
          timerState.remainingTime*1000)
        if (timerState.currentPeriod >= timerState.nSets*2) {
          timerState.remainingTime = 0
          timerState.startedAt = null
          updateDisplay()
          return true
        } else if (timerState.currentPeriodType === 'active') {
          timerState.remainingTime = timerState.activePeriod
        } else if (timerState.currentPeriodType === 'rest') {
          timerState.remainingTime = timerState.restPeriod
        }

      }
      updateDisplay()
    }

    function playPause() {
      if (!timerState.startedAt) {
        timerState.startedAt = new Date()
        if (timerState.currentPeriod >= timerState.nSets*2) {
          timerState.currentPeriod = 1
          timerState.remainingTime = timerState.activePeriod
        }
        handle = every(100, updateLoop)
      } else {
        timerState.remainingTime -= (new Date() - timerState.startedAt)/1000
        timerState.startedAt = null
        handle?.stop()
      }
    }

    function reset() {
      timerState.currentPeriod = 1
      timerState.remainingTime = timerState.activePeriod
      updateDisplay()
      if (timerState.startedAt) {timerState.startedAt = new Date()}
    }

    function formatTime(totalSeconds) {
      totalSeconds = Math.ceil(totalSeconds)
      let minutes = Math.floor(totalSeconds/60)
      let seconds = totalSeconds % 60
      return `${minutes}:${('00'+seconds).slice(-2)}`
    }

    function updateDisplay() {
      if (timerState.startedAt) {
        timerState.remainingTimeDisplay = Math.max(0, timerState.remainingTime - (new Date() - timerState.startedAt)/1000)
      } else {
        timerState.remainingTimeDisplay = Math.max(0, timerState.remainingTime)
      }
    }

    function increment(amount) {
      if (timerState.startedAt) {
        timerState.remainingTime = Math.max(
          Math.round((new Date() - timerState.startedAt)/1000),
          timerState.remainingTime + amount
        )
      } else {
        timerState.remainingTime = Math.max(0, timerState.remainingTime + amount)
      }
      updateDisplay()
    }

    function incrementAll(amount, periodType = null) {
      periodType = periodType || timerState.currentPeriodType

      if (timerState.currentPeriodType === periodType) {
        increment(amount)
      }
      if (periodType === 'active') {
        timerState.activePeriod = Math.max(0, timerState.activePeriod + amount)
      } else if (periodType === 'rest') {
        timerState.restPeriod = Math.max(0, timerState.restPeriod + amount)
      }
    }

    function addSet(amount) {
      timerState.nSets = Math.max(1, timerState.nSets + amount)
      if (timerState.currentPeriod >= timerState.nSets*2) {
        timerState.remainingTime = 0
        timerState.startedAt = null
        updateDisplay()
        handle.stop()
      }
    }

    return {state, timerState, running,
      playPause, reset, formatTime, increment, incrementAll, addSet}
  }
}

</script>

<style scoped>
.background {
  transition: background-color 0.3s;
  
}
button.icon, 
button.icon:hover {
  background-color: rgba(150,150,150, 0.1);
}

.timer-row {
  height: 2.75rem;
  padding: 0.25rem;
}
.timer-double-row {
  height: 5.5rem;
  padding: 0.25rem;
}
</style>
