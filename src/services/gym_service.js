import {reactive, watchEffect} from 'vue'
import {todayDate} from "../helpers/date_helper";
import IndexArray from "index-array";
import {nextId} from "../helpers/id_helper";
import {prependSorted, decorateArrays, replaceUids} from "../helpers/array_helper";
import {addRefocusListener, MINUTE} from "./window_service";
import {saveAsFile, loadJsonFile} from '../helpers/file_helper';
import {useToast} from 'vue-toastification';

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
  console.log('watchEffect save')
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
  store.exercises.forEach((exercise) => {
    exercise.minWeight = exercise.minWeight || 0
    exercise.maxWeight = exercise.maxWeight || 500
    exercise.deltaWeight = exercise.deltaWeight || 2.5
  })
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
    minWeight: exercise.minWeight || 0,
    maxWeight: exercise.maxWeight || 500,
    deltaWeight: exercise.deltaWeight || 2.5,
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

function exportExercises() {
  saveAsFile(store.exercises, 'exercises.json')
}

function importExercises() {
  loadJsonFile().then((exercises) => {
    _loadExerciseData(exercises)
  }).catch((err) => {
    console.log(err)
    let toast = useToast()
    toast.error('Failed to load exercises')
  })
}

function _loadExerciseData(exercises) {
  console.log('load from file!')
  justLoaded = true
  let newExercises = decorateArrays(replaceUids(exercises))
  newExercises.forEach((exercise) => {
    exercise.name = exercise.name || nextId()
    exercise.minWeight = exercise.minWeight || 0
    exercise.maxWeight = exercise.maxWeight || 500
    exercise.deltaWeight = exercise.deltaWeight || 2.5
    exercise.placeholders = new IndexArray()
    exercise.workouts.forEach((workout) => {
      workout.date = workout.date || store.currentDate
      workout.nSets = workout.nSets || 1
      workout.nReps = workout.nReps || 1
      workout.weight = workout.weight || 2.5
      exercise.placeholders.push({uid: nextId(), date: workout.date})
    })
    if (store.exercises.fetch({name: exercise.name})) {
      store.exercises.remove({name: exercise.name})
    }
    store.exercises.push(exercise)
  })
}


function useGym() {
  return {store, addExercise, removeExercise, addWorkout, removeWorkout, 
    addPlaceholder, togglePlaceholder, exportExercises, importExercises}
}

export default useGym