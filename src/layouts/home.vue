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
          Grondwater Toolbox
        </router-link>
      </v-toolbar-title>
      <v-spacer />
    </v-app-bar>
    <v-main>
      <section>
        <v-parallax src="@/assets/img/header.jpg" height="500"  />
      </section>
      <section>
        <v-container class="py-16">
          <v-row dense justify="center">
            <v-col
              sm="12"
              md="10"
              xl="6"
            >
              <h1 class="text-h4 mb-6">Grondwater toolbox – 3D verkenning van de effecten van ingrepen</h1>
              <p class="text-body-1">Op deze pagina presenteren wij een verzameling van eenvoudige tools waarmee u geavanceerde drie dimensionale grondwatermodellen kunt aansturen. U kunt met deze tools eenvoudige verkennende berekeningen uitvoeren zonder dat u uitgebreide kennis hoeft te hebben van de achterliggende gecompliceerde modellen en software.</p>
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
                class="mb-6"
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
              xl="6"
            >
              <p class="text-body-1">Proin rhoncus felis sed lectus interdum consequat. Cras condimentum tellus vel nibh viverra dignissim. Proin a ex non ligula faucibus scelerisque ac eu felis. Donec auctor odio elit. Proin pharetra diam at libero malesuada, vitae fermentum nunc interdum. Nunc egestas mauris velit, eu semper ligula pretium eu. Integer pharetra elit eget tempor ullamcorper. Sed ac dolor eu urna eleifend laoreet. Morbi quis sodales sapien, non scelerisque felis. Integer nisi urna, euismod et odio quis, volutpat accumsan odio. Proin ac volutpat dolor.</p>
              <p class="text-body-1">Etiam in sapien vitae ex dapibus interdum eu at lorem. Pellentesque vel lorem id velit fringilla egestas eu at augue. Nullam eget metus at sem dictum pretium. Morbi interdum purus ac tempor lacinia. Integer molestie nibh arcu, in rutrum ligula vestibulum eu. Donec sit amet est ornare, malesuada quam eget, ultricies dui. Curabitur sagittis nisl ut justo vestibulum viverra. Cras et facilisis sem.</p>
            </v-col>
          </v-row>
        </v-container>
      </section>
    </v-main>
    <v-footer color="primary" dark>
      <v-container>
        <v-row dense justify="center">
          <v-col
            sm="12"
            md="10"
            xl="6"
          >
            <span class="text-body-2">&copy; Deltares - {{ currentYear }}</span>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
  import { mapActions } from 'vuex';

  import { VALID_TOOL_CONFIGS } from '@/lib/constants';
  import { getToolData } from '@/repo/configRepo';

  export default {
    data() {
      return {
        configs: VALID_TOOL_CONFIGS,
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
  .v-card.v-sheet.v-sheet--outlined.theme--light {
    border-color: #BBDEFB; /* equal to 'blue lighten-4' modifier classes */
  }
  .v-parallax__image {
    object-fit: cover;
    height: 1000px;
  }
</style>
