<template>
  <v-stepper class="sidebar-progress" :value="$route.meta.step">
    <div class="sidebar-progress__steps">
      <template v-for="(step, index) in steps">
        <v-stepper-step
          :key="`${index}-step`"
          class="px-4"
          :step="index + 1"
        >
          {{ step.text }}
        </v-stepper-step>
        <v-divider
          class="px-6"
          :key="`${index}-divider`"
          v-if="index !== steps.length - 1"
        />
      </template>
    </div>
  </v-stepper>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';

  export default {
    computed: {
      ...mapState('selections', [ 'selections' ]),
      ...mapGetters('app', [ 'viewerSteps' ]),
      steps() {
        const finalStep = { text: 'Resultaat' };
        let customSteps = this.viewerSteps.map(step => ({
          text: step.title,
        }));

        return [ ...customSteps, finalStep ];
      },
    },
  };
</script>

<style>
/* all the !important stuff is because of vuetify got in the way of desired styling */

.sidebar-progress {
  box-shadow: none !important;
  margin-left: -16px;
  margin-right: -16px;
}

.sidebar-progress__steps {
  display: flex;
  align-items: center;
}
</style>
