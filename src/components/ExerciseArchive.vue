<template>
  <h2 class="page-title" >{{state.message}}</h2>

  <div v-for="exercise in archivedExercises"
      style="min-height: 2rem;"
      class="border-b-2 border-gray-200">
    <div class="flex flex-row items-center">
      <div style="max-width: 40%" class="flex-shrink px-0">{{exercise.name}}</div>
      <div class="flex-grow"></div>
      <LastWorkouts :last="2" :exercise="exercise"/>

      <Button
          class="icon large"
          @click="unarchive(exercise)"
          aria-label="return">
        <Icon name="return"/>
      </Button>
      <Confirmable @click="remove(exercise)">
        <Button
            class="icon large"
            aria-label="delete">
          <Icon name="delete"/>
        </Button>
      </Confirmable>
    </div>
  </div>

  <div v-if="archivedExercises.length === 0" class="flex flex-row justify-center">
    <div class="p-4">
      No archived exercises
    </div>
  </div>
</template>

<script>
import {reactive, computed} from 'vue'
import useGym from "../services/gym_service";
import LastWorkouts from "./LastWorkouts";
import Confirmable from "./popup/Confirmable";

export default {
  components: {Confirmable, LastWorkouts},
  setup() {
    let {store, removeExercise} = useGym()
    let state = reactive({
      message: 'Archive',
    })
    let archivedExercises = computed(() => {
      let archive = store.exercises.toArray().filter((exercise) => {
        return exercise.archived
      })
      return archive
    })

    function unarchive(exercise) {
      exercise.archived = false
    }

    function remove(exercise) {
      removeExercise(exercise)
    }

    return {state, store, archivedExercises, unarchive, remove}
  }
}

</script>

<style>

</style>
