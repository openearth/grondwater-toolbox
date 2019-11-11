<template>
  <div class="pa-4 fill-height d-flex flex-column">
    <h2>Selections</h2>
    <selections-list />

    <sidebar-footer>
      <v-btn slot="end" class="primary" :to="{ name: 'calculation' }">Next</v-btn>
    </sidebar-footer>
  </div>
</template>

<script>
import SidebarFooter from './sidebar-footer';
import SelectionsList from './selections-list';

export default {
  components: {
    SelectionsList,
    SidebarFooter
  }
};
</script>