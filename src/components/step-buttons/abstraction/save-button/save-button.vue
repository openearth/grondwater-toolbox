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
  import { mapActions, mapGetters } from 'vuex';

  export default {
    computed: {
      ...mapGetters('selections', [ 'selections' ]),
      isToolStepRoute() {
        return this.$route.name.includes('tool-step');
      },
    },
    methods: {
      ...mapActions('abstraction', [ 'saveProject' ]),
      save() {
        this.saveProject();
      },
    },
  };
</script>
