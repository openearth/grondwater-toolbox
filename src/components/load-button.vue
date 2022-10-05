
<template>
  <div class="export-button">
    <v-btn icon><v-icon>mdi-folder-open</v-icon></v-btn>
    <input
      class="page-index__input-file"
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
        showSnackBar: true,
        selectionsCount: null,
        shouldZoomIn: false,
      };
    },
    computed: {
      ...mapGetters('mapbox', [ 'features' ]),
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
      ...mapActions('selections', [ 'addSelection' ]),
      async onFileInput(event) {
        const { __draw } = this.$root.map;
        const data = await getLoadedFileContents(event);

        __draw.deleteAll();
        __draw.add({
          type: 'FeatureCollection',
          features: data.selections.selections,
        });

        data.selections.selections.forEach((selection) => {
          this.addSelection({ selection });
          this.$store.dispatch('mapbox/getFeature', { feature: selection });
        });

        this.$store.dispatch('reset');
        this.$store.dispatch('loadProject', data);
        this.selectionsCount = data.selections.selections.length;

        if (this.$route.name !== 'tool-step-1') {
          this.$router.push({ name: 'tool-step-1' });
        }

        this.shouldZoomIn = true;
      },
    },
  };
</script>

<style>
.export-button {
  position: relative;
  cursor: pointer;
  display: flex;
}
.export-button .md-button {
  flex: 1;
  z-index: 0;
}
.page-index__input-file {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  opacity: 0;
  cursor: pointer;
}
</style>
