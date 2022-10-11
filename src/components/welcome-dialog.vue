<template>
  <v-dialog
    v-model="showDialog"
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
          @click="onClick"
        >
          Accepteren
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';

  import cookie from '@/lib/cookie';

  import content from '@/content/legal.md';

  export default {
    data: () => ({
      accepted: false,
      content,
    }),
    created() {
      let termsAndConditionsAccepted = cookie('gtb_tac_accepted');

      if (termsAndConditionsAccepted) {
        this.setTermsAndConditionsAccepted({ accepted: true });
      }
    },
    computed: {
      ...mapGetters('app', [ 'termsAndConditionsAccepted' ]),
      showDialog() {
        return !this.termsAndConditionsAccepted;
      },
    },
    methods: {
      ...mapActions('app', [ 'setTermsAndConditionsAccepted' ]),
      onClick() {
        this.setTermsAndConditionsAccepted({ accepted: true });
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
