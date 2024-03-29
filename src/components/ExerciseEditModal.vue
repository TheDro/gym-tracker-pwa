<template>
  <div class="px-4 py-0">
    <h4 class="p-0 text-center">{{props.title}}</h4>
    <label>Name</label>
    <input maxlength="32" v-model="state.name"/>
    <label>Weight: Min - Increment - Max</label>
    <div class="flex flex-row">
      <input type="number" step="0.01" v-model.number="state.minWeight"/>
      <input type="number" step="0.01" v-model.number="state.deltaWeight"/>
      <input type="number" step="0.01" v-model.number="state.maxWeight"/>
    </div>
    <div class="text-yellow-600" v-if="warning.value">{{warning.value}}</div>
    <div class="flex flex-row py-4">
      <Button class="outline" @click="cancel">Cancel</Button>
      <Button class="outline-danger" @click="archive">Archive</Button>
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
  emits: ['archive', 'cancel', 'save'],
  setup(props, context) {

    let state = reactive({
      name: props.exercise.name,
      minWeight: props.exercise.minWeight || 0,
      deltaWeight: props.exercise.deltaWeight || 2.5,
      maxWeight: props.exercise.maxWeight || 500,
    })
    let warning = reactive({
      value: ''
    })

    function cancel() {
      context.emit('cancel')
    }

    function validate() {
      if (state.deltaWeight <= 0) {
        warning.value = 'Increment must be greater than 0.'
        return false
      }
      if (state.maxWeight < state.minWeight) {
        warning.value = 'Maximum weight must be greater than minimum weight.'
        return false
      }
      if ((state.maxWeight - state.minWeight)/state.deltaWeight > 1000) {
        warning.value = 'Too many possible values.'
        return false
      }
      warning.value = ''
      return true
    }

    function archive() {
      props.exercise.archived = true
      context.emit('archive')
    }

    function save() {
      if (!validate()) return
      Object.assign(props.exercise, state)
      context.emit('save')
    }

    return {props, state, cancel, save, archive, warning}
  }
}

</script>