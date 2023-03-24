<template>
  <div class="layers-graph">
    <template v-if="hasProfile">
      <app-chart type="line-chart" />
    </template>
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
