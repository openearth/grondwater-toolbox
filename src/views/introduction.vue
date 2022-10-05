<template>
  <div class="pa-4 home d-flex flex-column">
    <div>
      <h2 class="h2">
        Introduction
      </h2>

      <v-divider class="mt-4 mb-4" />
    </div>

    <div class="home__content">
      <div v-html="content" />
    </div>

    <div class="d-flex pt-4">
      <v-btn class="primary ml-auto" :to="{ name: 'selection' }">Get started</v-btn>
    </div>
  </div>
</template>

<script>
  import content from '../content/introduction.md';

  export default {
    data() {
      return {
        content,
      };
    },
  };
</script>

<style>
  .home {
    height: 100%;
    overflow: hidden;
  }

  .home__content {
    overflow-y: auto;
    flex: 1;
  }

  .home__logos img {
    height: 100%;
  }
</style>
