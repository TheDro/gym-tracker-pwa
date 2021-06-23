<template>
  <div class="px-4 py-0">
    <h4 class="p-0 text-center">{{state.title}}</h4>
    <label>Name</label>
    <input type="number" v-model="state.nSets"/>
    <input type="number" v-model="state.nReps"/>
    <input type="number" v-model="state.weight"/>
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

export default {
  props: {
    workout: Object,
    mode: {type: String, default: 'edit'}
  },
  emits: ['cancel', 'save', 'destroy'],
  setup(props, context) {

    console.log('setup edit modal')
    let state = reactive({
      nSets: props.workout.nSets,
      nReps: props.workout.nReps,
      weight: props.workout.weight,
      title: ''
    })

    watchEffect(() => {
      state.title = props.mode === 'edit' ? 'Edit Workout' : 'New Workout'
    })

    // watchEffect(() => {
    //   console.log('WorkoutEditModalWatch')
    //   debugger
    //   state.nSets = props.workout.nSets
    //   state.nReps = props.workout.nReps
    //   state.weight = props.workout.weight
    // })

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