<template>
  <a class="flex-grow"
     :class="{'text-gray-700': !active, 'text-blue-700': active}"
     :href="props.url">
    <div class="text-center" style="height: 2rem;">
      <Icon :name="props.icon"></Icon>
      <div>{{props.text}}</div>
    </div>
  </a>
</template>

<script>
import {reactive, watchEffect, computed} from 'vue'
import {useRoute} from 'vue-router'

export default {
  props: {
    url: String,
    icon: String,
    text: String,
  },
  setup(props) {
    // let state = reactive({
    //   active: false
    // })
    let route = useRoute()

    let active = computed(() => {
      return !!route.path.match(props.url)
    })

    window.route = route

    return {props, active}
  }
}


</script>

<style>
a:hover {
  text-decoration: none;
}

</style>