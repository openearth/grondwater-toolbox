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

  import { GridComponent, TooltipComponent } from 'echarts/components';

  use([
    CanvasRenderer,
    GridComponent,
    BarChart,
    TooltipComponent,
  ]);

  // Layer color pallette.
  const COLORS = [
    '#577590',
    '#43aa8b',
    '#90be6d',
    '#f9c74f',
    '#f8961e',
    '#f3722c',
    '#f94144',
  ];

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
            // Format tooltip to show bottom / top of layer.
            trigger: 'item',
          },
          grid: {
            top: '10px',
            right: '10px',
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
        return {};
      },
      xAxis() {
        return {
          data: [ '' ], // We don't need a label for the x-axis
        };
      },
      series() {
        return this.chartData.map((item, index) => ({
          ...item,
          barWidth: '50%',
          tooltip: {
            show: true,
            formatter: this.tooltipFormatter,
          },
          itemStyle: { color: COLORS[index] },
        }));
      },
    },
    methods: {
      tooltipFormatter(params) {
        const { componentIndex, seriesName } = params;
        const startValue = this.chartData[componentIndex - 1]
          ? this.sumLayerValues(componentIndex)
          : 0;
        const layerHeight = this.chartData[componentIndex].data[0] * -1; // Convert to positive value
        const endValue = startValue + this.chartData[componentIndex].data[0];

        return `
          <strong>${ seriesName }</strong><br />
          Hoogte: ${ layerHeight }m<br />
          Top: ${ startValue }m<br />
          Bodem: ${ endValue }m
        `;
      },
      sumLayerValues(index) {
        const numbers = this.chartData.map(item => item.data[0]);
        const slicedNumbers = numbers.slice(0, index);

        // Sum remaining numbers in array.
        return slicedNumbers.reduce((acc, value) => acc + value, 0);
      },
    },
  };
</script>
