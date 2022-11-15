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
      <line-chart-areas v-if="isLineChart" />
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
          return [ 'line-chart' ].indexOf(value) !== -1;
        },
      },
    },
    data() {
      return {
        isLoading: true,
      };
    },
    computed: {
      isLineChart() {
        return this.type === 'line-chart';
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
