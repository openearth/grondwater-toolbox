import Mapbox from "mapbox-gl";
import getFeatureInfo from "@/lib/get-feature-info";

export default {
  name: "map-layer-info",
  render() {
    return null;
  },
  inject: ["map"],
  props: {
    layers: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      activePopup: null,
    };
  },
  created() {
    this.addListener();
  },
  destroyed() {
    this.map.off("click", this.layer, this.cb);
    this.removeActivePopup();
  },
  methods: {
    removeActivePopup() {
      if (this.activePopup) {
        this.activePopup.remove();
      }
    },
    async cb(event) {
      const bounds = this.map.getBounds();
      const canvas = this.map.getCanvas();
      const { x, y } = event.point;
      const { width, height } = canvas;

      this.removeActivePopup();

      new Mapbox.Popup()
        .setLngLat(event.lngLat)
        .setHTML("loading...")
        .addTo(this.map);

      const info = this.layers
        .map(
          async (layer) =>
            await getFeatureInfo({
              layer: layer.id,
              bounds,
              x,
              y,
              width,
              height,
            })
        )
        .find((info) => info);

      if (info) {
        const { properties } = info;
        const { GRAY_INDEX } = properties;
        const text = GRAY_INDEX.toFixed(2);

        this.activePopup.setLngLat(event.lngLat).setHTML(text);
      }
    },
    addListener() {
      this.map.on("click", this.cb);
    },
  },
};
