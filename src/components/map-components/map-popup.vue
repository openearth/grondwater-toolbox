<template>
  <div style="display: none">
    {{ content }}
  </div>
</template>

<script>
  import withEvents from 'vue-mapbox/src/lib/withEvents.js';
  import withSelfEvents from 'vue-mapbox/src/components/UI/withSelfEvents';

  const popupEvents = {
    open: 'open',
    close: 'close',
  };

  /**
   * Popup component.
   * @see See [Mapbox Gl JS Popup](https://www.mapbox.com/mapbox-gl-js/api/#popup)
   */
  export default {
    name: 'Popup',
    mixins: [ withEvents, withSelfEvents ],

    inject: {
      mapbox: {
        default: null,
      },
      map: {
        default: null,
      },
      marker: {
        default: null,
      },
    },

    props: {
      content: {
        type: [ String, Object ],
        default: '',
      },
      closeButton: {
        type: Boolean,
        default: true,
      },
      closeOnClick: {
        type: Boolean,
        default: true,
      },
      anchor: {
        validator(value) {
          let allowedValues = [
            'top',
            'bottom',
            'left',
            'right',
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right',
          ];
          return typeof value === 'string' && allowedValues.includes(value);
        },
        default: undefined,
      },
      offset: {
        type: [ Number, Object, Array ],
        default: () => [ 0, 0 ],
      },
      coordinates: {
        type: Array,
      },
      onlyText: {
        type: Boolean,
        default: false,
      },
      showed: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      return {
        initial: true,
        popup: undefined,
      };
    },

    computed: {
      open: {
        get() {
          if (this.popup !== undefined) {
            return this.popup.isOpen();
          }
          return false;
        },
        set(value) {
          if (this.map && this.popup) {
            if (!value) {
              this.popup.remove();
            } else {
              this.popup.addTo(this.map);
            }
          }
        },
      },
    },

    watch: {
      coordinates(lngLat) {
        if (this.initial) {
          return;
        }
        this.popup.setLngLat(lngLat);
      },
      content(){
        if (this.initial) {
          return;
        }
        this.popup.setHTML(this.content);
      },
      showed(next, prev) {
        if (next !== prev) {
          this.open = next;
          if (this.marker) {
            this.marker.togglePopup();
          }
        }
      },
    },

    created() {
      this.popup = new this.mapbox.Popup(this.$props);
    },

    mounted() {
      this.$_addPopup();
      this.initial = false;
    },

    beforeDestroy() {
      if (this.map) {
        this.popup.remove();
        this.$emit('removed');
      }
    },

    methods: {
      $_addPopup() {
        this.popup = new this.mapbox.Popup(this.$props);
        if (this.coordinates !== undefined) {
          this.popup.setLngLat(this.coordinates);
        }
        if (this.content !== '') {
          this.popup.setHTML(this.content);
        }

        this.$_bindSelfEvents(Object.keys(popupEvents), this.popup);

        this.$emit('added', { popup: this.popup });

        if (this.marker) {
          this.marker.setPopup(this.popup);
        }
        if (this.showed) {
          this.open = true;

          if (this.marker) {
            this.marker.togglePopup();
          }
        }
      },

      $_emitSelfEvent(event) {
        this.$_emitMapEvent(event, { popup: this.popup });
      },

      remove() {
        this.popup.remove();
        this.$emit('remove', { popup: this.popup });
      },
    },
  };
</script>
