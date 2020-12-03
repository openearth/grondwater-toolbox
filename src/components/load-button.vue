
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
import { mapActions, mapState } from 'vuex';
import getLoadedFileContents from '@/lib/get-loaded-file-contents';

export default {
  data() {
    return {
      showSnackBar: true,
    };
  },
  computed: {
    ...mapState('mapbox/selections', ['selections']),
  },
  methods: {
    ...mapActions({
      showError: 'notifications/showError',
    }),
    async onFileInput(event) {
      const { __draw} = this.$root.map;
      const data = await getLoadedFileContents(event);  

      __draw.deleteAll();
      __draw.add({
        type: "FeatureCollection",
        features: data.selections.selections
      });

      data.selections.selections.forEach(selection => {
        this.$store.commit('selections/add', selection);
        this.$store.dispatch('mapbox/getFeature', selection);
      });

      this.$store.dispatch('reset');
      this.$store.dispatch('loadProject', data);

      if (this.$route.name !== 'selection') {
        this.$router.push({ name: 'selection' });
      }
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