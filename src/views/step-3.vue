<template>
  <div class="pa-4 d-flex flex-column">
    <h2 class="text-h4">Resultaat</h2>

    <v-divider class="my-6" />

    <v-list>
      <v-list-item v-for="({ id, name }) in wmsLayers" :key="id">
        <v-list-item-icon>
          <v-btn
            text
            icon
            @click="onLayerVisibilityClick(id)"
          >
            <v-icon>
              {{ hiddenWmsLayers.some(layer => layer.id === id) ? 'mdi-eye-off' : 'mdi-eye' }}
            </v-icon>
          </v-btn>
        </v-list-item-icon>
        <v-list-item-content>
          <span class="text-body-1">
            {{ name.charAt(0).toUpperCase() + name.slice(1) }}
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
      <v-btn
        slot="end"
        color="primary"
        depressed
        @click="onClickExport"
      >
        Lagen exporteren
      </v-btn>
    </sidebar-footer>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';

  import SidebarFooter from '@/components/sidebar-footer';

  export default {
    components: { SidebarFooter },
    computed: {
      ...mapGetters('app', [ 'viewerStepsLocked' ]),
      ...mapGetters('mapbox', [ 'features', 'wmsLayers', 'hiddenWmsLayers' ]),
      previousIsDisabled() {
        return this.viewerStepsLocked.includes(2);
      },
    },
    created() {
      if (!this.wmsLayers.length) {
        this.$router.push({ name: 'tool-introduction' });
      }

      this.setViewerCurrentStepNumber({ step: 3 });
    },
    methods: {
      ...mapActions('app', [ 'setViewerCurrentStepNumber' ]),
      ...mapActions('data', [ 'exportLayerData' ]),
      ...mapActions('mapbox', [ 'addHiddenWmsLayer', 'removeHiddenWmsLayer' ]),
      onLayerVisibilityClick(id) {
        const isHiddenLayer = this.hiddenWmsLayers.some(layer => layer.id === id);
        const layer = this.wmsLayers.find(layer => layer.id === id);

        isHiddenLayer
          ? this.removeHiddenWmsLayer({ id })
          : this.addHiddenWmsLayer({ layer });
      },
      onPrevious() {
        this.$router.push({ name: 'tool-step-2' });
        this.setViewerCurrentStepNumber({ step: 2 });
      },
      onClickExport() {
        this.exportLayerData();
      },
    },
  };
</script>
