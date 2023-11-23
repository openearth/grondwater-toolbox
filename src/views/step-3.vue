<template>
  <div class="pa-4 d-flex flex-column">
    <h2 class="text-h4">Resultaat</h2>

    <v-divider class="my-6" />

    <v-treeview
      expand-icon="mdi-chevron-down"
      v-model="tree"
      :items="items"
      open-on-click
    >
      <template #prepend="{selected, open, item, indeterminate}">
        <v-icon v-if="item.group">
          {{ open
            ? `mdi-folder-open-outline`
            : `mdi-folder-outline`
          }}
        </v-icon>

        <v-btn
          v-else
          text
          icon
          @click="onLayerVisibilityClick(item.id)"
        >
          <v-icon>
            {{ hiddenWmsLayers.some(layer => layer.id === item.id) ? 'mdi-eye-off' : 'mdi-eye' }}
          </v-icon>
        </v-btn>
      </template>

      <template #label="{ item }">
        <span class="text-body-1">
          {{ item.name.charAt(0).toUpperCase() + item.name.slice(1) }}
        </span>
      </template>
    </v-treeview>

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
    data() {
      return {
        tree: [],
      };
    },
    computed: {
      ...mapGetters('app', [ 'viewerStepsLocked' ]),
      ...mapGetters('mapbox', [ 'features', 'wmsLayers', 'hiddenWmsLayers' ]),
      items() {
        const labels = {
          head: 'Head',
          bdgflf: 'Kwelfluxen',
        };

        return Object.keys(labels).map(group => {
          return {
            id: group,
            name: labels[group],
            group,
            children: this.wmsLayers
              .filter(layer => layer.parentGroup === group),
          };
        });
      },
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
