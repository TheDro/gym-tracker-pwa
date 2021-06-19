<template>
  <h2 class="bg-green-100" >{{state.message}}</h2>
  <ul class="p-0">
    <li v-for="exercise in store.exercises"
        style="min-height: 2rem;"
        class="border-b-2 border-gray-200">
      <div class="flex flex-row">
        <ClickToEdit style="width: 50%" placeholder="New exercise" v-model="exercise.name" :single-line="true" />
        <div class="flex-grow"></div>
        <LastWorkouts :exercise="exercise"/>
      </div>
    </li>
    <li class="text-center"
        @click="onAddExercise()">
      <Icon name="addCircle"/> Add Exercise
    </li>
  </ul>
  <pre>{{store.exercises}}</pre>
</template>

<script>
import {reactive} from 'vue'
import useGym from "../services/gym_service";
import ClickToEdit from "./ClickToEdit";
import LastWorkouts from "./LastWorkouts";

export default {
  components: {ClickToEdit, LastWorkouts},
  setup() {
    let {store, addExercise} = useGym()
    let state = reactive({message: 'Exercises'})

    function onAddExercise() {
      console.log('add')
      addExercise()
    }

    return {state, store, onAddExercise}
  }
}

</script>

<style>

</style>
