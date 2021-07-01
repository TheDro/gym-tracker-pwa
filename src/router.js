import * as VueRouter from "vue-router";
import Calendar from "./components/Calendar";
import ExerciseArchive from "./components/ExerciseArchive";
import Exercises from "./components/Exercises";
import Workout from "./components/Workout";

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