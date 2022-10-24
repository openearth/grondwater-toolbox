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
  import { LineChart } from 'echarts/charts';
  import VChart from 'vue-echarts';

  import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';

  use([
    CanvasRenderer,
    GridComponent,
    LineChart,
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
            icon: 'rect',
            itemStyle: {
              borderWidth: 20,
              borderHeight: 20,
              borderType: 'solid',
            },
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
          type: 'category',
          data: [ '', '' ], // We don't need a label for the x-axis
        };
      },
      series() {
        return this.chartData;
      },
    },
    methods: {
      tooltipFormatter(params) {
        /*         console.log('params', params);
        const { seriesIndex, seriesName } = params;
        console.log('componentIndex', seriesName);
        // Convert to positive value
        let layerHeight;
        if (seriesIndex === this.chartData.length - 1) {
          layerHeight = 0;
        } else {
          layerHeight = Math.abs(this.chartData[seriesIndex].data[0] -  this.chartData[seriesIndex + 1].data[0]);
        } */
       
        return 'test';
        /*       return `
          <strong>${ seriesName }</strong><br />
          Hoogte: ± ${ seriesIndex }m<br />
        `; */
      },
    },
  };
</script>
