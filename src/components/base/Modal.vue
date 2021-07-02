<template>
  <div @click="open()" ref="targetRef">
    <slot name="target"></slot>
  </div>
  <teleport to="body">
    <div v-if="state.mounted" v-show="state.active" class="z-10 bg-opacity-30 bg-black full-screen flex items-center justify-center" @click.self="close()">
      <div class="w-md bg-white shadow rounded">
        <slot name="content"></slot>
      </div>
    </div>
  </teleport>
</template>

<script>
import {reactive, onUnmounted, onBeforeUnmount, watchEffect} from 'vue'

export default {
  components: {

  },
  props: {
    controller: Object,
    openable: {type: Boolean, default: false},
    unmounts: {type: Boolean, default: false}
  },
  setup: function (props) {

    let state = reactive({
      popper: null,
      active: false,
      mounted: false, // Bugfix: modal content is never unmounted
    })

    function open() {
      state.active = true
      state.mounted = true
    }

    function close() {
      state.active = false
      if (props.unmounts) {
        state.mounted = false
      }
    }

    onBeforeUnmount(() => {
      state.mounted = false
    })
    onUnmounted(() => {
      window.removeEventListener('click', close)
    })

    watchEffect(() => {
      if (typeof props.controller === 'object' && (state.active || props.openable)) {
        props.controller.close = close
        props.controller.open = open
      }
    })

    return {state, props, open, close}
  }
}
</script>

<style>
.full-screen{
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

</style>
