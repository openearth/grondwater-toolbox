import geoServerUrl from './geoserver-url';

const DATA_TEMPLATE = ({ area, coordinates, layer, drainage }) =>
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
          drainage,
        },
        geometry: {
          type: 'Point',
          coordinates,
        },
      },
    ],
  }, 0, false);

export default async function getDrainageData ({ area, coordinates, layer, drainage }) {
  const data = DATA_TEMPLATE({ area, coordinates, layer, drainage });
  const url = await geoServerUrl({
    url: process.env.VUE_APP_GEO_SERVER + '/wps',
    request: 'Execute',
    service: 'WPS',
    identifier: 'brl_wps_drainage',
    version: '1.0.0',
    encode: false,
    DataInputs: 'geojson_point=' + data,
  });

  return fetch(url)
    .then(response => response.text())
    .then(string => {
      const document = new window.DOMParser().parseFromString(string, 'text/xml');
      const element = document.getElementsByTagName('wps:ComplexData');
      const value = JSON.parse(element[0].childNodes[0].nodeValue);

      return value ? JSON.parse(value, null, 2) : null;
    })
    .catch(err => console.log(err));
}
