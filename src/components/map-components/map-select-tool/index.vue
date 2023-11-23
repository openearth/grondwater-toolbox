<template>
  <div>
    <component
      :key="tool"
      v-for="tool in activeTools"
      :is="tools[tool]"
      @toggle="changeTool(tool, $event)"
      @error="onError"
      :active="activeTool === tool"
      :position="position"
      :highlighted="highlightedTool === tool"
    />
  </div>
</template>

<script>
  import MapDrawControl from './map-draw-control.vue';
  import MapMarkerControl from './map-marker-control.vue';
  import { mapActions } from 'vuex';

  const tools = {
    draw: MapDrawControl,
    marker: MapMarkerControl,
  };

  export default {
    inject: [ 'map' ],
    props: {
      position: {
        type: String,
        required: false,
      },
      activeTools: {
        type: Array,
        default() {
          return Object.keys(tools);
        },
      },
      highlightedTool: {
        type: String,
      },
    },
    created() {
      this.tools = tools;
    },
    data() {
      return {
        activeTool: null,
      };
    },
    methods: {
      ...mapActions('app', [ 'setToastMessage' ]),
      changeTool(id, active) {
        this.activeTool = active ? id : null;
      },
      onError(err) {
        this.setToastMessage({ text: err, type: 'error' });
      },
    },
  };
</script>

<style src="./style.css"></style>
