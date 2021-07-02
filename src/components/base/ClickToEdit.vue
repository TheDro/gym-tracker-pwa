<template>
  <div v-show="!state.active"
       style="min-height: 1.5rem"
       ref="div"
       :class="{'text-gray-300': !props.modelValue}"
       @click="startEdit()">
    {{props.modelValue || props.placeholder}}
  </div>
  <textarea v-show="state.active"
            @keydown.ctrl.enter="endEdit()"
            @keydown="onKeyDown"
            ref="textArea"
            :style="{minHeight: '10px', height: state.contentHeight}"
            class="edit-area bg-green-100 p-0 m-0 border-none "
            v-model="state.text">
    </textarea>
</template>

<script>
import {reactive, ref, nextTick} from 'vue'

export default {
  props: {
    modelValue: String,
    placeholder: {type: String, default: ''},
    singleLine: {type: Boolean, default: false}
  },
  emits: ['update:modelValue', 'endEdit'],
  setup(props, context) {

    let state = reactive({
      active: false,
      text: '',
      contentHeight: '24px',
      close: null,
    })

    let textArea = ref()
    let div = ref()

    function onKeyDown(e) {
      if (e.key === 'Enter' && props.singleLine) {
        e.preventDefault()
        return endEdit()
      }
      updateHeight()
    }

    function updateHeight(value) {
      if (value) {
        state.contentHeight = value+'px'
      } else {
        state.contentHeight = (textArea.value?.scrollHeight || 24) + 'px'
      }
    }


    function startEdit(e) {
      if (e?.target?.nodeName === 'A') {
        return
      }

      state.text = props.modelValue

      let input = textArea.value
      setTimeout(() => {
        input.focus()

        state.close = function(e) {
          if (e.target !== input) {
            endEdit()
          }
        }
        window.addEventListener('click', state.close)
      }, 50)
      nextTick(() => {
        updateHeight(div.value.clientHeight)
        state.active = true
      })
    }

    function endEdit() {
      state.active = false
      window.removeEventListener('click', state.close)
      context.emit('update:modelValue', state.text)
      context.emit('endEdit')
    }

    return {state, props, startEdit, endEdit, div, textArea, onKeyDown}
  }
}
</script>

<style>
.edit-area {
  resize: none;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.edit-area::-webkit-scrollbar {
  display: none;
}

</style>
