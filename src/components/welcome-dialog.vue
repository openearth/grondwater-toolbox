<template>
  <v-dialog
    v-model="showWelcomeDialog"
    max-width="640"
    persistent
  >
    <v-card>
      <v-card-title class="headline mb-2">
        Grondwater Toolbox
      </v-card-title>
      <div class="welcome-dialog__images">
        <img
          src="@/assets/img/OE_logo.png"
          alt="OE logo"
        >
        <img
          src="@/assets/img/logo-m-2x.png"
          alt="Deltares logo"
        >
      </div>
      <v-card-text>
        <div class="text-body-2" v-html="content" />
        <v-checkbox
          v-model="accepted"
          label="Ik ga akkoord met de voorwaarden zoals hierboven beschreven"
        ></v-checkbox>
      </v-card-text>
      <v-card-actions class="px-6 pb-6">
        <v-spacer></v-spacer>
        <v-btn
          :disabled="!accepted"
          :class="{ primary: accepted }"
          text
          depressed
          @click="onStartClick"
        >
          Starten
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import content from '../content/legal.md';

  export default {
    data: () => ({
      accepted: false,
      showWelcomeDialog: true,
      content,
    }),
    methods: {
      onStartClick() {
        this.showWelcomeDialog = false;
      },
    },
  };
</script>

<style>
  .welcome-dialog__images {
    display: flex;
    padding: 0 1.5rem 1.5rem;
    align-items: flex-start;
  }

  .welcome-dialog__images img {
    width: 10rem;
    margin-right: 1rem;
  }
</style>
