import {reactive, watchEffect} from 'vue'
import {todayDate} from "../helpers/date_helper";
import IndexArray from "index-array";
import {nextId} from "../helpers/id_helper";
import {prependSorted, decorateArrays} from "../helpers/array_helper";

let store = reactive({
  exercises: new IndexArray(),
  currentDate: todayDate(),
})


// For testing
// import {defaultExercises} from './gym_service.data'
//
// store.exercises = defaultExercises

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
  store.exercises = decorateArrays(JSON.parse(storage))
}



window.store = store

function addExercise(exercise = {}) {
  exercise = {
    uid: nextId(),
    name: exercise.name || '',
    workouts: new IndexArray(),
    placeholders: new IndexArray(),
  }
  store.exercises.push(exercise)
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
  return {store, addExercise, addWorkout, removeWorkout, addPlaceholder, togglePlaceholder}
}

export default useGym