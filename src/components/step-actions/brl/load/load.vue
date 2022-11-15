
<template>
  <div v-if="isToolStepRoute" class="load-button">
    <v-btn
      icon
      @click="onClick"
      title="Selectie importeren"
    >
      <v-icon>mdi-folder-open</v-icon>
    </v-btn>
    <input
      ref="uploader"
      class="load-button__input"
      type="file"
      accept="application/json"
      @change="onFileInput"
    />
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import getLoadedFileContents from '@/lib/get-loaded-file-contents';
  import { featureCollection } from '@turf/helpers';
  import bbox from '@turf/bbox';

  export default {
    data() {
      return {
        isSelecting: false,
        selectionsCount: null,
        shouldZoomIn: false,
      };
    },
    computed: {
      ...mapGetters('mapbox', [ 'features' ]),
      isToolStepRoute() {
        return this.$route.name.includes('tool-step');
      },
    },
    watch: {
      features() {
        if (this.features.length === this.selectionsCount && this.shouldZoomIn) {
          const bounds = bbox(
            featureCollection(
              this.features.map((feature) => ({
                geometry: feature.source.data,
                type: 'Feature',
              }))
            )
          );

          this.$root.map.fitBounds(bounds, { padding: 50 });

          this.shouldZoomIn = false;
        }
      },
    },
    methods: {
      ...mapActions('app', { appReset: 'reset' }),
      ...mapActions('data', [ 'loadProject' ]),
      ...mapActions('mapbox', [ 'getFeature', { mapboxReset: 'reset' } ]),
      ...mapActions('selections', [ 'addSelection', { selectionsReset: 'reset' } ]),
      onClick() {
        this.$refs.uploader.click();
      },
      async onFileInput(event) {
        this.isSelecting = true;
        this.appReset();
        this.mapboxReset();
        this.selectionsReset();

        const { __draw } = this.$root.map;
        const data = await getLoadedFileContents(event);

        __draw.deleteAll();
        __draw.add({
          type: 'FeatureCollection',
          features: data.selections.selections,
        });

        data.selections.selections.forEach((selection) => {
          this.addSelection({ selection });
          this.getFeature({ feature: selection });
        });

        this.loadProject(data);
        this.selectionsCount = data.selections.selections.length;

        if (this.$route.name !== 'tool-introduction') {
          this.$router.push({ name: 'tool-introduction' });
        }

        this.isSelecting = false;
        this.shouldZoomIn = true;
      },
    },
  };
</script>

<style src="./load.css"></style>
