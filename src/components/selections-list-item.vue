<template>
  <v-list-item class="px-0">
    <v-list-item-content class="pa-0">
      <v-list-item-title class="d-flex align-center flex-nowrap">
        <div class="flex-grow-1">{{ selection.name }}</div>

        <div v-if="selection.loading" class="pr-1">
          <v-progress-circular
            indeterminate
            color="grey"
            :size="26"
          />
        </div>

        <v-btn v-else text icon @click="onDelete">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  props: {
    selection: {
      type: Object,
      required: false
    }
  },
  methods: {
    ...mapMutations('mapbox', ['removeFeature']),
    ...mapMutations('selections', {
      removeSelection: 'remove'
    }),
    onDelete() {
      const { __draw } = this.$root.map;
      const { id } = this.selection;

      __draw.delete(id);

      this.removeSelection(id);
      this.removeFeature(id);
    }
  }
};
</script>