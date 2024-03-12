<template>
  <div>
    <v-alert
      class="py-1 text-body-2"
      type="info"
      dense
      outlined
      >
      Vanwege de schaal van de y-as, worden kleine lagen (bijna) niet zichtbaar en
      om informatie over een laag te zien, moet je de muis over de 'bolletjes' bewegen.
    </v-alert>
    <v-chart
      class="scatter-chart"
      :init-options="initOptions"
      :option="options"
    />
  </div>
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
        const seriesPaletteA = [ '#FFFF8A', '#FFFF5C', '#FFFF2E', '#FFFF00', '#D1D100', '#A3A300', '#757500' ];
        const seriesPaletteB = [ '#8AFF8A', '#5CFF5C', '#2EFF2E', '#00FF00', '#00D100', '#00A300', '#007500' ];

        let incrementEven = 0;
        let incrementOdd = 0;

        return this.chartData.map((item, index) => {
          const seriesColor = index % 2 === 0 ? seriesPaletteA[incrementOdd++] : seriesPaletteB[incrementEven++];
    
          return {
            ...item,
            color: seriesColor,
            lineStyle: { color: seriesColor },
            areaStyle: { ...item.areaStyle, color: seriesColor, opacity: 0.5 },
            symbolSize: 7,
            symbol: 'circle',
          };
        });

      },
    },
    methods: {
      tooltipFormatter(params) {
        const { componentIndex, seriesName } = params;
        const top = Math.floor(this.chartData[componentIndex].data[0]);
        const bottom = Math.floor(this.chartData[componentIndex].areaStyle.origin);
        const layerHeight = Math.floor(Math.abs(top - bottom));

        return `
          <strong>${ seriesName }</strong><br />
          <span>Van: ${ top }m</span><br />
          <span>Tot: ${ bottom }m</span><br />
          Hoogte: ± ${ layerHeight }m<br />
        `;
      },
    },
  };
</script>
