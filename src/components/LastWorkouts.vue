<template>
  <span class="flex flex-row">

    <span class="flex-grow" v-for="(workout, index) in lastWorkouts"
      :class="{'bg-gray-200': index%2==0}"
      >
      <div>{{workout.nSets}}|{{workout.nReps}}</div>
      <div>{{workout.weight}}</div>
    </span>
  </span>
</template>

<script>
import {reactive, computed} from 'vue'
import useGym from "../services/gym_service";

export default {
  props: {
    exercise: {type: Object, required: true},
    last: {type: Number, default: 4},
  },
  components: {},
  setup(props) {
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
      console.log({result, exercise: props.exercise, currentDate: store.currentDate})
      return result
    })

    return {state, store, lastWorkouts}
  }
}

</script>

<style>

</style>
