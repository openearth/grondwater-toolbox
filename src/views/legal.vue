<template>
  <div class="pa-4 legal">
    <h2 class="text-h4">Legal</h2>
    <v-divider class="mt-4 mb-4" />

    <div class="text-body-1" v-html="content" />
  </div>
</template>

<script>
  import content from '@/content/legal.md';

  export default {
    data() {
      return {
        content,
      };
    },
  };
</script>
