<template>
  <v-btn
    v-if="isToolStepRoute"
    icon
    title="Selectie opslaan"
    @click="save"
  >
    <v-icon>mdi-content-save</v-icon>
  </v-btn>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    computed: {
      isToolStepRoute() {
        return this.$route.name.includes('tool-step');
      },
    },
    methods: {
      ...mapActions('data', [ 'saveProject' ]),
      save() {
        this.saveProject();
      },
    },
  };
</script>
