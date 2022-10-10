<template>
  <div class="abstraction-step-1">
    <p>Some new component for step: {{ viewerCurrentStep.title }}</p>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  export default {
    data() {
      return {
        foo: 'bar',
      };
    },
    computed: {
      ...mapGetters('app', [ 'viewerCurrentStep' ]),
    },
  };
</script>

<style src="./abstraction-step-1.css" lang="css"></style>
