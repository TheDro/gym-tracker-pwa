<template>
  <VueScrollPicker v-bind="$attrs"
    :dragSensitivity="1"
    :touchSensitivity="1"
    :scrollSensitivity="1"
    v-slot:default="slotProps"
  >
    <div style="line-height: 1.6rem">
      {{slotProps.option.name}}
    </div>
  </VueScrollPicker>
</template>

<script>
import {VueScrollPicker} from 'vue-scroll-picker'


export default {
  inheritAttrs: false,
  components: {
    VueScrollPicker
  },
  setup: function () {

  }
}
</script>

<style scoped>
.vue-scroll-picker {
  height: 6rem;
}

.vue-scroll-picker-rotator {
  transform: translateY(-2rem);
}

</style>
