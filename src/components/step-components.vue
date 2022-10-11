<template>
  <div class="step-components" v-if="stepHasComponents">
    <component
      v-for="(component, index) in renderComponents"
      :key="index"
      :is="component"
    />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  import MarkerList from '@/components/marker-list/marker-list';
  import AbstractionStep2 from '@/components/abstraction-step-2/abstraction-step-2';
  import SelectionList from '@/components/selection-list/selection-list';
  import SelectionConfiguration from '@/components/selection-configuration';

  const COMPONENT_MAP = {
    'abstraction-step-2': AbstractionStep2,
    'marker-list': MarkerList,
    'selection-list': SelectionList,
    'selection-configuration': SelectionConfiguration,
  };

  export default {
    computed: {
      ...mapGetters('app', [ 'viewerCurrentStep' ]),
      renderComponents() {
        return this.viewerCurrentStep.components
          .map((component) => COMPONENT_MAP[component] || 'div');
      },
      stepHasComponents() {
        return this.viewerCurrentStep && this.viewerCurrentStep.components.length;
      },
    },
  };
</script>
