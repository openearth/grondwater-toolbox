<template>
  <v-stepper class="sidebar-progress" :value="currentStep">
    <div class="sidebar-progress__steps">
      <template v-for="(item, index) in items">
        <v-stepper-step
          :key="`${index}-step`"
          class="px-4"
          :step="index + 1"
          :complete="item.completed"
          >{{ item.text }}</v-stepper-step
        >
        <v-divider
          class="px-6"
          :key="`${index}-divider`"
          v-if="index !== items.length - 1"
        ></v-divider>
      </template>
    </div>
  </v-stepper>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    computed: {
      ...mapState({
        selections: (state) => state.selections.selections,
      }),
      currentStep() {
        return this.$route.meta.step;
      },
      items() {
        return [
          {
            text: 'Select',
            completed: Boolean(this.selections.length),
          },
          {
            text: 'Calculate',
            completed: this.$route.name === 'results',
          },
          {
            text: 'Results',
            completed: false,
          },
        ];
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

.sidebar-progress__header {
  box-shadow: none !important;
}
</style>
