<template>
  <v-list-item class="px-0">
    <v-list-item-content class="pa-0">
      <v-list-item-title class="d-flex align-center flex-nowrap">
        <form
          class="flex-grow-1"
          v-if="isEditing"
          @submit.prevent="onSave"
        >
          <v-text-field
            v-if="isEditing"
            v-model="name"
            placeholder="Name"
            class="pt-0 mb-n3"
            autofocus
          />
        </form>
        <div v-else class="flex-grow-1">{{ selection.name }}</div>

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
            title="save selection name"
            @click="onSave"
          >
            <v-icon>mdi-check</v-icon>
          </v-btn>
          <v-btn
            v-else
            text
            icon
            title="edit selection name"
            @click="onEdit"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            text
            icon
            title="delete selection"
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
  import { mapActions, mapMutations } from 'vuex';

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
    methods: {
      ...mapActions('selections', [ 'removeSelection', 'editSelectionName' ]),
      ...mapMutations('mapbox', [ 'removeFeature' ]),
      onDelete() {
        const { __draw } = this.$root.map;
        const { id } = this.selection;

        __draw.delete(id);

        this.removeSelection({ id });
        this.removeFeature(id);
      },
      onEdit() {
        this.isEditing = true;
      },
      onSave() {
        const { id } = this.selection;
        this.isEditing = false;
        this.editSelectionName({ id, name: this.name });
      },
    },
  };
</script>
