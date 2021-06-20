import {reactive} from 'vue'
import {todayDate} from "../helpers/date_helper";
import IndexArray from "index-array";
import {nextId} from "../helpers/id_helper";
import {prependSorted} from "../helpers/array_helper";

let store = reactive({
  exercises: new IndexArray(),
  currentDate: todayDate(),
})

// For testing
import {defaultExercises} from './gym_service.data'

store.exercises = defaultExercises



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
    date: workout.date,
    nSets: workout.nSets || 1,
    nReps: workout.nReps || 1,
    weight: workout.weight || 2.5,
  }
  if (typeof exercise === 'string') {
    exercise = store.exercises.fetch({name: exercise})
  }
  prependSorted(exercise.workouts, workout, 'date')
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
  return {store, addExercise, addWorkout, addPlaceholder, togglePlaceholder}
}

export default useGym