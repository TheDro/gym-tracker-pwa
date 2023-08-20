<template>
  <span class="inline-block" v-html="state.content">

  </span>
</template>

<script>
import {reactive, watchEffect} from 'vue'
import feather from "feather-icons"

let iconMap = {
  addCircle: 'plus-circle',
  delete: 'trash-2',
  drag: 'menu',
  edit: 'edit',
  help: 'help-circle',
  settings: 'settings',
  sync: 'refresh-cw',
  return: 'rotate-ccw',
  reset: 'rotate-ccw',
}


export default {
  components: {
  },
  props: {
    name: String,
    size: Number,
  },
  setup(props) {
    let state = reactive({
      content: ''
    })

    watchEffect(() => {
      let settings = {width: 16, height: 16}
      if (props.size) {
        settings.width = props.size
        settings.height = props.size
      }
      if (iconMap[props.name]) {
        state.content = feather.icons[iconMap[props.name]].toSvg(settings)
      } else {
        state.content = feather.icons[props.name].toSvg(settings)
      }
    })

    return {props, state}
  }
}
</script>

<style>
.feather {
  display: inline;

  margin-top: -0.4rem;
}

</style>
