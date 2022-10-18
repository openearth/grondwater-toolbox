<template>
  <v-chart
    class="scatter-chart"
    :init-options="initOptions"
    :option="options"
  />
</template>

<script>
  import { mapGetters } from 'vuex';
  import { use } from 'echarts/core';
  import { CanvasRenderer } from 'echarts/renderers';
  import { BarChart } from 'echarts/charts';
  import VChart from 'vue-echarts';

  import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';

  use([
    CanvasRenderer,
    GridComponent,
    BarChart,
    LegendComponent,
    TooltipComponent,
  ]);

  export default {
    components: {
      VChart,
    },
    data() {
      return {
        initOptions: { height: '600px', width:'532px' },
      };
    },
    computed: {
      ...mapGetters('abstraction', [ 'chartData' ]),
      baseOptions() {
        return {
          tooltip: {
            borderColor: '#bbb',
            show: true,
            formatter: this.tooltipFormatter,
          },
          legend: {
            orient: 'vertical',
            top: '10px',
            right: '10px',
            itemGap: 8,
            itemWidth: 13,
            itemHeight: 13,
          },
          grid: {
            top: '10px',
            right: '150px',
            bottom: '10px',
            left: '10px',
            containLabel: true,
            backgroundColor: '#fff',
          },
        };
      },
      options() {
        return {
          ...this.baseOptions,
          xAxis: this.xAxis,
          yAxis: this.yAxis,
          series: this.series,
        };
      },
      yAxis() {
        return {
          type: 'value',
          name: 'Diepte (m)',
          maxInterval: 20,
          axisLabel: {
            formatter: '{value}m',
          },
        };
      },
      xAxis() {
        return {
          data: [ '' ], // We don't need a label for the x-axis
        };
      },
      series() {
        return this.chartData.map((item, index) => ({
          ...item,
          barWidth: '40%',
        }));
      },
    },
    methods: {
      tooltipFormatter(params) {
        const { componentIndex, seriesName } = params;
        const layerHeight = Math.abs(this.chartData[componentIndex].data[0]); // Convert to positive value

        return `
          <strong>${ seriesName }</strong><br />
          Hoogte: ± ${ layerHeight }m<br />
        `;
      },
      sumLayerValues(index) {
        const numbers = this.chartData.map(item => item.data[0]);
        const slicedNumbers = index > 1 ? numbers.slice(0, index) : numbers.slice(0, 1);

        // Sum remaining numbers in array.
        return slicedNumbers.reduce((acc, value) => acc + value, 0);
      },
    },
  };
</script>
