<template>
  <div class="pa-4 legal">
    <div v-html="content" />
  </div>
</template>

<script>
  import content from '../content/legal.md';

  export default {
    data() {
      return {
        content,
      };
    },
  };
</script>

<style>
.legal h2 {
  margin-bottom: 0.5rem;
}
</style>
