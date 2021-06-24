<template>
  <h1 class="m-0 bg-green-100 text-center" >{{state.message}}</h1>
  <ul class="p-0">

    <li v-for="exercise in exercises"
        style="min-height: 2rem;"
        class="border-b-2 border-gray-200">
      <div class="flex flex-row items-center">
        <div class="flex-grow" @click="onSelect({exercise})">{{exercise.name}}</div>
        <div class="flex-grow" @click="onSelect({exercise})"></div>
        <LastWorkouts @select="onSelect($event)" style="width: 50%" :last="4" :exercise="exercise"/>
      </div>
    </li>
  </ul>
  <div>
    <Modal :openable="true" :unmounts="true" :controller="newModalController">
      <template #content>
        <WorkoutEditModal
            mode="new" :workout="state.creating.workout"
            @save="onSaveNew()" @cancel="newModalController.close()"/>
      </template>
    </Modal>
    <Modal :openable="true" :unmounts="true" :controller="editModalController">
      <template #content>
        <WorkoutEditModal mode="edit" :workout="state.editing.workout"
            @save="editModalController.close()" @cancel="editModalController.close()"
            @destroy="onDestroyEdit()"/>
      </template>
    </Modal>
  </div>
</template>

<script>
import IndexArray from "index-array";
import {reactive, computed} from 'vue'
import useGym from "../services/gym_service";
import LastWorkouts from "./LastWorkouts";
import Modal from "./Modal";
import {nextId} from "../helpers/id_helper";
import WorkoutEditModal from "./WorkoutEditModal";

export default {
  components: {
    Modal,
    LastWorkouts,
    WorkoutEditModal,
  },
  setup() {
    let {store, addWorkout, removeWorkout} = useGym()
    let state = reactive({
      message: 'Workout',
      editing: {exercise: null, workout: null},
      creating: {exercise: null, workout: null},
    })
    let newModalController = {}
    let editModalController = {}

    let exercises = computed(() => {
      let result = store.exercises.toArray().filter((exercise) => {
        return !!exercise.placeholders.fetch({date: store.currentDate})
      })
      result = new IndexArray(...result)
      return result
    })

    function onSelect({exercise, workout}) {
      if (!workout) {
        state.creating.exercise = exercise
        state.creating.workout = {
          uid: nextId(),
          nSets: 1,
          nReps: 1,
          weight: 2.5,
        }
        newModalController.open()
      } else if (workout.date === store.currentDate) {
        state.editing = {exercise, workout}
        editModalController.open()
      } else {
        state.creating.exercise = exercise
        state.creating.workout = {
          uid: nextId(),
          nSets: workout.nSets,
          nReps: workout.nReps,
          weight: workout.weight,
        }
        newModalController.open()
      }
    }

    function onSaveNew() {
      console.log('onSaveNew', {exercise: state.creating.exercise, workout: state.creating.workout})
      addWorkout(state.creating.exercise, state.creating.workout)
      newModalController.close()
    }

    function onDestroyEdit() {
      removeWorkout(state.editing.exercise, state.editing.workout)
      editModalController.close()
    }


    return {state, store, exercises, onSelect, onSaveNew, onDestroyEdit,
      newModalController, editModalController}
  }
}

</script>

<style>

</style>
