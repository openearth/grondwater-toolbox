<script>
  import MapboxDraw from '@mapbox/mapbox-gl-draw';
  import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

  import drawStyle from './draw-style';

  import StaticMode from '@/lib/static-mode';

  export default {
    inject: [ 'map' ],
    render() {
      return null;
    },
    props: {
      position: {
        type: String,
        required: false,
      },
      options: {
        type: Object,
        required: false,
      },
    },
    created() {
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
        },
        modes: { ...MapboxDraw.modes, static: StaticMode },
        styles: drawStyle,
      });

      this.map.__draw = draw;

      this.map.addControl(draw, this.position);
      const $drawButton = document.querySelector('.mapbox-gl-draw_ctrl-draw-btn');
      const drawLabel = 'Teken een polygoon';

      $drawButton.setAttribute('title', drawLabel);
      $drawButton.classList.add('map-control-tooltip', 'map-control-tooltip--right');

      // This is to make sure the draw button is disabled by default.
      draw.changeMode('static');

      this.map.on('load', () => {
        draw.changeMode('static');
      });

      this.map.on('draw.create', event => {
        this.$emit('create', event);
      });

      this.map.on('draw.update', event => {
        this.$emit('update', event);
      });
    },
  };
</script>

<style>
  .mapbox-gl-draw_ctrl-draw-btn.mapbox-gl-draw_polygon {
    border-radius: 4px;
    background-color: #fff;
  }

  .mapbox-gl-draw_ctrl-draw-btn.mapbox-gl-draw_polygon:disabled {
    opacity: .5;
    cursor: not-allowed;
  }
</style>
