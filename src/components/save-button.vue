<template>
  <v-btn
    icon
    title="Save selection"
    @click="save"
  >
    <v-icon>mdi-content-save</v-icon>
  </v-btn>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    methods: {
      ...mapActions('data', [ 'saveProject' ]),
      save() {
        this.saveProject();
      },
    },
  };
</script>
