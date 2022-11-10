import geoServerUrl from './geoserver-url';

const DATA_TEMPLATE = ({ area, coordinates, layer, abstraction }) =>
  JSON.stringify({
    type: 'FeatureCollection',
    name: 'point',
    crs: {
      type: 'name',
      properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
    },
    features: [
      {
        type: 'Feature',
        properties: {
          fid: 1,
          layer,
          area,
          abstraction,
        },
        geometry: {
          type: 'Point',
          coordinates,
        },
      },
    ],
  }, 0, false);

export default async function getAbstractionData ({ area, coordinates, layer, abstraction }) {
  console.log('getAbstractionData', { area, coordinates, layer, abstraction });
  const data = DATA_TEMPLATE({ area, coordinates, layer, abstraction });
  const url = await geoServerUrl({
    url: process.env.VUE_APP_GEO_SERVER + '/wps',
    request: 'Execute',
    service: 'WPS',
    identifier: 'brl_wps_abstraction',
    version: '1.0.0',
    encode: false,
    DataInputs: 'geojson_point=' + data,
  });

  console.log('getAbstractionData - geoServerUrl', url);

  return fetch(url)
    .then(response => response.text())
    .then(string => {
      console.log('getAbstractionData - response', string);
      const document = new window.DOMParser().parseFromString(string, 'text/xml');
      const element = document.getElementsByTagName('wps:ComplexData');
      const value = JSON.parse(element[0].childNodes[0].nodeValue);

      return value ? JSON.parse(value, null, 2) : null;
    })
    .catch(err => console.log(err));
}
