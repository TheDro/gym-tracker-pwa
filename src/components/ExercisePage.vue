<template>
  <div>
    <h2 style="width: 100%" class="page-title">{{state.message}}</h2>
    <PopperPro>
      <span style="position: absolute; top: 0rem; right: 0;">
        <Button style="color: white; background-color: transparent" class="icon large"><Icon name="more-vertical"/></Button>
      </span>
      <PopupMenu>
        <PopupItem @click="goToArchive()">Archive</PopupItem>
        <PopupItem @click="exportToFile()">Export</PopupItem>
        <PopupItem @click="importFile()">Import...</PopupItem>
      </PopupMenu>
    </PopperPro>
  </div>

  <IndexDraggable
    v-model="store.exercises"
    item-key="uid"
    handle=".drag-handle"
    animation="100"
    >
    <template #item="{element: exercise}">

      <div v-show="!exercise.archived"
          style="min-height: 2rem;"
          class="border-b-2 border-gray-200">
        <div class="flex flex-row items-center">
          <div class="drag-handle" style="height: 3rem; width: 5%; line-height: 3rem;"><Icon name="drag"/></div>
          <div style="max-width: 40%" class="flex-shrink px-0">{{exercise.name}}</div>
          <div class="flex-grow"></div>
          <LastWorkouts :last="2" :exercise="exercise"/>
          <Modal :unmounts="true" :controller="modalController">
            <template #target>
              <Button class="icon large" aria-label="edit"><Icon name="edit"/></Button>
            </template>
            <template #content>
              <ExerciseEditModal
                  title="Edit exercise"
                  :exercise="exercise"
                  @archive="modalController.close()"
                  @save="modalController.close()"
                  @cancel="modalController.close()"/>
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
      </div>

    </template>
  </IndexDraggable>

  <div class="flex flex-row justify-center">
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
  </div>

</template>

<script>
import {reactive} from 'vue'
import {useRouter} from 'vue-router'
import useGym from "../services/gym_service";
import ClickToEdit from "./base/ClickToEdit";
import LastWorkouts from "./LastWorkouts";
import Modal from "./base/Modal";
import ExerciseEditModal from "./ExerciseEditModal";
import IndexDraggable from "./base/IndexDraggable";
import PopperPro from "./popup/PopperPro";
import PopupMenu from "./popup/PopupMenu";
import PopupItem from "./popup/PopupItem";

export default {
  components: {PopupItem, PopupMenu, PopperPro, IndexDraggable, ExerciseEditModal, Modal, ClickToEdit, LastWorkouts},
  setup() {
    let router = useRouter()
    let {store, addExercise, togglePlaceholder, exportExercises, importExercises} = useGym()
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

    function goToArchive() {
      router.push('archive')
    }

    function exportToFile() {
      exportExercises()
    }

    function importFile() {
      importExercises()
    }

    return {state, store, goToArchive, onAddExercise, modalController,
      saveNewExercise, addToCurrentWorkout, hasCurrentPlaceholder,
      exportToFile, importFile}
  }
}

</script>

<style>
button.icon.active-workout,
button.icon.active-workout:focus {
  /* background-color: #78e6ff; */
  background-color: hsl(99, 100%, 70%);
}

</style>
