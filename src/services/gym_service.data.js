import IndexArray from "index-array";
import {nextId} from "../helpers/id_helper";

let defaultExercises = new IndexArray({
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
    }),
  },{
    name: 'Tricep extension',
    workouts: new IndexArray({
      uid: nextId(),
      date: '2021-06-06',
      nSets: 3,
      nReps: 5,
      weight: 40,
    }, {
      uid: nextId(),
      date: '2021-06-05',
      nSets: 3,
      nReps: 5,
      weight: 35,
    }, {
      uid: nextId(),
      date: '2021-06-02',
      nSets: 2,
      nReps: 5,
      weight: 30,
    })
  }
)

defaultExercises.forEach((exercise) => {
  exercise.placeholders = exercise.workouts.map((workout) => {
    return {date: workout.date}
  })
})

export {defaultExercises}