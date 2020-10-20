<template>
  <v-card outlined v-on="$listeners">
    <v-card-title>{{ title }}</v-card-title>

    <v-card-text>
      <slot />
    </v-card-text>
  </v-card>
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
