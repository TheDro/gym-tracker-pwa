<template>
  <h1 class="m-0 bg-green-100 text-center" >{{state.message}}</h1>
  <VCal :attributes="calAttributes"  @dayclick="onClick"></VCal>
</template>

<script>
import IndexArray from "index-array";
import {reactive, computed} from 'vue'
import {Calendar as VCal} from 'v-calendar'
import useGym from "../services/gym_service";
import {todayDate, midDay} from "../helpers/date_helper";

export default {
  components: {
    VCal
  },
  setup() {
    let state = reactive({
      message: 'Calendar'
    })
    let {store} = useGym()

    let calAttributes = computed(() => {
      let workoutDates = new IndexArray()
      store.exercises.forEach((exercise) => {
        exercise.placeholders.forEach((placeholder) => {
          if (!workoutDates.fetch({date: placeholder.date})) {
            workoutDates.push({date: placeholder.date})
          }
        })
      })

      let attributes = workoutDates.toArray().map((dateObj) => {
        let hour = ('0'+ (12 + new Date().getTimezoneOffset()/60)).slice(-2)
        let day = new Date(`${dateObj.date}T${hour}:00:00`)

        return {
          dates: midDay(dateObj.date),
          dot: true,
        }
      })

      attributes.push({
        dates: midDay(todayDate()),
        highlight: {
          fillMode: 'outline'
        }
      })

      attributes.push({
        dates: midDay(store.currentDate),
        highlight: {
          fillMode: 'solid'
        }
      })

      return attributes
    })

    function onClick(e) {
      let date = e.id
      store.currentDate = date
    }

    return {state, calAttributes, onClick}
  }
}

</script>

<style>
.vc-day-content:focus {
  background-color: transparent;
}
</style>
