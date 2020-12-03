<template>
  <v-btn @click="save" icon><v-icon>mdi-content-save</v-icon></v-btn>
</template>

<script>
export default {
  methods: {
    save() {
      const ok = confirm('Alleen je selecties worden opgeslagen, op dit moment is het nog niet mogelijk om de configuratie op te slaan.');
      
      if (ok) {
        this.$store.dispatch('saveProject');
      }
    },
  },
};
</script>
