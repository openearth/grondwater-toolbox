<template>
  <div
    v-if="showMap"
    class="tool-maps"
    :class="{ 'tool-maps--acive': mapIsActive }"
  >
    <component
      v-for="(component, index) in renderComponents"
      :key="index"
      :is="component"
    />
  </div>
  <div v-else class="tool-maps tool-maps--empty">
    <h3 class="text-h5">Map nog niet beschikbaar.</h3>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  import AbstractionMap from '@/components/tool-maps/abstraction-map/abstraction-map';
  import AppMap from '@/components/tool-maps/brl-map/brl-map';

  const COMPONENT_MAP = {
    'abstraction-map': AbstractionMap,
    'brl-map': AppMap,
  };

  export default {
    components: {
      AbstractionMap,
      AppMap,
    },
    computed: {
      ...mapGetters('app', [ 'viewerMap' ]),
      ...mapGetters('mapbox', [ 'mapIsActive' ]),
      renderComponents() {
        return this.viewerMap.components
          .map((component) => COMPONENT_MAP[component] || 'div');
      },
      showMap() {
        return this.viewerMap && this.viewerMap.components.length;
      },
    },
  };
</script>

<style src="./tool-maps.css"></style>
