<template>
  <v-app>
    <v-navigation-drawer
      app
      permanent
    >
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-contact-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Contact</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="indigo"
      dark
    >
      <v-toolbar-title>BRL</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <app-map />
    </v-content>
  </v-app>
</template>

<script>
import AppMap from './components/app-map'

export default {
  components: {
    AppMap
  }
};
</script>
