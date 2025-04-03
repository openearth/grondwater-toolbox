<script>
  import MapboxDraw from '@mapbox/mapbox-gl-draw';
  import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

  import drawStyle from './draw-style';

  import StaticMode from '@/lib/static-mode';
  import { mapActions, mapGetters } from 'vuex';

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
      highlighted: {
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

      if (this.highlighted) {
        $drawButton.classList.add('mapbox-gl-draw_ctrl-draw-btn--highlighted');
      }

      this.map.on('draw.modechange', () => {
        this.$emit('toggle', true);
      });

      this.map.on('draw.create', this.onSelection);
      this.map.on('draw.update', this.updateSelection);
    },
    computed: {
      ...mapGetters('selections', [ 'selections' ]),
    },
    watch: {
      selections() {
        if (!this.selections.length) {
          this.map.__draw.deleteAll();
        }
      },
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

  .mapbox-gl-draw_ctrl-draw-btn--highlighted {
    background-color: #008fc5 !important;
    background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIiB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIKICAgIHZpZXdCb3g9IjAgMCAyMCAyMCIgaWQ9InN2ZzE5MTY3IiB2ZXJzaW9uPSIxLjEiIGlua3NjYXBlOnZlcnNpb249IjAuOTErZGV2ZWwrb3N4bWVudSByMTI5MTEiCiAgICBzb2RpcG9kaTpkb2NuYW1lPSJzcXVhcmUuc3ZnIj4KICAgIDxkZWZzIGlkPSJkZWZzMTkxNjkiIC8+CiAgICA8c29kaXBvZGk6bmFtZWR2aWV3IGlkPSJiYXNlIiBwYWdlY29sb3I9IiNmZmZmZmYiIGJvcmRlcmNvbG9yPSIjNjY2NjY2IiBib3JkZXJvcGFjaXR5PSIxLjAiCiAgICAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAuMCIgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIgaW5rc2NhcGU6em9vbT0iMTEuMzEzNzA4IgogICAgICAgIGlua3NjYXBlOmN4PSIxMS42ODE2MzQiIGlua3NjYXBlOmN5PSI5LjI4NTcxNDMiIGlua3NjYXBlOmRvY3VtZW50LXVuaXRzPSJweCIKICAgICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJsYXllcjEiIHNob3dncmlkPSJ0cnVlIiB1bml0cz0icHgiIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTI4MCIKICAgICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSI3NTEiIGlua3NjYXBlOndpbmRvdy14PSIwIiBpbmtzY2FwZTp3aW5kb3cteT0iMjMiCiAgICAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMCIgaW5rc2NhcGU6b2JqZWN0LW5vZGVzPSJ0cnVlIj4KICAgICAgICA8aW5rc2NhcGU6Z3JpZCB0eXBlPSJ4eWdyaWQiIGlkPSJncmlkMTk3MTUiIC8+CiAgICA8L3NvZGlwb2RpOm5hbWVkdmlldz4KICAgIDxtZXRhZGF0YSBpZD0ibWV0YWRhdGExOTE3MiI+CiAgICAgICAgPHJkZjpSREY+CiAgICAgICAgICAgIDxjYzpXb3JrIHJkZjphYm91dD0iIj4KICAgICAgICAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgICAgICAgICAgPGRjOnR5cGUgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICAgICAgICAgIDxkYzp0aXRsZSAvPgogICAgICAgICAgICA8L2NjOldvcms+CiAgICAgICAgPC9yZGY6UkRGPgogICAgPC9tZXRhZGF0YT4KICAgIDxnIGlua3NjYXBlOmxhYmVsPSJMYXllciAxIiBpbmtzY2FwZTpncm91cG1vZGU9ImxheWVyIiBpZD0ibGF5ZXIxIgogICAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTEwMzIuMzYyMikiPgogICAgICAgIDxwYXRoIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgICAgICAgIHN0eWxlPSJjb2xvcjojRkZGRkZGO2Rpc3BsYXk6aW5saW5lO292ZXJmbG93OnZpc2libGU7dmlzaWJpbGl0eTp2aXNpYmxlO2ZpbGw6I0ZGRkZGRjtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MC41O21hcmtlcjpub25lO2VuYWJsZS1iYWNrZ3JvdW5kOmFjY3VtdWxhdGUiCiAgICAgICAgICAgIGQ9Im0gNSwxMDM5LjM2MjIgMCw2IDIsMiA2LDAgMiwtMiAwLC02IC0yLC0yIC02LDAgeiBtIDMsMCA0LDAgMSwxIDAsNCAtMSwxIC00LDAgLTEsLTEgMCwtNCB6IgogICAgICAgICAgICBpZD0icmVjdDc3OTciIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2NjY2NjY2NjY2NjY2NjIiAvPgogICAgICAgIDxjaXJjbGUKICAgICAgICAgICAgc3R5bGU9ImNvbG9yOiNGRkZGRkY7ZGlzcGxheTppbmxpbmU7b3ZlcmZsb3c6dmlzaWJsZTt2aXNpYmlsaXR5OnZpc2libGU7ZmlsbDojRkZGRkZGO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxLjZGRkZGRkYyO21hcmtlcjpub25lO2VuYWJsZS1iYWNrZ3JvdW5kOmFjY3VtdWxhdGUiCiAgICAgICAgICAgIGlkPSJwYXRoNDM2NCIgY3g9IjYiIGN5PSIxMDQ2LjM2MjIiIHI9IjIiIC8+CiAgICAgICAgPGNpcmNsZSBpZD0icGF0aDQzNjgiCiAgICAgICAgICAgIHN0eWxlPSJjb2xvcjojRkZGRkZGO2Rpc3BsYXk6aW5saW5lO292ZXJmbG93OnZpc2libGU7dmlzaWJpbGl0eTp2aXNpYmxlO2ZpbGw6I0ZGRkZGRjtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MS42RkZGRkZGMjttYXJrZXI6bm9uZTtlbmFibGUtYmFja2dyb3VuZDphY2N1bXVsYXRlIgogICAgICAgICAgICBjeD0iMTQiIGN5PSIxMDQ2LjM2MjIiIHI9IjIiIC8+CiAgICAgICAgPGNpcmNsZSBpZD0icGF0aDQzNzAiCiAgICAgICAgICAgIHN0eWxlPSJjb2xvcjojRkZGRkZGO2Rpc3BsYXk6aW5saW5lO292ZXJmbG93OnZpc2libGU7dmlzaWJpbGl0eTp2aXNpYmxlO2ZpbGw6I0ZGRkZGRjtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MS42RkZGRkZGMjttYXJrZXI6bm9uZTtlbmFibGUtYmFja2dyb3VuZDphY2N1bXVsYXRlIgogICAgICAgICAgICBjeD0iNiIgY3k9IjEwMzguMzYyMiIgcj0iMiIgLz4KICAgICAgICA8Y2lyY2xlCiAgICAgICAgICAgIHN0eWxlPSJjb2xvcjojRkZGRkZGO2Rpc3BsYXk6aW5saW5lO292ZXJmbG93OnZpc2libGU7dmlzaWJpbGl0eTp2aXNpYmxlO2ZpbGw6I0ZGRkZGRjtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MS42RkZGRkZGMjttYXJrZXI6bm9uZTtlbmFibGUtYmFja2dyb3VuZDphY2N1bXVsYXRlIgogICAgICAgICAgICBpZD0icGF0aDQzNzIiIGN4PSIxNCIgY3k9IjEwMzguMzYyMiIgcj0iMiIgLz4KICAgIDwvZz4KPC9zdmc+) !important;
  }
</style>
