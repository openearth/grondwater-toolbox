<template>
  <v-btn @click="save" icon><v-icon>mdi-content-save</v-icon></v-btn>
</template>

<script>
export default {
  methods: {
    save() {
      this.$store.dispatch('saveProject');
    },
  },
};
</script>
