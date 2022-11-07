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
        <v-parallax src="@/assets/img/cq5dam.web.1280.1280.jpeg" height="300" />
      </section>
      <section>
        <v-container class="py-16">
          <v-row dense justify="center">
            <v-col
              sm="12"
              md="10"
              xl="6"
            >
              <h1 class="text-h4">Grondwater Toolbox</h1>
              <p class="text-body-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel risus risus. Maecenas ac tincidunt sapien, eget aliquet mauris. Sed eleifend, metus ut maximus laoreet, neque dui volutpat neque, eu suscipit lectus sapien non lacus. Suspendisse vel nisl posuere, porttitor tortor ut, consequat lacus. Vestibulum eleifend egestas mi, eu pharetra nulla fringilla vitae. Vivamus ultricies magna eu eros vehicula pellentesque. Vestibulum elementum orci tempus nunc consequat, ac luctus nisl tristique. Praesent blandit porttitor vulputate. Aliquam vulputate, lectus nec interdum posuere, nunc enim auctor diam, eget elementum augue ex non enim. Vivamus eget interdum est. Proin luctus quis eros et pretium. Morbi ac augue orci.</p>
              <p class="text-body-1">Aliquam nec feugiat tellus. Duis sit amet nulla est. Nulla at elit elementum, commodo mi et, tempor risus. Aenean risus velit, scelerisque et volutpat et, feugiat et mauris. Praesent quis lectus non sapien laoreet imperdiet. Suspendisse vehicula sapien et elit cursus, vitae fermentum risus tempor. Cras dictum tincidunt nunc, in ultrices dui ultrices quis. Sed nec dolor volutpat tellus sagittis consequat. In hac habitasse platea dictumst. Proin faucibus eros quis diam luctus, quis luctus mi varius. Duis euismod, nisi ac facilisis facilisis, sapien dolor imperdiet velit, in hendrerit lacus elit sit amet diam.</p>
            </v-col>
          </v-row>
        </v-container>
      </section>
      <section class="blue lighten-5">
        <v-container class="pt-16">
          <v-row dense justify="center">
            <v-col
              sm="12"
              md="10"
              xl="6"
            >
              <h2 class="text-h4">Beschikbare tools</h2>
            </v-col>
          </v-row>
        </v-container>
      </section>
      <section class="blue lighten-5">
        <v-container class="pt-6 pb-16">
          <v-row dense justify="center">
            <v-col
              v-for="(tool, index) in tools"
              :key="index"
              sm="6"
              md="5"
              xl="3"
            >
              <v-card outlined>
                <v-card-title class="text-h5">
                  {{ tool.title }}
                </v-card-title>

                <v-card-text>{{ tool.description }}</v-card-text>

                <v-card-actions>
                  <v-btn
                    color="primary"
                    :to="{ name: 'tool-introduction', params: { config: tool.id } }"
                    depressed
                  >
                    Bekijken
                  </v-btn>
                </v-card-actions>
              </v-card>
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
    computed: {
      currentYear() {
        return new Date().getFullYear();
      },
      tools() {
        return this.toolData;
      },
    },
    methods: {
      async getConfigData() {
        return await Promise.all(this.configs.map(config => getToolData(config)))
          .then(data => this.toolData = data);
      },
    },
  };
</script>
