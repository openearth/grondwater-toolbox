<template>
  <div class="configuration-card">
    <h3 class="text-h6 mb-2">
      <v-icon>mdi-vector-line</v-icon>
      {{ title }}
    </h3>
    <slot />
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        required: true,
      },
    },
  };
</script>
