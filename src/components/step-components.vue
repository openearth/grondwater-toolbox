<template>
  <div class="step-components" v-if="hasComponents">
    <component
      v-for="(component, index) in renderComponents"
      :key="index"
      :is="component"
    />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  import LayersGraph from '@/components/layers-graph/layers-graph';
  import MarkerConfiguration from '@/components/marker-configuration/marker-configuration';
  import MarkerList from '@/components/marker-list/marker-list';
  import SelectionConfiguration from '@/components/selection-configuration';
  import SelectionList from '@/components/selection-list/selection-list';

  const COMPONENT_MAP = {
    'layers-graph': LayersGraph,
    'marker-configuration': MarkerConfiguration,
    'marker-list': MarkerList,
    'selection-configuration': SelectionConfiguration,
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
