<template>
  <v-list-item class="px-0">
    <v-list-item-icon>
      <v-icon>mdi-vector-line</v-icon>
    </v-list-item-icon>
    <v-list-item-content class="pa-0">
      <v-list-item-title class="d-flex align-center flex-nowrap">
        <form
          class="flex-grow-1"
          v-if="isEditing"
          @submit.prevent="onSave"
        >
          <v-text-field
            v-model="name"
            placeholder="Selectie naam"
            class="pt-0 mb-n3"
            autofocus
          />
        </form>
        <span v-else class="flex-grow-1 text-body-1">{{ selection.name }}</span>

        <div v-if="selection.loading" class="pr-1">
          <v-progress-circular
            indeterminate
            color="grey"
            :size="26"
          />
        </div>

        <template v-else>
          <v-btn
            v-if="isEditing"
            text
            icon
            title="Save selection name"
            @click="onSave"
          >
            <v-icon>mdi-check</v-icon>
          </v-btn>
          <v-btn
            v-else
            text
            icon
            title="Edit selection name"
            @click="onEdit"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            text
            icon
            title="Delete selection"
            @click="onDelete"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    props: {
      selection: {
        type: Object,
        required: false,
      },
    },
    data() {
      return {
        isEditing: false,
        name: '',
      };
    },
    mounted() {
      this.name = this.selection.name;
    },
    destroyed(){
      this.deleteSelectionsFromMap();
    },
    methods: {
      ...mapActions('mapbox', [ 'removeFeature' ]),
      ...mapActions('selections', [ 'removeSelection', 'editSelectionName' ]),
      onDelete() {
        this.deleteSelectionsFromMap();
      },
      onEdit() {
        this.isEditing = true;
      },
      onSave() {
        const { id } = this.selection;
        this.isEditing = false;
        this.editSelectionName({ id, name: this.name });
      },
      deleteSelectionsFromMap() {
        const { __draw } = this.$root.map;
        const { id } = this.selection;

        __draw.delete(id);
        this.removeSelection({ id });
        this.removeFeature({ id });
      },
    },
  };
</script>
