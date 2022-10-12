<template>
  <div v-if="hasProfile" class="layers-graph">
    [Graph goes here]
    <pre>Data:</pre>
    <pre><code>{{ profile }}</code></pre>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';

  export default {
    data() {
      return {
        foo: 'bar',
      };
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

<style src="./layers-graph.css"></style>
