<template>
  <span class="inline-block overflow-x-hidden">

    <span
        v-for="(workout, index) in lastWorkouts" :key="workout.uid"
        :style="{'background-color': getColor(workout), width: '15vw'}"
        class="inline-block workout text-center"
        :class="{'active': isToday(workout)}"
        @click="onClick(workout)">
      <div class="overflow-x-hidden " style="white-space: nowrap" >
        <div>{{workout.nSets}}x{{workout.nReps}}</div>
      </div>
      <div>{{workout.weight}}</div>
    </span>
  </span>
</template>

<script>
import {reactive, computed} from 'vue'
import useGym from "../services/gym_service";

const DAY = 1000 * 60 * 60 * 24

function interpolate(min, max, t) {
  return min + (max - min) * t
}

export default {
  props: {
    exercise: {type: Object, required: true},
    last: {type: Number, default: 4},
  },
  emits: ['select'],
  components: {},
  setup(props, context) {
    let state = reactive({})
    let {store} = useGym()

    let lastWorkouts = computed(() => {
      let result = []
      for (let i = 0; i < props.exercise.workouts.length; i++) {
        let iExercise = props.exercise.workouts[i]
        if (iExercise.date <= store.currentDate) {
          result.push(iExercise)
          if (result.length >= props.last) break
        }
      }
      return result
    })

    function onClick(workout) {
      context.emit('select', {workout, exercise: props.exercise})
    }

    function isToday(workout) {
      return workout.date === store.currentDate
    }

    function getColor(workout) {
      if (isToday(workout)) {
        return 'hsl(99, 100%, 70%)'
      }

      let age = (new Date(store.currentDate) - new Date(workout.date)) / DAY
      let t = Math.exp(-age/7)
      let lightness = interpolate(100, 71, t)
      let result = `hsl(191, 100%, ${lightness}%)`
      return result
    }


    return {state, store, lastWorkouts, onClick, isToday, getColor}
  }
}

</script>

<style>

</style>
