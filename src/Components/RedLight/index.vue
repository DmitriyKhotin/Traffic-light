<template>
  <div :class="[classes.light, classes.redLight, { [classes.active]: currentTime, [classes.flashing]: currentTime && currentTime <=3 }]">
    {{ currentTime }}
  </div>
</template>
<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue'

export default defineComponent({
  props: ["currentTime"],
  setup(props) {
    const { currentTime } = toRefs(props);

    return {
      currentTime,
    }
  },
})
</script>
<style module="classes" lang="scss" src="../commonStyles.scss">
</style>