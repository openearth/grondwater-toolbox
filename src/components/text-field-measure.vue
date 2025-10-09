<template>
    <v-card
    class="pa-2 full-height d-flex"
    :class="{ 'benodigd-error': hasBenodigdError }"
    outlined
    tile
    >
      <v-text-field
         ref="textField"
          v-model="_value"
          class="hide-label"
          type="number"
          label="Verschil in rivierbodemhoogte (m)"
          :rules="nonValueRules"
          :messages="warningMessages"
          :disabled="disabled"
      />
        </v-card>
</template>
<script>
  export default {
    props: {
      differenceRules: Array,
      disabled: Boolean,
      value: String,
    },
    data() { 
      return {
        nonValueRules: [
          (value) => !!value || 'Benodigd.',
        ],
      };
    },
    emits: [ 'input' ],
    computed: {
      _value: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('input', value);
        },
      },
      // Extract warning messages from rules
      warningMessages() {
        const messages = [];
        if (this.differenceRules) {
          this.differenceRules.forEach(rule => {
            const result = rule(this.value);
            if (result !== true) {
              messages.push(result);
            }
          });
        }
        return messages;
      },
      // Check if any message is "Benodigd" for styling
      hasBenodigdError() {
        if (this.differenceRules) {
          return this.differenceRules.some(rule => {
            const result = rule(this.value);
            return result === 'Benodigd.';
          });
        }
        return false;
      },
    },
    watch: {
      differenceRules: {
        immediate: true,
        handler() {
          this.$nextTick(() => {
            this.$refs.textField.validate();
          });
        },
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

/* Style warning messages with orange/yellow color instead of red */
.hide-label .v-messages__message {
  color: #ff9800 !important; /* Orange color for warnings */
}

/* Style "Benodigd" messages with red color */
.benodigd-error .hide-label .v-messages__message {
  color: #f44336 !important; /* Red color for required field errors */
}
</style>
