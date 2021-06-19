import {reactive} from 'vue'
import {currentDate} from "../helpers/date_helper";
import IndexArray from "index-array";
import {nextId} from "../helpers/id_helper";
import {prependSorted} from "../helpers/array_helper";

let store = reactive({
  exercises: new IndexArray(),
  currentDate: currentDate(),
})

// For testing
store.exercises.push({
  name: 'Bicep curl',
  workouts: new IndexArray({
    uid: nextId(),
    date: '2021-06-06',
    nSets: 5,
    nReps: 10,
    weight: 35,
  }, {
    uid: nextId(),
    date: '2021-06-05',
    nSets: 5,
    nReps: 11,
    weight: 27.5,
  }, {
    uid: nextId(),
    date: '2021-06-04',
    nSets: 4,
    nReps: 11,
    weight: 30,
  }, {
    uid: nextId(),
    date: '2021-06-02',
    nSets: 6,
    nReps: 8,
    weight: 27.5,
  }, {
    uid: nextId(),
    date: '2021-06-01',
    nSets: 5,
    nReps: 11,
    weight: 27.5,
  })
})

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
    exercise.placeholders.unshift({date})
  }
}

function useGym() {
  return {store, addExercise, addWorkout, addPlaceholder}
}

export default useGym