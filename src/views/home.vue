<template>
  <div class="pa-4 d-flex flex-column">
    <h2 class="text-h4">Tools</h2>
    <v-divider class="mt-4 mb-4" />

    <v-card
      v-for="(tool, index) in tools"
      :key="index"
      class="mt-4"
      outlined
    >
      <v-card-title>{{ tool.name }}</v-card-title>
      <v-card-text>{{ tool.description }}</v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          :to="{ name: 'tool-introduction', params: { config: tool.id } }"
          depressed
        >
          Selecteer
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
  import { VALID_TOOL_CONFIGS } from '@/lib/constants';
  import { getToolData } from '@/repo/configRepo';

  export default {
    data() {
      return {
        configs: VALID_TOOL_CONFIGS,
        toolData: null,
      };
    },
    mounted() {
      this.getConfigData();
    },
    computed: {
      tools() {
        return this.toolData;
      },
    },
    methods: {
      async getConfigData() {
        return await Promise.all(this.configs.map(config => getToolData(config)))
          .then(data => this.toolData = data);
      },
    }
  };
</script>
