<template>
  <h2 class="m-0 bg-green-100 text-center" >{{state.message}}</h2>
  <ul class="p-0">

    <li v-for="exercise in store.exercises"
        style="min-height: 2rem;"
        class="border-b-2 border-gray-200">
      <div class="flex flex-row items-center">
        <div class="flex-grow">{{exercise.name}}</div>
        <div class="flex-grow"></div>
        <LastWorkouts :last="2" :exercise="exercise"/>
        <Modal :controller="editModalController">
          <template #target>
            <Button class="icon large"><Icon name="edit"/></Button>
          </template>
          <template #content>
            <ExerciseEditModal
                title="Edit exercise"
                :exercise="exercise"
                @save="editModalController.close"
                @cancel="editModalController.close"/>
          </template>
        </Modal>
        <Button
            :class="{'active-workout': hasCurrentPlaceholder(exercise)}"
            class="icon large"
            @click="addToCurrentWorkout(exercise)">
          <Icon :name="hasCurrentPlaceholder(exercise) ? 'x' : 'play'"/>
        </Button>
      </div>
    </li>

    <li class="flex flex-row justify-center">
      <Modal :controller="newModalController">
        <template #target>
          <div class="p-2" @click="onAddExercise()">
            <Icon name="addCircle"/> Add Exercise
          </div>
        </template>
        <template #content>
          <ExerciseEditModal
              title="New exercise"
              :exercise="state.newExercise"
              @save="saveNewExercise"
              @cancel="newModalController.close"
          />
        </template>
      </Modal>
    </li>

  </ul>
  <pre>{{store.exercises}}</pre>
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
    let editModalController = {}
    let newModalController = {}


    function onAddExercise() {
      state.newExercise = {name: 'test'}
      console.log('add')
    }

    function saveNewExercise() {
      addExercise(state.newExercise)
      newModalController.close()
    }

    function addToCurrentWorkout(exercise) {
      togglePlaceholder(exercise, store.currentDate)
    }

    function hasCurrentPlaceholder(exercise) {
      return !!exercise.placeholders.fetch({date: store.currentDate})
    }

    return {state, store, onAddExercise, newModalController, editModalController,
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
