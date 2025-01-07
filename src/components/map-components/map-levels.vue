<template>
  <div class="map-levels">
    <!--        <v-btn-->
    <!--            color="#008fc5"-->
    <!--            class="map-levels__item justify-start white&#45;&#45;text"-->
    <!--            v-for="level in Object.keys(_value)"-->
    <!--            :key="level"-->
    <!--            @click="onToggle(level)"-->
    <!--            :aria-label="`Zichtbaarheid van de kaartlaag voor het ${_value[level].label} watersysteem`"-->
    <!--        >-->
    <!--          <v-icon>-->
    <!--            {{ _value[level].active ? 'mdi-eye' : 'mdi-eye-off'}}-->
    <!--          </v-icon>-->
    <!--          {{ _value[level].label }}-->
    <!--        </v-btn>-->
    <v-treeview
        class="map-levels__tree"
        expand-icon="mdi-chevron-down"
        dense
        :items=" [ {
          label: 'Watersystemen',
          children: Object.entries(this._value).flatMap(([ level, data ]) => ({ level, ...data })),
        } ]"
        open-on-click
    >

      <template #label="{ item }">
        <v-btn
            plain
            color="#008fc5"
            class="justify-start map-levels__button"
            :key="item.label.toLowerCase()"
            v-if="'active' in item"
            @click="onToggle(item.level)"
            :aria-label="`Zichtbaarheid van de kaartlaag voor het ${item.label} watersysteem`"
        >
          <v-icon>
            {{ item.active ? 'mdi-eye' : 'mdi-eye-off' }}
          </v-icon>
          <span class="text-body-1">
            {{ item.label }}
          </span>
        </v-btn>

        <span v-else class="text-body-1 pr-2">
          {{ item.label }}
        </span>
      </template>
    </v-treeview>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Object,
        required: true,
      },
    },
    emits: [ 'input' ],
    computed: {
      _value: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('input', value);
        },
      },
    },
    methods: {
      onToggle(level) {
        this._value[level].active = !this._value[level].active;
      },
    },
  };
</script>

<style>
.map-levels {
  position: absolute;
  border-radius: 4px;
  overflow: hidden;
  z-index: 100;
  width: 180px;
  top: 92px;
  left: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, .12);
}

.map-levels .v-treeview-node__level {
  display: none;
}

.map-levels__tree .v-treeview-node {
  position: relative;
  background: white;
}

.map-levels__button {
  position: static;
}

.map-levels__button::after {
  content: '';
  position: absolute;
  inset: 0;
}
</style>
