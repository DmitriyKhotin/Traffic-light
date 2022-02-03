<template>
  <div :class="classes.trafficLight">
    <RedLight :currentTime="currentLight === `red` ? currentTime : ''"/>
    <YellowLight :currentTime="currentLight === `yellow` ? currentTime : ''"/>
    <GreenLight :currentTime="currentLight === `green` ? currentTime : ''"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, onBeforeUnmount } from 'vue';
import RedLight from '../../Components/RedLight/index.vue';
import YellowLight from '../../Components/YellowLight/index.vue';
import GreenLight from '../../Components/GreenLight/index.vue';
import { Light, LightByRoute, TrafficLightController } from '../../TrafficLightController'
import { debugLog } from '../../utils/debugLog'

export default defineComponent({
  components: {
    RedLight,
    YellowLight,
    GreenLight
  },

  setup() {
    const location: Location = window.location as Location;
    if (!LightByRoute[location.pathname]) {
      location.pathname = "/red";
    }

    const currentLightByRoute = LightByRoute[location.pathname] as Light;

    const trafficLightController = new TrafficLightController(currentLightByRoute);

    onBeforeUnmount(() => trafficLightController.onDestroy());
    onMounted(() => trafficLightController.startTrafficLight());

    const currentLight = trafficLightController.currentLightRef;
    const currentTime = trafficLightController.currentTimeRef;

    return {
      currentLight,
      currentTime
    }
  },

})
</script>

<style lang="scss" module="classes" src="./index.scss"></style>