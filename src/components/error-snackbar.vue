<template>
  <v-snackbar
    v-model="show"
    color="error"
    top
  >
    {{ message }}
    <v-btn
      text
      @click="show = false"
    >
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      message: '',
      show: false
    };
  },
  created() {
    this.$store.watch(
      state => state.error,
      value => {
        this.message = value.message;
        this.show = true;
      },
    );
  }
};
</script>

<style>

</style>