<template>
  <span class="inline-block overflow-x-hidden">

    <span
        v-for="(workout, index) in lastWorkouts" :key="workout.uid"
        style="width: 15vw"
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

    return {state, store, lastWorkouts, onClick, isToday}
  }
}

</script>

<style>
.workout:nth-child(2n-1) {
  background-color: rgb(229, 231, 235);
}

.workout.active {
  background-color: greenyellow;
}
</style>
