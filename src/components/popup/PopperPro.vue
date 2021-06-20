

<script>
import {reactive, onUnmounted, watchEffect, nextTick, h, ref} from 'vue'
import {createPopper} from '@popperjs/core'


export default {
  components: {

  },
  props: {
    controller: Object,
    elementType: String,
  },
  setup: function (props, context) {


    let state = reactive({
      popper: null,
      active: false,
      elements: []
    })

    let targetEl = ref()
    let popperEl = ref()

    function open() {
      if (!state.popper) {
        state.active = true
        nextTick(setupPopper)
      }
    }

    function setupPopper() {
      let target
      if (targetEl.value.children?.length === 1) {
        target = targetEl.value.children[0]
      } else {
        target = targetEl.value
      }
      state.popper = createPopper(target, popperEl.value, {placement: 'right-start'})
      window.addEventListener('click', close)
      nextTick(() => {state.popper.update()})
    }

    function close(e) {
      if (state.popper && !targetEl.value.contains(e?.target) && !popperEl.value.contains(e?.target)) {
        state.popper.destroy()
        state.popper = null
        state.active = false
        window.removeEventListener('click', close)
      }
    }

    onUnmounted(() => {
      if (state.popper) {
        state.popper.destroy()
        window.removeEventListener('click', close)
      }
    })

    watchEffect(() => {
      if (typeof props.controller === 'object') {
        props.controller.close = close
      }
    })

    return (props, something) => {
      let elementType =  props.elementType || 'div'
      let children = []
      children.push(h(
          elementType, {onClick: open, ref: targetEl},
          [context.slots.default()[0]]
      ))
      if (state.active) {
        children.push(h(
            elementType, {ref: popperEl}, [context.slots.default()[1]]
        ))
      }

      return h(elementType, children)
    }
  }
}
</script>

<style>


</style>
