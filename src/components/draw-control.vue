<script>
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import StaticMode from '../lib/StaticMode'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

export default {
  render (createElement) {
    return createElement('span')
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
            polygon: true,
        },
        modes: { ...MapboxDraw.modes, static: StaticMode },
        defaultMode: 'simple_select',
      });

      if (this.position) {
        map.addControl(Draw, this.position)
      } else {
        map.addControl(Draw)
      }

      map.on('load', function() {
        Draw.changeMode('static');
      });
    }
  }
};
</script>

<style>
.mapbox-gl-draw_ctrl-draw-btn.mapbox-gl-draw_polygon.active {
  border: solid 3px #008FC5;
  transition: background .1s ease;
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
  opacity: .6;
  width: 30px;
  height: 30px;
}
</style>
