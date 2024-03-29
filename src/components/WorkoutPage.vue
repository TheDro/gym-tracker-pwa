<template>

  <div>
    <h2 style="width: 100%" class="page-title">{{state.message}}</h2>
    <PopperPro>
      <span style="position: absolute; top: 0rem; right: 0;">
        <Button style="color: white; background-color: transparent" class="icon large"><Icon name="more-vertical"/></Button>
      </span>
      <PopupMenu>
        <PopupItem @click="toggleTimer()">
          <Icon name="check" v-show="globalState.showTimer"/> Timer
        </PopupItem>
      </PopupMenu>
    </PopperPro>
  </div>
  <div class="border-b-2 border-gray-200" v-show="globalState.showTimer">
    <Timer></Timer>
  </div>
  <ul class="p-0">

    <li v-for="exercise in exercises" :key="exercise.uid"
        style="min-height: 3rem;"
        class="border-b-2 border-gray-200">
      <div class="flex flex-row items-center">
        <div style="width: 40vw" class=" px-2" @click="onSelect({exercise})">{{exercise.name}}</div>
        <div style="height: 3rem" class="flex-grow" @click="onSelect({exercise})"></div>
        <LastWorkouts @select="onSelect($event)" style="width: 60vw" :last="4" :exercise="exercise"/>
      </div>
    </li>
  </ul>
  <div>
    <Modal :openable="true" :unmounts="true" :controller="newModalController">
      <template #content>
        <WorkoutEditModal
            mode="new"
            :workout="state.creating.workout" :exercise="state.creating.exercise"
            @save="onSaveNew()" @cancel="newModalController.close()"/>
      </template>
    </Modal>
    <Modal :openable="true" :unmounts="true" :controller="editModalController">
      <template #content>
        <WorkoutEditModal
            mode="edit"
            :workout="state.editing.workout" :exercise="state.editing.exercise"
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
import Modal from "./base/Modal";
import {nextId} from "../helpers/id_helper";
import WorkoutEditModal from "./WorkoutEditModal";
import Timer from "./Timer"
import PopperPro from "./popup/PopperPro";
import PopupMenu from "./popup/PopupMenu";
import PopupItem from "./popup/PopupItem";

let globalState = reactive({
  showTimer: false,
})

export default {
  components: {
    Modal,
    LastWorkouts,
    WorkoutEditModal,
    Timer,
    PopperPro,
    PopupMenu,
    PopupItem,
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
        let lastWorkout = exercise.workouts[0] || {nSets: 1, nReps: 1, weight: 2.5}
        state.creating.exercise = exercise
        state.creating.workout = {
          uid: nextId(),
          nSets: lastWorkout.nSets,
          nReps: lastWorkout.nReps,
          weight: lastWorkout.weight,
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
      addWorkout(state.creating.exercise, state.creating.workout)
      newModalController.close()
    }

    function onDestroyEdit() {
      removeWorkout(state.editing.exercise, state.editing.workout)
      editModalController.close()
    }

    function toggleTimer() {
      globalState.showTimer = !globalState.showTimer
    }

    return {state, store, exercises, globalState, onSelect, onSaveNew, onDestroyEdit,
      newModalController, editModalController, toggleTimer}
  }
}

</script>

<style>

</style>
