<template>
  <v-btn text @click="onClick">Herstart</v-btn>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  methods: {
    ...mapActions(['reset']),
    onClick() {
      const resetRouteName = 'selection';
      const accepted = confirm("Weet u zeker dat u opnieuw wilt beginnen?");

      if (accepted) {
        const { __draw } = this.$root.map;

        this.reset();
        __draw.deleteAll();

        if (this.$route.name !== resetRouteName) {
          this.$router.push({ name: resetRouteName });
        }
      }
    }
  }
};
</script>

<style>

</style>