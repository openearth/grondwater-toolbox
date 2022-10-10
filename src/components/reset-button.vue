<template>
  <v-btn
    v-if="isToolStepRoute"
    icon
    @click="onClick"
    title="Resetten"
  >
    <v-icon>mdi-refresh</v-icon>
  </v-btn>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    computed: {
      isNotIntroRoute() {
        return this.$route.name !== 'tool-introduction';
      },
      isToolStepRoute() {
        return this.$route.name.includes('tool-step');
      },
    },
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

          if (this.isNotIntroRoute) {
            this.$router.push({ name: 'tool-introduction' });
          }
        }
      },
    },
  };
</script>
