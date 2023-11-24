<template>
  <div class="surface-profile" v-if="hasProfile">
    <h2 v-if="!hideTitle" class="text-h4">Profiel ondergrond</h2>
    <marker-placed />
    <v-divider class="mb-6" />
    <app-chart  type="line-chart" />
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import AppChart from '@/components/app-chart/app-chart';
  import MarkerPlaced from '@/components/marker-placed/marker-placed';

  export default {
    props: {
      hideTitle: {
        type: Boolean,
      },
    },
    components: {
      AppChart,
      MarkerPlaced,
    },
    computed: {
      ...mapGetters('abstraction', [ 'profile' ]),
      hasProfile() {
        return this.profile !== null;
      },
    },
    methods: {
      ...mapActions('app', [ 'removeLockedViewerStep' ]),
    },
  };
</script>
