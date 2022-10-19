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
      <bar-chart-stacked v-if="isBarChartStacked" />
    </div>
  </div>
</template>

<script>
  import BarChartStacked from '@/components/charts/bar-chart/bar-chart-stacked';

  const TIMEOUT_DURATION = 1000; // 1 second

  export default {
    components: {
      BarChartStacked,
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
