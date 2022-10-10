<template>
  <div class="pa-4">
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
