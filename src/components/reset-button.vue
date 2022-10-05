<template>
  <v-btn text @click="onClick">Herstart</v-btn>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    methods: {
      ...mapActions([ 'reset' ]),

      onClick() {
        const resetRouteName = 'home';
        const accepted = confirm('Weet u zeker dat u opnieuw wilt beginnen?');

        if (accepted) {
          const { map } = this.$root;
          const { __draw } = map;

          this.reset();

          __draw.deleteAll();

          map.flyTo({ center: [ 5.2913, 52.1326 ], zoom: 6.5 });

          if (this.$route.name !== resetRouteName) {
            this.$router.push({ name: resetRouteName });
          }
        }
      },
    },
  };
</script>

<style>

</style>
