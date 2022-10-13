<template>
  <v-chart
    class="scatter-chart"
    :init-options="initOptions"
    :option="options"
    autoresize
  />
</template>

<script>
  import { mapState } from 'vuex';
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
    props: {
      chartData: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        initOptions: { height: '600px', width:'532px' },
      };
    },
    computed: {
      ...mapState('layers', [ 'legend' ]),
      baseOptions() {
        return {
          tooltip: {
            // Format tooltip to show bottom / top of layer.
            trigger: 'item',
          },
          grid: {
            top: '10px',
            right: '10px',
            bottom: '8px',
            left: '10px',
            containLabel: true,
            backgroundColor: '#fff',
          },
          legend: {
            orient: 'vertical',
            top: '20px',
            right: '20px',
            itemGap: 7,
            itemWidth: 10,
            itemHeight: 10,
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
        return [
          {
            name: 'Laag 1',
            type: 'bar',
            stack: 'depth',
            data: [ 5 ],
            barWidth: '50%',
          },
          {
            name: 'Laag 2',
            type: 'bar',
            stack: 'depth',
            data: [ -10 ],
            barWidth: '50%',
          },
          {
            name: 'Laag 3',
            type: 'bar',
            stack: 'depth',
            data: [ -15 ],
            barWidth: '50%',
          },
          {
            name: 'Laag 4',
            type: 'bar',
            stack: 'depth',
            data: [ -20 ],
            barWidth: '50%',
          },
          {
            name: 'Laag 5',
            type: 'bar',
            stack: 'depth',
            data: [ -25 ],
            barWidth: '50%',
          },
          {
            name: 'Laag 6',
            type: 'bar',
            stack: 'depth',
            data: [ -30 ],
            barWidth: '50%',
          },
          {
            name: 'Laag 7',
            type: 'bar',
            stack: 'depth',
            data: [ -35 ],
            barWidth: '50%',
          },
        ];
      },
    },
  };
</script>
