<template>
  <div class="navbar flex flex-row p-2 border-t-2 border-gray-200">
    <NavButton text="Exercises" url="exercises" icon="clipboard" />
    <NavButton text="Workout" url="workout" icon="play" />
    <NavButton text="Calendar" url="calendar" icon="calendar" />
  </div>
</template>

<script>
import NavButton from "./NavButton.vue";

export default {
  components: {NavButton},
  setup() {

  }
}


</script>

<style>
.navbar {
  position: fixed;
  width: 100%;
  bottom: 0;
  background-color: white;;
}
</style>