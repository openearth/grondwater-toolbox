<template>
    <v-card
    class="pa-2 full-height d-flex"
    outlined
    tile
    >
        <v-text-field
            v-model="difference"
            class="hide-label"
            type="number"
            label="Verschil in rivierbodemhoogte (m)"
            :rules="differenceRules"
            :disabled="disabled"
        />
        </v-card>
</template>
<script>
  export default {
    props: {
      differenceRules: Array,
      disabled: Boolean,
    },
    data() { 
      return {
        difference: 1,
      };
    },
    watch: {
      difference(value) {
        this.$emit('update-difference-value', value);
      },
    },
  };

</script>
<style>
.hide-label {
  padding-top: 0;
  margin-top: 0;
}

.hide-label label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.hide-label .v-text-field__details,
.hide-label .v-text-field__details .v-messages {
  min-height: 0;
}
</style>
