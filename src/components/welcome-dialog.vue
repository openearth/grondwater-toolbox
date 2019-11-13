<template>
  <v-dialog
    v-model="showWelcomeDialog"
    max-width="640"
    persistent
  >
    <v-card>
      <v-card-title class="headline mb-2">
        Basis Rivierbodem Ligging
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
        <p>Welkom op de website Basisrivierbodemligging. Middels deze website is het mogelijk de effecten van een
          wijziging in de hoogte van de rivierbodem te simuleren met het <a href="http://www.nhi.nu/">Landelijk Hydrologisch Model</a>. De
          gebruikte modelversie is 3.4.0 en is gepubliceerd op <a href="http://www.nhi.nu/">nhi.nu</a>.</p>

        <p>De website is met de grootst mogelijke zorgvuldigheid opgezet. Echter, de website dient slechts voor
          informatieve doeleinden. Er kunnen geen rechten aan de informatie op de website worden ontleend en het gebruik
          van de website en de aangeboden informatie is voor uw eigen rekening en risico. Noch Deltares, noch andere
          partijen bij het NHI, aanvaarden enige vorm van aansprakelijkheid - uit welke hoofde dan ook - voor enige vorm
          van schade (met inbegrip van zaakschade, vermogensschade als gevolg van materiële schade en zuivere
          vermogensschade) die op enigerlei wijze voortvloeit uit de werking van en/of het gebruik van (informatie op)
          de website.</p>

        <p>Noch Deltares noch andere partijen betrokken bij het NHI kunnen garanderen dat de website virusvrij is of
          zonder fouten en/of onderbrekingen zal functioneren. De website kan te allen tijde worden gewijzigd door
          Deltares. Op de website alsmede op deze voorwaarden is Nederlands recht van toepassing.</p>

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
          @click="showWelcomeDialog = false"
        >
          Starten
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    accepted: false,
    showWelcomeDialog: true
  })
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
