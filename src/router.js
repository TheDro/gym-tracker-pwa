import * as VueRouter from "vue-router";
import Calendar from "./components/CalendarPage";
import ExerciseArchive from "./components/ExerciseArchivePage";
import Exercises from "./components/ExercisePage";
import Workout from "./components/WorkoutPage";

let router = VueRouter.createRouter({
  history:VueRouter.createWebHistory('/gym-tracker-pwa/'),
  routes: [
    {path: '/archive', component: ExerciseArchive},
    {path: '/exercises', component: Exercises},
    {path: '/workout', component: Workout},
    {path: '/calendar', component: Calendar},
    {path: '/:other(.*)*', redirect: "/exercises"},
  ]
})

export default router