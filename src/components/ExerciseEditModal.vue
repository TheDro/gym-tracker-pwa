<template>
  <div class="px-4 py-0">
    <h4 class="p-0 text-center">{{props.title}}</h4>
    <label>Name</label>
    <input v-model="state.name"/>
    <div class="flex flex-row py-4">
      <Button class="outline" @click="cancel">Cancel</Button>
      <div class="flex-grow"></div>
      <Button @click="save">Save</Button>
    </div>
  </div>
</template>

<script>
import {reactive, watchEffect} from 'vue'

export default {
  props: {
    exercise: Object,
    title: {type: String, default: 'Edit exercise'}
  },
  emits: ['cancel', 'save'],
  setup(props, context) {

    let state = reactive({
      name: props.name
    })

    watchEffect(() => {
      state.name = props.exercise.name
    })

    function cancel() {
      context.emit('cancel')
    }

    function save() {
      props.exercise.name = state.name
      context.emit('save')
    }

    return {props, state, cancel, save}
  }
}

</script>