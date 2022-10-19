import geoserverUrl from './geoserver-url';
import layers from './mapbox/layers';

export const generateWmsLayer = ({ url, id, layer, style='', paint={} }) => {
  const tile = geoserverUrl({
    url,
    service: 'WMS',
    request: 'GetMap',
    layers: layer,
    style,
    srs: 'EPSG:3857',
    transparent: true,
    bbox: '{bbox-epsg-3857}',
    format: 'image/png',
    encode: false,
  });

  return layers.wms({
    id,
    tiles: [ tile ],
    tileSize: 256,
    paint,
  });
};
