<template>
  <div class="map-components" v-if="showMap">
    <component
      v-for="(component, index) in renderComponents"
      :key="index"
      :is="component"
    />
  </div>
  <div v-else class="map-components map-components--empty">
    <h3 class="text-h5">Map nog niet beschikbaar.</h3>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  import AbstractionMap from '@/components/abstraction-map/abstraction-map';
  import AppMap from '@/components/brl-map/brl-map';

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

<style>
  .map-components {
    height: 100%;
    width: 100%;
  }

  .map-components--empty {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
