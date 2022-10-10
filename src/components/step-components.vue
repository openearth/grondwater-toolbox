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

  import SelectionsList from '@/components/selections-list';
  import SelectionConfiguration from '@/components/selection-configuration';

  const COMPONENT_MAP = {
    'selections-list': SelectionsList,
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
