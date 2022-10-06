<template>
  <div class="pa-4 d-flex flex-column">
    <h2 class="text-h4">Resultaat</h2>

    <v-divider class="my-6" />

    <v-list>
      <v-list-item v-for="layer in wmsLayers" :key="layer.id">
        <v-list-item-icon>
          <v-btn
            text
            icon
            @click="onLayerVisibilityClick(layer.id)"
          >
            <v-icon>
              {{ hiddenLayers.includes(layer.id) ? 'mdi-eye-off' : 'mdi-eye' }}
            </v-icon>
          </v-btn>
        </v-list-item-icon>
        <v-list-item-content>
          <span class="text-body-1">
            {{ layer.name.charAt(0).toUpperCase() + layer.name.slice(1) }}
          </span>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider class="my-6" />

    <sidebar-footer>
      <v-btn
        slot="start"
        color="primary"
        :disabled="previousIsDisabled"
        depressed
        @click="onPrevious"
      >
        <v-icon left>mdi-chevron-left</v-icon>
        Vorige
      </v-btn>
    </sidebar-footer>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';

  import SidebarFooter from '@/components/sidebar-footer';

  export default {
    components: { SidebarFooter },
    data() {
      return {
        hiddenLayers: [],
      };
    },
    watch: {
      hiddenLayers() {
        const activeLayers = this.wmsLayers.filter((layer) =>
          !this.hiddenLayers.find(id => id === layer.id)
        ).map(({ id }) => id);

        this.hiddenLayers.forEach(id => {
          this.$root.map.setPaintProperty(id, 'raster-opacity', 0);
        });

        activeLayers.forEach(id => {
          this.$root.map.setPaintProperty(id, 'raster-opacity', 1);
        });
      },
    },
    computed: {
      ...mapGetters('app', [ 'viewerStepsLocked' ]),
      ...mapGetters('mapbox', [ 'features', 'wmsLayers' ]),
      ...mapGetters('selections', [ 'selections' ]),
      previousIsDisabled() {
        return this.viewerStepsLocked.includes(2);
      },
    },
    created() {
      if (!this.selections.length) {
        this.$router.push({ name: 'tool-introduction' });
      }

      this.setViewerCurrentStepNumber({ step: 3 });

      this.hiddenLayers = this.wmsLayers
        .filter((_, index) => index !== 0)
        .map((layer) => layer.id);
    },
    methods: {
      ...mapActions('app', [ 'setViewerCurrentStepNumber' ]),
      onLayerVisibilityClick(id) {
        if (this.hiddenLayers.includes(id)) {
          this.hiddenLayers = this.hiddenLayers.filter(
            (hiddenLayerId) => hiddenLayerId !== id
          );
        } else {
          this.hiddenLayers.push(id);
        }
      },
      onPrevious() {
        this.$router.push({ name: 'tool-step-2' });
        this.setViewerCurrentStepNumber({ step: 2 });
      },
    },
  };
</script>
