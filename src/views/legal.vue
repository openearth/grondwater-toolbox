<template>
  <div class="pa-4">
    <div v-html="content" />
  </div>
</template>

<script>
import content from '../content/legal.md';

export default {
  data() {
    return {
      content
    };
  }
};
</script>
