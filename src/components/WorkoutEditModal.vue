<template>
  <div class="px-4 py-0">
    <h4 class="p-0 text-center">{{state.title}}</h4>
    <div class="flex flex-row">
      <div class="text-center flex-grow mx-2">
        <label>Sets</label>
        <ScrollPicker v-model="state.nSets" :options="state.setRange"/>
      </div>
      <div class="text-center flex-grow mx-2">
        <label>Reps</label>
        <ScrollPicker v-model="state.nReps" :options="state.repRange"/>
      </div>
      <div class="text-center flex-grow mx-2">
        <label>Weight</label>
        <ScrollPicker v-model="state.weight" :options="state.weightRange"/>
      </div>
    </div>
    <div class="flex flex-row py-4">
      <Button class="outline" @click="cancel">Cancel</Button>
      <Button v-if="props.mode==='edit'" class="outline-danger" @click="destroy">Delete</Button>
      <div class="flex-grow"></div>
      <Button @click="save">Save</Button>
    </div>
  </div>
</template>

<script>
import {reactive, watchEffect} from 'vue'
import ScrollPicker from "./base/ScrollPicker";
import _ from 'lodash'

export default {
  props: {
    workout: Object,
    exercise: Object,
    mode: {type: String, default: 'edit'}
  },
  components: {ScrollPicker},
  emits: ['cancel', 'save', 'destroy'],
  setup(props, context) {

    let state = reactive({
      nSets: props.workout.nSets,
      nReps: props.workout.nReps,
      weight: props.workout.weight,
      title: '',
      setRange: _.range(1,50),
      repRange: _.range(1, 100),
      weightRange: _.range(props.exercise?.minWeight || 0,
          props.exercise?.maxWeight+0.01 || 500.01, props.exercise?.deltaWeight || 2.5),
    })

    watchEffect(() => {
      state.title = props.mode === 'edit' ? 'Edit Workout' : 'New Workout'
    })

    function cancel() {
      context.emit('cancel')
    }

    function save() {
      props.workout.nSets = state.nSets
      props.workout.nReps = state.nReps
      props.workout.weight = state.weight
      context.emit('save')
    }

    function destroy() {
      context.emit('destroy')
    }

    return {props, state, cancel, save, destroy}
  }
}

</script>