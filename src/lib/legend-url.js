import geoserverUrl from './geoserver-url';

export default function ({ layer, url }) {
  return geoserverUrl({
    request: 'GetLegendGraphic',
    service: 'WMS',
    format: 'image/png',
    width: 40,
    height: 40,
    layer,
    url,
  });
}
