<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>

    <v-card-text>
      <configuration-form
        v-for="(_, index) in formCount"
        :key="index"
        :disabled="disabled"
        @input="handleInput($event, index)"
      /> 
    </v-card-text>
  </v-card>
</template>

<script>
import ConfigurationForm from '@/components/configuration-form';

export default {
  components: {
    ConfigurationForm
  },
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formCount: 1
    };
  },
  methods: {
    handleInput(data, index) {
      this.$emit('input', { id: this.id, data, index });
    }
  }
};
</script>

<style>

</style>