<template>
  <div class="app-chart">
    <div v-if="isLoading" class="app-chart__loader">
      <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
      />
    </div>
    <div v-else class="app-chart__canvas">
      <v-alert
        class="py-1"
        type="info"
        dense
        outlined
      >
        Vanwege de schaal van de y-as, worden lagen met een hoogte van ± 0m worden niet getoond.
      </v-alert>
      <line-chart-areas v-if="isBarChartStacked" />
    </div>
  </div>
</template>

<script>
  import LineChartAreas from '@/components/charts/line-chart/line-chart-areas';
  const TIMEOUT_DURATION = 1000; // 1 second

  export default {
    components: {
      LineChartAreas,
    },
    props: {
      title: {
        type: String,
        default: '',
      },
      type: {
        type: String,
        default: '',
        validator(value) {
          return [ 'barStacked' ].indexOf(value) !== -1;
        },
      },
    },
    data() {
      return {
        isLoading: true,
      };
    },
    computed: {
      isBarChartStacked() {
        return this.type === 'barStacked';
      },
    },
    created() {
      setTimeout(() => {
        this.isLoading = false;
      }, TIMEOUT_DURATION);
    },
  };
</script>

<style src="./app-chart.css"></style>
