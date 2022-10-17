<template>
  <div class="layers-graph">
    <template v-if="profile">
      <app-chart type="barStacked" />
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
    },
    methods: {
      ...mapActions('app', [ 'removeLockedViewerStep' ]),
    },
  };
</script>
