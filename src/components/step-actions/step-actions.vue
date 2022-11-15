<template>
  <div class="step-actions" v-if="hasComponents">
    <component
      v-for="(component, index) in renderComponents"
      :key="index"
      :is="component"
    />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  import AbstractionReset from '@/components/step-actions/abstraction/reset/reset';
  import AbstractionSave from '@/components/step-actions/abstraction/save/save';

  import BrlLoad from '@/components/step-actions/brl/load/load';
  import BrlReset from '@/components/step-actions/brl/reset/reset';
  import BrlSave from '@/components/step-actions/brl/save/save';

  const COMPONENT_MAP = {
    abstraction: {
      'reset': AbstractionReset,
      'save': AbstractionSave,
    },
    brl: {
      'load': BrlLoad,
      'reset': BrlReset,
      'save': BrlSave,
    },
  };

  export default {
    computed: {
      ...mapGetters('app', [ 'viewerConfig', 'viewerCurrentStep' ]),
      renderComponents() {
        return this.viewerCurrentStep.actions
          .map((component) => COMPONENT_MAP[this.viewerConfig][component] || null);
      },
      hasComponents() {
        return this.viewerCurrentStep && this.viewerCurrentStep.actions.length;
      },
    },
  };
</script>

<style src="./step-actions.css"></style>
