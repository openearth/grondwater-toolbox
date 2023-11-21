<template>
  <div class="layers-graph" v-if="hasProfile">
    <marker-list />
    <v-divider class="mb-6" />
    <app-chart  type="line-chart" />
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import AppChart from '@/components/app-chart/app-chart';
  import MarkerList from '@/components/marker-list/marker-list';

  export default {
    components: {
      AppChart,
      MarkerList,
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
