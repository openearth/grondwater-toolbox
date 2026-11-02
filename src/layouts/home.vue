<template>
  <v-app>
    <v-app-bar
      class="app-header"
      app
      color="primary"
      dark
    >
      <v-toolbar-title>
        <router-link
          :to="{ name: 'home' }"
          class="white--text text-decoration-none"
        >
          Direct Online Grondwatereffect Tool (DOG Tool) - 3D grondwater effectberekening van ingrepen
        </router-link>
      </v-toolbar-title>
      <v-spacer />
    </v-app-bar>
    <v-main>
      <section>
        <v-parallax src="@/assets/img/header.jpg" height="250">
          <v-container class="tool-tiles" fill-height>
            <v-row
              dense
              justify="center"
              align="center"
            >
              <v-col
                v-for="tool in tools"
                :key="tool.id"
                cols="6"
                md="3"
              >
                <v-card
                  :to="{ name: 'tool-introduction', params: { config: tool.id } }"
                  class="tool-tile text-center"
                  outlined
                  height="100%"
                >
                  <v-card-text class="pa-3 pa-sm-4">
                    <v-icon color="primary" size="32">
                      {{ toolPresentation[tool.id].icon }}
                    </v-icon>
                    <div class="text-subtitle-2 mt-1">
                      {{ toolPresentation[tool.id].title }}
                    </div>
                    <div class="text-caption">
                      {{ toolPresentation[tool.id].description }}
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-parallax>
      </section>
      <section>
        <v-container class="py-16">
          <v-row dense justify="center">
            <v-col
              sm="12"
              md="10"
              xl="6"
            >
              <h1 class="text-h4 mb-6">Direct Online Grondwatereffect Tool (DOG Tool) - 3D grondwater effectberekening van ingrepen</h1>
              <p class="text-body-1">Op deze pagina presenteren wij een verzameling van eenvoudige tools waarmee u geavanceerde drie dimensionale grondwatermodellen kunt aansturen. U kunt met deze tools eenvoudige verkennende berekeningen uitvoeren zonder dat u uitgebreide kennis hoeft te hebben van de achterliggende modellen en software. Mocht u wel meer willen weten over de achterliggende modellen en/of ook gebruik willen maken van de niet-stationaire versie van het LHM om detail berekeningen uit te voeren, volg dan de instructies op welke via <a href="https://nhi.nu/" target="_blank">NHI.nu</a> beschikbaar zijn.</p>
              <p class="text-body-1">De berekeningen worden gedaan met een stationaire MODFLOW versie waarbij voor de peilen van het hoofd watersysteem gebruik gemaakt wordt van het winterpeil. Daarnaast wordt voor de grondwateraanvulling uitgegaan van een gemiddelde.</p>
              <p class="text-body-1">De berekende effecten zijn indicatief en kunnen gebruikt worden bij het verkennen van ingrepen. De website is met de grootst mogelijke zorgvuldigheid opgezet. Echter, de website dient slechts voor informatieve doeleinden. Er kunnen geen rechten aan de informatie op de website worden ontleend en het gebruik van de website en de aangeboden informatie is voor uw eigen rekening en risico. Noch Deltares, noch andere partijen bij het NHI, aanvaarden enige vorm van aansprakelijkheid - uit welke hoofde dan ook - voor enige vorm van schade (met inbegrip van zaakschade, vermogensschade als gevolg van materiële schade en zuivere vermogensschade) die op enigerlei wijze voortvloeit uit de werking van en/of het gebruik van (informatie op) de website.</p>
              <p class="text-body-1">Noch Deltares noch andere partijen betrokken bij het NHI kunnen garanderen dat de website virusvrij is of zonder fouten en/of onderbrekingen zal functioneren. De website kan te allen tijde worden gewijzigd door Deltares. Op de website alsmede op deze voorwaarden is Nederlands recht van toepassing.</p>
            </v-col>
          </v-row>
        </v-container>
      </section>
      <section class="blue lighten-5">
        <v-container class="py-16">
          <v-row dense justify="center">
            <v-col
              sm="12"
              md="10"
              xl="6"
            >
              <h2 class="text-h4 mb-6">Beschikbare tools</h2>
            </v-col>
          </v-row>
          <v-row dense justify="center">
            <v-col
              sm="12"
              md="10"
              xl="6"
            >
              <v-card
                v-for="(tool, index) in tools"
                :key="index"
                class="tool-card mb-6"
                outlined
              >
                <v-card-title class="text-h5">
                  {{ tool.name }}
                </v-card-title>

                <v-card-subtitle>
                  {{ tool.title }}
                </v-card-subtitle>

                <v-card-text>{{ tool.description }}</v-card-text>

                <v-card-actions>
                  <v-btn
                    :to="{ name: 'tool-introduction', params: { config: tool.id } }"
                    color="primary"
                    text
                  >
                    Bekijken
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>
      <section>
        <v-container class="py-16">
          <v-row dense justify="center">
            <v-col
              sm="12"
              md="10"
              xl="6">
              <p class="text-body-1">De Direct Online Grondwatereffect Tool (DOG tool) is mogelijk gemaakt door RWS in samenwerking met Deltares.</p>
              <p class="text-body-1">De toolbox maakt het mogelijk om diverse ingrepen te simuleren via online interactie met de stationaire schematisatie in iMODFLOW van LHM3.4. Meer weten, neem dan contact op met <a href="mailto:deltaresdata@deltares.nl?&subject=Online modelling feedback&body=Ik heb de online modelling tool gezien en getest en ik wil graag meer weten of heb opmerkingen over deze tool.">Helpdesk Data van Deltares</a>.</p>
            </v-col>
          </v-row>
          <v-row dense justify="center">
            <v-col
              sm="4"
              md="2"
              xl="1"
            >
              <img src="@/assets/img/deltares-logo.png" class="deltares_logo"/>
            </v-col>
            <v-col
              sm="4"
              md="2"
              xl="1"
            >
              <img src="@/assets/img/Rijkswaterstaat_logo.png" class="rws_logo"/>
            </v-col>
          </v-row>
        </v-container>
      </section>
    </v-main>
    <v-footer color="primary" dark>
      <v-container>
        <v-row dense justify="center">
          <v-col>
            <span class="text-body-2">&copy; Deltares - {{ currentYear }}</span>
            <span class="text-body-2">                                          RWS GPO - {{ currentYear }}</span>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
  import { mapActions } from 'vuex';
  import { mdiArrowCollapseDown, mdiShovel, mdiWaves, mdiWaterPump } from '@mdi/js';

  import { VALID_TOOL_CONFIGS } from '@/lib/constants';
  import { getToolData } from '@/repo/configRepo';

  const TOOL_PRESENTATION = {
    abstraction: {
      icon: mdiWaterPump,
      title: 'Grondwater onttrekken',
      description: 'Effect van een onttrekking',
    },
    drainage: {
      icon: mdiArrowCollapseDown,
      title: 'Ontwatering verlagen',
      description: 'Effect van verlagen ontwatering',
    },
    brl: {
      icon: mdiWaves,
      title: 'Maatregelen in watersysteem',
      description: 'Effect van ingrepen in watergangen',
    },
    dig: {
      icon: mdiShovel,
      title: 'Waterbodem ontgraven',
      description: 'Effect van een ontgraving',
    },
  };

  export default {
    data() {
      return {
        configs: VALID_TOOL_CONFIGS,
        toolPresentation: TOOL_PRESENTATION,
        toolData: null,
      };
    },
    mounted() {
      this.getConfigData();
    },
    created() {
      this.resetAbstraction();
      this.resetApp();
      this.mapboxReset();
      this.selectionsReset();
    },
    computed: {
      currentYear() {
        return new Date().getFullYear();
      },
      tools() {
        return this.toolData;
      },
    },
    methods: {
      ...mapActions('abstraction', { resetAbstraction: 'reset' }),
      ...mapActions('app', { resetApp: 'reset' }),
      ...mapActions('mapbox', { mapboxReset: 'reset' }),
      ...mapActions('selections', { selectionsReset: 'reset' }),

      async getConfigData() {
        return await Promise.all(this.configs.map(config => getToolData(config)))
          .then(data => this.toolData = data);
      },
    },
  };
</script>

<style scoped>
  .tool-tiles {
    padding-top: 12px;
    padding-bottom: 12px;
  }
  .tool-tile {
    background-color: rgba(255, 255, 255, 0.5) !important;
    border-color: rgba(255, 255, 255, 0.65) !important;
    color: #263238;
    text-decoration: none;
    transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
    backdrop-filter: blur(4px);
  }
  .tool-tile:hover,
  .tool-tile:focus {
    background-color: rgba(255, 255, 255, 0.65) !important;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
  .tool-card {
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }
  .tool-card:hover,
  .tool-card:focus-within {
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
  .v-card.v-sheet.v-sheet--outlined.theme--light {
    border-color: #BBDEFB; /* equal to 'blue lighten-4' modifier classes */
  }
  .v-parallax__image {
    object-fit: cover;
    height: 1000px;
  }
  .deltares_logo{
    max-width: 200px;
    padding-top: 20px;
    padding-right: 40px;

  }
  .rws_logo{
    max-width: 200px;
  }

</style>
