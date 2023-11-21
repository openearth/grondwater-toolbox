<template>
  <div class="step-components" v-if="hasComponents">
    <template v-for="(component, index) in renderComponents">
      <v-divider
        :key="`${index}-divider`"
        v-if="index > 0"
        class="my-6 step-components__divider" />
      <component
        :key="`${index}-component`"
        :is="component"
      />
    </template>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  import LayersGraph from '@/components/layers-graph/layers-graph';
  import MarkerConfiguration from '@/components/marker-configuration/marker-configuration';
  import MarkerNotification from '@/components/marker-notification/marker-notification';
  import MarkerList from '@/components/marker-list/marker-list';
  import SelectionConfiguration from '@/components/selection-configuration';
  import SelectionList from '@/components/selection-list/selection-list';
  import PolygonSelectionConfiguration from '@/components/polygon-selection-configuration';
 

  const COMPONENT_MAP = {
    'layers-graph': LayersGraph,
    'marker-configuration': MarkerConfiguration,
    'marker-list': MarkerList,
    'marker-notification': MarkerNotification,
    'selection-configuration': SelectionConfiguration,
    'polygon-selection-configuration': PolygonSelectionConfiguration,
    'selection-list': SelectionList,
  };

  export default {
    computed: {
      ...mapGetters('app', [ 'viewerCurrentStep' ]),
      renderComponents() {
        return this.viewerCurrentStep.components
          .map((component) => COMPONENT_MAP[component] || null);
      },
      hasComponents() {
        return this.viewerCurrentStep && this.viewerCurrentStep.components.length;
      },
    },
  };
</script>

<style>
  .step-components__divider:last-child,
  .step-components__divider:first-child,
  .step-components__divider + .step-components__divider {
    display: none;
  }
</style>
