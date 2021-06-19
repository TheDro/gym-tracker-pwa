import * as VueRouter from "vue-router";
import Calendar from "./components/Calendar";
import Exercises from "./components/Exercises";
import Workout from "./components/Workout";

let router = VueRouter.createRouter({
  history:VueRouter.createWebHistory(),
  routes: [
    {path: '/exercises', component: Exercises},
    {path: '/workout', component: Workout},
    {path: '/calendar', component: Calendar},
    {path: '/:other(.*)*', redirect: "/exercises"},
  ]
})

export default router