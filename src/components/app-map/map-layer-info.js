import Mapbox from "mapbox-gl";
import getFeatureInfo from '@/lib/get-feature-info';

export default {
  name: "map-layer-info",
  render() {
    return null;
  },
  inject: ["map"],
  props: {
    layer: {
      type: String,
      required: true,
    },
  },
  data: {
    // not returning an object here because the
    // data needs to be shared across instances
    popup: null
  },
  created() {
    this.addListener(this.layer);
  },
  destroyed() {
    this.map.off("click", this.layer, this.cb);
  },
  methods: {
    async cb(event) {
      const bounds = this.map.getBounds();
      const canvas = this.map.getCanvas();
      const { x, y } = event.point;
      const { width, height } = canvas;

      const info = await getFeatureInfo({
        layer: this.layer.id,
        bounds,
        x,
        y,
        width,
        height,
      });

      if (this.popup) {
        this.popup.remove();
      }

      if (info) {
        const { properties } = info;
        const { GRAY_INDEX } = properties;
        const text = GRAY_INDEX.toFixed(2);

        this.popup = new Mapbox.Popup()
          .setLngLat(event.lngLat)
          .setHTML(text)
          .addTo(this.map);
      }

    },
    addListener() {
      this.map.on("click", this.cb);
    },
    async getValue(layer, coordinates) {
      const test = await getFeatureInfo({ layer, coordinates });
      return test;
    }
  },
};
