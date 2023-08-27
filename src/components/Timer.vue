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
        {{ formatTime(timerState.remainingTime) }}
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

let timerState = reactive({})

// let defaultTimerState = {
//   nSets: 3,
//   activePeriod: 60,
//   restPeriod: 60,
//   currentPeriod: 1,
//   currentPeriodType: 'active', // active or rest
//   startedAt: null,
//   currentPeriodTime: 60,
//   remainingTime: 60,
// }


let justLoaded = false
load()

watchEffect(() => {
  save()
})

function save() {
  let storage = JSON.stringify({
      nSets: timerState.nSets,
      activePeriod: timerState.activePeriod,
      restPeriod: timerState.restPeriod,
    }, null, 2)

  if (justLoaded) {
    justLoaded = false
    return
  }
  console.log('save timer!')
  localStorage.setItem('timer', storage)
}

function load() {
  console.log('load timer!')
  justLoaded = true
  let storage = localStorage.getItem('timer')
  let timer = JSON.parse(storage) || {
    nSets: 3,
    activePeriod: 60,
    restPeriod: 60,
  }
  Object.assign(timer, {
    currentPeriod: 1,
    currentPeriodType: 'active', // active or rest
    startedAt: null,
    currentPeriodTime: timer.activePeriod,
    remainingTime: timer.activePeriod,
  })
  Object.assign(timerState, timer)
}


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
    watchEffect(() => {
      if (timerState.startedAt === null && timerState.currentPeriodTime === timerState.activePeriod) {
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
      let remainingTime = timerState.currentPeriodTime - 
        (new Date() - timerState.startedAt)/1000
      if (remainingTime < 0) {
        timerState.currentPeriod += 1
        let currentPeriodType = timerState.currentPeriod % 2 == 1 ? 'active' : 'rest'
        timerState.startedAt = new Date(timerState.startedAt.valueOf() + 
          timerState.currentPeriodTime*1000)
        if (timerState.currentPeriod >= timerState.nSets*2) {
          timerState.currentPeriodTime = 0
          timerState.startedAt = null
          updateRemainingTime()
          return true
        } else if (currentPeriodType === 'active') {
          timerState.currentPeriodTime = timerState.activePeriod
        } else if (currentPeriodType === 'rest') {
          timerState.currentPeriodTime = timerState.restPeriod
        }

      }
      updateRemainingTime()
    }

    function playPause() {
      if (!timerState.startedAt) {
        timerState.startedAt = new Date()
        if (timerState.currentPeriod >= timerState.nSets*2) {
          timerState.currentPeriod = 1
          timerState.currentPeriodTime = timerState.activePeriod
        }
        handle = every(100, updateLoop)
      } else {
        timerState.currentPeriodTime -= (new Date() - timerState.startedAt)/1000
        timerState.startedAt = null
        handle?.stop()
      }
    }

    function reset() {
      timerState.currentPeriod = 1
      timerState.currentPeriodTime = timerState.activePeriod
      updateRemainingTime()
      if (timerState.startedAt) {timerState.startedAt = new Date()}
    }

    function formatTime(totalSeconds) {
      totalSeconds = Math.ceil(totalSeconds)
      let minutes = Math.floor(totalSeconds/60)
      let seconds = totalSeconds % 60
      return `${minutes}:${('00'+seconds).slice(-2)}`
    }

    function updateRemainingTime() {
      if (timerState.startedAt) {
        timerState.remainingTime = Math.max(0, timerState.currentPeriodTime - (new Date() - timerState.startedAt)/1000)
      } else {
        timerState.remainingTime = Math.max(0, timerState.currentPeriodTime)
      }
    }

    function increment(amount) {
      if (timerState.startedAt) {
        timerState.currentPeriodTime = Math.max(
          Math.round((new Date() - timerState.startedAt)/1000),
          timerState.currentPeriodTime + amount
        )
      } else {
        timerState.currentPeriodTime = Math.max(0, timerState.currentPeriodTime + amount)
      }
      updateRemainingTime()
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
        timerState.currentPeriodTime = 0
        timerState.startedAt = null
        updateRemainingTime()
        handle.stop()
      }
    }

    return {state, timerState,
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
