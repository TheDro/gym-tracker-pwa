<template>
  <PopperPro>
    <slot></slot>
    <PopupMenu>
      <PopupItem
          class="text-red-600"
          v-bind="$attrs">
        {{props.text}}
      </PopupItem>
    </PopupMenu>
  </PopperPro>
</template>

<script>
import PopperPro from "./PopperPro";
import PopupMenu from "./PopupMenu";
import PopupItem from "./PopupItem";


export default {
  inheritAttrs: false,
  components: {
    PopupItem,
    PopupMenu,
    PopperPro
  },
  props: {
    text: {type: String, default: 'Confirm'},
  },
  setup: function (props) {
    return {props}
  }
}
</script>

<style>


</style>
