<template>
  <h1 class="m-0 bg-green-100 text-center" >{{state.message}}</h1>
  <ul class="p-0">

    <li v-for="exercise in exercises"
        style="min-height: 2rem;"
        class="border-b-2 border-gray-200">
      <div class="flex flex-row items-center">
        <div class="flex-grow">{{exercise.name}}</div>
        <div class="flex-grow"></div>
        <LastWorkouts style="width: 50%" :last="4" :exercise="exercise"/>
      </div>
    </li>
  </ul>
</template>

<script>
import IndexArray from "index-array";
import {reactive, computed} from 'vue'
import useGym from "../services/gym_service";
import LastWorkouts from "./LastWorkouts";

export default {
  components: {
    LastWorkouts
  },
  setup() {
    let {store} = useGym()
    let state = reactive({
      message: 'Workout',
    })

    let exercises = computed(() => {
      let result = store.exercises.toArray().filter((exercise) => {
        return !!exercise.placeholders.fetch({date: store.currentDate})
      })
      result = new IndexArray(...result)
      console.log({result})
      return result
    })

    console.log('workout setup')

    return {state, store, exercises}
  }
}

</script>

<style>

</style>
