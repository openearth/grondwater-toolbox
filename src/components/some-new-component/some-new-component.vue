<template>
  <div class="some-new-component">
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

<style src="./some-new-component.css" lang="css"></style>
