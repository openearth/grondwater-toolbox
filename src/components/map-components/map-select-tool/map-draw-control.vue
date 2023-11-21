<script>
  import MapboxDraw from '@mapbox/mapbox-gl-draw';
  import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

  import drawStyle from './draw-style';

  import StaticMode from '@/lib/static-mode';
  import { mapActions } from 'vuex';

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
      active: {
        type: Boolean,
      },
    },
    created() {
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
        },
        defaultMode: 'simple_select',
        modes: { ...MapboxDraw.modes, static: StaticMode },
        styles: drawStyle,
      });

      this.map.__draw = draw;

      this.map.addControl(draw, this.position);
      const $drawButton = document.querySelector('.mapbox-gl-draw_ctrl-draw-btn');
      const drawLabel = 'Teken een polygoon';

      $drawButton.setAttribute('title', drawLabel);
      $drawButton.classList.add('map-control-tooltip', 'map-control-tooltip--right');

      this.map.on('draw.modechange', () => {
        this.$emit('toggle', true);
      });

      this.map.on('draw.create', this.onSelection);
      this.map.on('draw.update', this.updateSelection);
    },
    methods: {
      ...mapActions('selections', [ 'addSelection', 'updateSelection' ]),
      ...mapActions('mapbox', [ 'getFeature', 'removeFeature' ]),
      onSelection(event) {
        const feature = event.features[0];
        this.addSelection({ selection: feature });
        this.getFeature({ feature });
      },
      onUpdateSelection(event) {
        const feature = event.features[0];

        if (!this.selections.length) {
          this.addSelection({ selection: feature });
        } else {
          this.updateSelection({ selection: feature });
        }

        this.removeFeature({ id: feature.id });
        this.getFeature({ feature });
      },
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
