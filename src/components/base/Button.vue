<template>
  <button>
    <slot></slot>
  </button>
</template>

<script>
export default {}
</script>

<style>

button.icon {
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  background-color: rgb(243, 244, 246); /* gray-100 */
  border: none;
  color: #555;
}

button.icon.large {
  width: 2.5rem;
  height: 2.5rem;
}

button.icon:hover {
  background-color: rgba(229, 231, 235); /* gray-200 */
}


button.outline {
  border-color: rgb(37, 99, 235); /* blue-600 */
  background-color: white;
  color: rgb(37, 99, 235); /* blue-600 */
}
/*background-color: rgb(29, 78, 216) !* blue-700 *!*/
button.outline:hover {
  border-color: rgb(37, 99, 235); /* blue-600 */
  background-color: rgb(229, 231, 235);
  color: rgb(37, 99, 235); /* blue-600 */
}


button.outline-danger {
  border-color: rgb(220, 38, 38); /* red-600 */
  background-color: white;
  color: rgb(220, 38, 38);
}

button.outline-danger {
  border-color: rgb(220, 38, 38); /* red-600 */
  background-color: white;
  color: rgb(220, 38, 38);
}

button.outline-danger:hover {
  border-color: rgb(220, 38, 38);
  background-color: rgb(229, 231, 235); /* gray-200 */
  color: rgb(220, 38, 38);
}

</style>
