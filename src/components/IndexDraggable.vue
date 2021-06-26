<script>
import Draggable from 'vuedraggable'
import IndexArray from "index-array";

export default {
  extends: Draggable,
  methods: {
    alterList(onList) {
      if (this.list) {
        onList(this.list);
        return;
      }
      const newList = new IndexArray(...this.modelValue);
      onList(newList);
      this.$emit("update:modelValue", newList);
    }
  }
}

</script>