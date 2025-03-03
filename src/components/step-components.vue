<template>
  <div class="step-components" v-if="hasComponents">
    <template v-for="(component, index) in renderComponents">
      <v-divider
        :key="`${index}-divider`"
        v-if="index > 0"
        class="my-6 step-components__divider" />
      <component
        :key="`${index}-component`"
        v-bind="component.props"
        :is="component.component"
      />
    </template>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  import SurfaceProfile from '@/components/surface-profile/surface-profile';
  import MarkerConfiguration from '@/components/marker-configuration/marker-configuration';
  import MarkerNotification from '@/components/marker-notification/marker-notification';
  import MarkerPlaced from '@/components/marker-placed/marker-placed';
  import SelectionConfiguration from '@/components/selection-configuration';
  import SelectionList from '@/components/selection-list/selection-list';
  import PolygonSelectionConfiguration from '@/components/polygon-selection-configuration';
  import PolygonDrainageSelectionConfiguration from '@/components/polygon-drainage-selection-configuration.vue';
 

  const COMPONENT_MAP = {
    'surface-profile': SurfaceProfile,
    'marker-configuration': MarkerConfiguration,
    'marker-placed': MarkerPlaced,
    'marker-notification': MarkerNotification,
    'selection-configuration': SelectionConfiguration,
    'polygon-selection-configuration': PolygonSelectionConfiguration,
    'polygon-drainage-selection-configuration': PolygonDrainageSelectionConfiguration,
    'selection-list': SelectionList,
  };

  export default {
    computed: {
      ...mapGetters('app', [ 'viewerCurrentStep' ]),
      renderComponents() {
        return this.viewerCurrentStep.components
          .map((component) => {
            if (typeof component === 'string') {
              return {
                component: COMPONENT_MAP[component],
                props: {},
              };
            } else if (typeof component === 'object') {
              return {
                component: COMPONENT_MAP[component.name],
                props: component.props,
              };
            }
          });
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
