<template>
  <!-- TODO: make components more configurable in future developments -->
  <v-alert
    v-if="!selections.length"
    dense
    outlined
    type="info"
  >
    {{ textAlert }}
  </v-alert>
  <v-list v-else>
    <selection-list-item
      v-for="selection in selections"
      :key="selection.id"
      :selection="selection"
    />
  </v-list>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { mdiVectorSquare } from '@mdi/js';

  import SelectionListItem from './selection-list-item';

  export default {
    components: { SelectionListItem },
    data() {
      return {
        icons: {
          mdiVectorSquare,
        },
      };
    },
    created() {
      this.resetWmsLayers();

      if (this.$root.map) {
        const { __draw, __markerControl } = this.$root.map;

        if (__draw) {
          __draw.changeMode('simple_select');
        }
        
        if (__markerControl) {
          __markerControl.setStaticMode(false);
        }
      } else {
        this.$router.push({ name: 'tool-introduction' });
      }
    },
    beforeDestroy() {
      if (this.$root.map) {
        const { __draw, __markerControl } = this.$root.map;

        if (__draw) {
          __draw.changeMode('static');
        }
        
        if (__markerControl) {
          __markerControl.setStaticMode(true);
        }
      }
    },
    updated() {
      if (this.selections.length) {
        this.removeLockedViewerStep({ step: 2 });
      } else {
        this.addLockedViewerStep({ step: 2 });
      }
    },
    computed: {
      ...mapGetters('selections', [ 'selections' ]),
      //TODO: move it to a configuration file in future update
      textAlert() {
        if (this.$route.params.config === 'brl') {
          return 'Maak een polygoon over een of meerdere waterwegen op de kaart waar u uw berekeningen op wilt uitvoeren.';
        } 
        return 'Teken een polygoon';
        
      },
    },
    methods: {
      ...mapActions('app', [ 'addLockedViewerStep', 'removeLockedViewerStep' ]),
      ...mapActions('mapbox', [ 'resetWmsLayers' ]),
    },
  };
</script>


<style src="./selection-list.css"></style>
