<template>
  <div class="map-levels">
    <v-form class="map-levels__form">
      <v-row
          v-for="level in Object.keys(_value)"
          :key="level"
          class="map-levels__row"
      >
        <v-checkbox
            class="map-levels__item"
            :aria-label="`Zichtbaarheid van de kaartlaag voor het ${_value[level].label} watersysteem`"
            :label="_value[level].label"
            v-model="_value[level].active"
        />
      </v-row>
    </v-form>
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
  };
</script>

<style>
.map-levels {
  position: absolute;
  z-index: 100;
  top: 84px;
  left: 22px;
  flex-direction: column;
  min-width: min-content;
}

.map-levels__form {
  display: flex;
  flex-direction: column;
}

.map-levels__form > * {
  margin-bottom: 2px;
}

.map-levels__row {
  max-height: 24px;
}

.map-levels__item .v-input__slot{
  background-color: #ffffff;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, .12);
  padding: 0 6px;
  border-radius: 4px;
}

.map-levels__item .v-input__slot, .map-levels__item .v-input__control, .map-levels__item .v-input {
  min-width: min-content;
  flex-grow: 1;
}
</style>
