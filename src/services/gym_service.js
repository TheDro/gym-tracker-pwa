import {reactive, watchEffect} from 'vue'
import {todayDate} from "../helpers/date_helper";
import IndexArray from "index-array";
import {nextId} from "../helpers/id_helper";
import {prependSorted, decorateArrays, replaceUids} from "../helpers/array_helper";
import {addRefocusListener, MINUTE} from "./window_service";

let store = reactive({
  exercises: new IndexArray(),
  currentDate: todayDate(),
})
window.store = store


// CURRENT DATE
addRefocusListener(15*MINUTE, () => {
  store.currentDate = todayDate()
})


// PERSISTENCE
let justLoaded = false
load()

watchEffect(() => {
  save()
})

function save() {
  let storage = JSON.stringify(store.exercises, null, 2)
  if (justLoaded) {
    justLoaded = false
    return
  }
  console.log('save!')
  localStorage.setItem('exercises', storage)
}

function load() {
  console.log('load!')
  justLoaded = true
  let storage = localStorage.getItem('exercises')
  let exercises = JSON.parse(storage) || []
  store.exercises = decorateArrays(replaceUids(exercises))
}





// PUBLIC METHODS
function addExercise(exercise = {}) {
  let existingExercise = store.exercises.fetch({name: exercise.name})
  if (existingExercise) {
    existingExercise.archived = false
    return
  }
  exercise = {
    uid: nextId(),
    name: exercise.name || '',
    workouts: new IndexArray(),
    placeholders: new IndexArray(),
  }
  store.exercises.push(exercise)
}

function removeExercise(exercise) {
  store.exercises.remove({uid: exercise.uid})
}

function addWorkout(exercise, workout) {
  workout = {
    uid: nextId(),
    date: workout.date || store.currentDate,
    nSets: workout.nSets || 1,
    nReps: workout.nReps || 1,
    weight: workout.weight || 2.5,
  }
  prependSorted(exercise.workouts, workout, 'date')
}

function removeWorkout(exercise, workout) {
  exercise.workouts.remove(workout)
}

function addPlaceholder(exercise, date) {
  if (!exercise.placeholders.fetch({date})) {
    exercise.placeholders.splice(0, 0, {date})
  }
}

function togglePlaceholder(exercise, date) {
  if (!exercise.placeholders.fetch({date})) {
    exercise.placeholders.splice(0, 0, {date})
  } else {
    exercise.placeholders.remove({date})
  }
}

function useGym() {
  return {store, addExercise, removeExercise, addWorkout, removeWorkout, addPlaceholder, togglePlaceholder}
}

export default useGym