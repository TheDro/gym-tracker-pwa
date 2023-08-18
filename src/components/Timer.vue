<template>
  <div class="text-center py-1">

    <div class="">
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

    <div class="py-1 text-2xl _active_rest_periods" v-if="status === 'pristine'">
      <div style="display: inline-block; width: 50%">
        <Button
          class="icon large"
          @click="incrementAll(-15, 'active')">
          --15
        </Button>

        <Icon name="sun" class="pl-2"/>
        {{ formatTime(timerState.activePeriod) }}

        <Button
          class="icon large"
          @click="incrementAll(15, 'active')">
          15++
        </Button>
      </div>
      <div style="display: inline-block; width: 50%">
        <Button
          class="icon large"
          @click="incrementAll(-15, 'rest')">
          --15
        </Button>

        <Icon name="moon" class="pl-2"/>
        {{ formatTime(timerState.restPeriod) }}

        <Button
          class="icon large"
          @click="incrementAll(15, 'rest')">
          15++
        </Button>
      </div>
     
    </div>

    <div class="text-2xl py-1" v-if="status !== 'pristine'">
      <Button v-if="status !== 'pristine'"
        class="icon large"
        @click="incrementAll(-15)">
        --15
      </Button>

      <Icon class="pl-2" :name="timerState.currentPeriod % 2 === 1 ? 'sun' : 'moon'" />
      {{ formatTime(timerState.remainingTimeDisplay) }}

      <Button v-if="status !== 'pristine'"
        class="icon large"
        @click="incrementAll(15)">
        15++
      </Button>
    </div>
    
    <div>
      <Button v-if="status !== 'pristine'"
        class="icon large"
        @click="increment(-15)">
        -15
      </Button>
      
      <Button
        class="icon large"
        aria-label="reset" 
        @click="reset()">
        <Icon name="reset" />
      </Button>

      <Button
        class="icon large"
        aria-label="play/pause"
        @click="playPause()">
        <Icon :name="{
          running: 'pause',
          complete: 'play',
          paused: 'play',
          pristine: 'play',
        }[status]"/>
      </Button>

      <Button v-if="status !== 'pristine'"
        class="icon large"
        @click="increment(15)">
        15+
      </Button>
    </div>
  </div>
</template>

<script>
import {reactive, computed, watchEffect} from 'vue'
import useGym from "../services/gym_service";
import { every } from '../helpers/date_helper';

let timerState = reactive({
  nSets: 3,
  activePeriod: 60,
  restPeriod: 60,
  currentPeriod: 1,
  startedAt: null,
  remainingTime: null,
  remainingTimeDisplay: null,
})
timerState.remainingTime = timerState.activePeriod
timerState.remainingTimeDisplay = timerState.remainingTime

export default {
  props: {
    exercise: {type: Object, required: false},
  },
  components: {},
  setup(props, context) {
    let state = reactive({
      
    })
    let running = computed(() => {
      return timerState.startedAt !== null
    })
    let status = computed(() => {
      if (timerState.startedAt === null && timerState.remainingTime === timerState.activePeriod) {
        return 'pristine'
      } else if (timerState.startedAt !== null) {
        return 'running'
      } else if (timerState.currentPeriod >= timerState.nSets*2) {
        return 'complete'
      } else {
        return 'paused'
      }
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
          updateDisplay()
          // TODO: This doesn't seem right
          playPause()
          return true
        } else if (timerState.currentPeriod % 2 == 1) {
          timerState.remainingTime = timerState.activePeriod
        } else if (timerState.currentPeriod % 2 == 0) {
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
      let currentPeriodType = timerState.currentPeriod % 2 == 1 ? 'active' : 'rest'
      periodType = periodType || currentPeriodType

      if (currentPeriodType === periodType) {
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
          updateDisplay()
          // TODO: This doesn't seem right
          playPause()
          return true
      }
    }

    return {state, timerState, running, status,
      playPause, reset, formatTime, increment, incrementAll, addSet}
  }
}

</script>

<style>
</style>
