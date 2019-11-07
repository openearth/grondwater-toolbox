<script>
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import StaticMode from '../lib/StaticMode';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

export default {
  render() {
    return null;
  },
  props: {
    position: {
      type: String,
      required: false
    }
  },
  methods: {
    deferredMountedTo(map) {
      var Draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true
        },
        modes: { ...MapboxDraw.modes, static: StaticMode },
        defaultMode: 'simple_select'
      });

      if (this.position) {
        map.addControl(Draw, this.position);
      } else {
        map.addControl(Draw);
      }

      map.on('load', () => {
        Draw.changeMode('static');
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
.mapbox-gl-draw_ctrl-draw-btn.mapbox-gl-draw_polygon.active {
  border: solid 3px #008fc5;
  transition: background 0.1s ease;
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
