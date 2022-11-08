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
        <v-parallax src="@/assets/img/cq5dam.web.1280.1280.jpeg" height="500" />
      </section>
      <section>
        <v-container class="py-16">
          <v-row dense justify="center">
            <v-col
              sm="12"
              md="10"
              xl="6"
            >
              <h1 class="text-h4 mb-6">Grondwater Toolbox</h1>
              <p class="text-body-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel risus risus. Maecenas ac tincidunt sapien, eget aliquet mauris. Sed eleifend, metus ut maximus laoreet, neque dui volutpat neque, eu suscipit lectus sapien non lacus. Suspendisse vel nisl posuere, porttitor tortor ut, consequat lacus. Vestibulum eleifend egestas mi, eu pharetra nulla fringilla vitae. Vivamus ultricies magna eu eros vehicula pellentesque. Vestibulum elementum orci tempus nunc consequat, ac luctus nisl tristique. Praesent blandit porttitor vulputate. Aliquam vulputate, lectus nec interdum posuere, nunc enim auctor diam, eget elementum augue ex non enim. Vivamus eget interdum est. Proin luctus quis eros et pretium. Morbi ac augue orci.</p>
              <p class="text-body-1">Aliquam nec feugiat tellus. Duis sit amet nulla est. Nulla at elit elementum, commodo mi et, tempor risus. Aenean risus velit, scelerisque et volutpat et, feugiat et mauris. Praesent quis lectus non sapien laoreet imperdiet. Suspendisse vehicula sapien et elit cursus, vitae fermentum risus tempor. Cras dictum tincidunt nunc, in ultrices dui ultrices quis. Sed nec dolor volutpat tellus sagittis consequat. In hac habitasse platea dictumst. Proin faucibus eros quis diam luctus, quis luctus mi varius. Duis euismod, nisi ac facilisis facilisis, sapien dolor imperdiet velit, in hendrerit lacus elit sit amet diam.</p>
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
