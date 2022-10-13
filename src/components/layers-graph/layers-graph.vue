<template>
  <div class="layers-graph" v-if="hasProfile">
    <app-chart type="barStacked" />
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import AppChart from '@/components/app-chart/app-chart';

  export default {
    components: {
      AppChart,
    },
    updated() {
      if (this.hasProfile) {
        this.removeLockedViewerStep({ step: 2 });
      }
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
