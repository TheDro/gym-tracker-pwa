<template>
  <router-link class="flex-grow"
     :class="{'text-gray-700': !active, 'text-blue-700': active}"
     :to="props.url">
    <div class="text-center" >
      <Icon :name="props.icon"></Icon>
      <div>{{props.text}}</div>
    </div>
  </router-link>
</template>

<script>
import {computed} from 'vue'
import {useRoute} from 'vue-router'

export default {
  props: {
    url: String,
    icon: String,
    text: String,
  },
  setup(props) {
    let route = useRoute()
    let active = computed(() => {
      return !!route.path.match(props.url)
    })

    return {props, active}
  }
}


</script>

<style>
a:hover {
  text-decoration: none;
}
a:focus {
  text-decoration: none;
}

</style>