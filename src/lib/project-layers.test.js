import { generateWmsLayer } from './project-layers';

describe('Project layers', () => {
  it("should return a wms objec", () => {
    const url = generateWmsLayer({
      url: 'https://geoservices.rijkswaterstaat.nl/apps/geoserver/nwb_vaarwegen/wms',
      id: 'water-ways',
      layer: 'nwb_vaarwegen:vaarwegvakken'
    });

    expect(url).toEqual({
      "id": "water-ways",
      "paint": {},
      "source": {
        "tileSize": 256,
        "tiles": ["https://geoservices.rijkswaterstaat.nl/apps/geoserver/nwb_vaarwegen/wms?service=WMS&request=GetMap&width=256&height=256&layers=nwb_vaarwegen:vaarwegvakken&style=&srs=EPSG:3857&transparent=true&bbox={bbox-epsg-3857}&format=image/png"],
        "type": "raster"
      },
      "type": "raster"
    });
  });
});