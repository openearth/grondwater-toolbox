<script>
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import StaticMode from '@/lib/static-mode';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import drawStyle from './draw-style';

export default {
  render() {
    return null;
  },
  props: {
    position: {
      type: String,
      required: false
    },
    options: {
      type: Object,
      required: false
    }
  },
  methods: {
    deferredMountedTo(map) {
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true
        },
        modes: { ...MapboxDraw.modes, static: StaticMode },
        defaultMode: 'simple_select',
        styles: drawStyle
      });

      map.__draw = draw;

      map.addControl(draw, this.position);
      const $drawButton = document.querySelector('.mapbox-gl-draw_ctrl-draw-btn');
      const drawLabel = 'Draw an area around your infrastructure';

      $drawButton.setAttribute('title', drawLabel);
      $drawButton.classList.add('map-control-tooltip', 'map-control-tooltip--right');

      map.on('load', () => {
        if (draw) {
          draw.changeMode('static');
        }
      });

      map.on('draw.create', event => {
        this.$emit('create', event);
      });

      map.on('draw.update', event => {
        this.$emit('update', event);
      });
    }
  }
};
</script>

<style>
.mapbox-gl-draw_ctrl-draw-btn.mapbox-gl-draw_polygon {
  border-radius: 4px;
  transition: box-shadow .2s ease;
}

.mapbox-gl-draw_ctrl-draw-btn.mapbox-gl-draw_polygon.active {
  box-shadow: 0 0 2px 2px rgba(0, 150, 255, 1), inset 0 0 0 3px rgba(0, 150, 255, 1);
}

.mapbox-gl-draw_ctrl-draw-btn.mapbox-gl-draw_polygon:disabled {
  background-color: rgba(0, 0, 0, 0.05);
  cursor: not-allowed;
  position: relative;
}

.mapbox-gl-draw_ctrl-draw-btn.mapbox-gl-draw_polygon:disabled:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  background: #fff;
  opacity: 0.6;
  width: 30px;
  height: 30px;
}
</style>
