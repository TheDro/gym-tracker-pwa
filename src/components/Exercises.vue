<template>
  <h2 class="page-title" >{{state.message}}</h2>
  <ul class="p-0">

    <li v-for="exercise in store.exercises"
        style="min-height: 2rem;"
        class="border-b-2 border-gray-200">
      <div class="flex flex-row items-center">
        <div style="max-width: 45%" class="flex-shrink px-2">{{exercise.name}}</div>
        <div class="flex-grow"></div>
        <LastWorkouts :last="2" :exercise="exercise"/>
        <Modal :controller="modalController">
          <template #target>
            <Button class="icon large" aria-label="edit"><Icon name="edit"/></Button>
          </template>
          <template #content>
            <ExerciseEditModal
                title="Edit exercise"
                :exercise="exercise"
                @save="modalController.close"
                @cancel="modalController.close"/>
          </template>
        </Modal>
        <Button
            :class="{'active-workout': hasCurrentPlaceholder(exercise)}"
            class="icon large"
            @click="addToCurrentWorkout(exercise)"
            aria-label="add to workout">
          <Icon :name="hasCurrentPlaceholder(exercise) ? 'x' : 'play'"/>
        </Button>
      </div>
    </li>

    <li class="flex flex-row justify-center">
      <Modal :controller="modalController">
        <template #target>
          <div class="p-4" @click="onAddExercise()">
            <Icon name="addCircle"/> Add Exercise
          </div>
        </template>
        <template #content>
          <ExerciseEditModal
              title="New exercise"
              :exercise="state.newExercise"
              @save="saveNewExercise"
              @cancel="modalController.close"
          />
        </template>
      </Modal>
    </li>

  </ul>
</template>

<script>
import {reactive} from 'vue'
import useGym from "../services/gym_service";
import ClickToEdit from "./ClickToEdit";
import LastWorkouts from "./LastWorkouts";
import Modal from "./Modal";
import ExerciseEditModal from "./ExerciseEditModal";

export default {
  components: {ExerciseEditModal, Modal, ClickToEdit, LastWorkouts},
  setup() {
    let {store, addExercise, togglePlaceholder} = useGym()
    let state = reactive({
      message: 'Exercises',
      newExercise: {name: ''}
    })
    let modalController = {}

    function onAddExercise() {
      state.newExercise = {name: 'test'}
    }

    function saveNewExercise() {
      addExercise(state.newExercise)
      modalController.close()
    }

    function addToCurrentWorkout(exercise) {
      togglePlaceholder(exercise, store.currentDate)
    }

    function hasCurrentPlaceholder(exercise) {
      return !!exercise.placeholders.fetch({date: store.currentDate})
    }

    return {state, store, onAddExercise, modalController,
      saveNewExercise, addToCurrentWorkout, hasCurrentPlaceholder}
  }
}

</script>

<style>
button.icon.active-workout,
button.icon.active-workout:focus {
  background-color: greenyellow;
}

</style>
