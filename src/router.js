import * as VueRouter from "vue-router";
import Exercises from "./components/Exercises.vue";

let router = VueRouter.createRouter({
  history:VueRouter.createWebHistory(),
  routes: [
    {path: '/exercises', component: Exercises},
    {path: '/:other(.*)*', redirect: "/exercises"},
  ]
})

export default router