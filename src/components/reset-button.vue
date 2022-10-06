<template>
  <v-btn
    icon
    @click="onClick"
    title="Reset"
  >
    <v-icon>mdi-refresh</v-icon>
  </v-btn>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    methods: {
      ...mapActions('data', [ 'reset' ]),
      onClick() {
        const accepted = confirm('Weet u zeker dat u opnieuw wilt beginnen?');

        if (accepted) {
          const { map } = this.$root;
          const { __draw } = map;

          this.reset();

          __draw.deleteAll();

          map.flyTo({ center: [ 5.2913, 52.1326 ], zoom: 6.5 });

          if (this.$route.name !== 'tool-introduction') {
            this.$router.push({ name: 'tool-introduction' });
          }
        }
      },
    },
  };
</script>
