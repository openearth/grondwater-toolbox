<template>
  <div class="pb-6 pt-4 border-bottom">
    <h3 class="text-h6 mb-2">{{ title }}</h3>

    <slot />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
  }
};
</script>
