<template>
  <span v-html="state.content">

  </span>
</template>

<script>
import {reactive, watchEffect} from 'vue'
import feather from "feather-icons"
window.feather = feather

let iconMap = {
  addCircle: 'plus-circle',
  delete: 'trash-2',
  edit: 'edit',
  help: 'help-circle',
  settings: 'settings',
  sync: 'refresh-cw',
}

let defaultSettings = {width: 16, height: 16}


export default {
  components: {
  },
  props: {
    name: String
  },
  setup(props) {
    let state = reactive({
      content: ''
    })

    watchEffect(() => {
      if (iconMap[props.name]) {
        state.content = feather.icons[iconMap[props.name]].toSvg(defaultSettings)
      } else {
        state.content = feather.icons[props.name].toSvg(defaultSettings)
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
