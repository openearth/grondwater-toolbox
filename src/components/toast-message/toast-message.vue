<template>
  <transition name="fade">
    <v-snackbar
      v-if="canShowMessage"
      :value="true"
      :color="isErrorToastMessage ? 'error' : null"
      :timeout="duration"
      elevation="24"
      bottom
    >
      {{ message.text }}
      <template slot="action">
        <v-btn
          v-if="!isErrorToastMessage"
          title="Close message"
          icon
          @click="onCloseClicked"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </transition>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    props: {
      message: {
        type: Object,
        default: () => ({}),
      },
      show: {
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {
        duration: 2000,
      };
    },
    computed: {
      canShowMessage() {
        if (!this.message) {
          return false;
        }

        if (this.show && this.isErrorToastMessage) {
          this.resetWithTimeout();
        }

        return this.show;
      },
      isErrorToastMessage() {
        return this.message.type === 'error';
      },
    },
    methods: {
      ...mapActions('app', [ 'resetToastMessage' ]),
      onCloseClicked() {
        this.resetToastMessage();
        this.$emit('click');
      },
      resetWithTimeout() {
        setTimeout(() => this.resetToastMessage(), this.duration);
      },
    },
  };
</script>
