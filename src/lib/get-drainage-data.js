import geoServerUrl from './geoserver-url';

const DATA_TEMPLATE = ({ name, features }) =>
  JSON.stringify({
    type: 'FeatureCollection',
    name,
    crs: {
      type: 'name',
      properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
    },
    features: features.map(({  properties, geometry } ) => ({
        type: 'Feature',
        properties,
        geometry,
      })),
  }, 0, false);

export default async function getDrainageData (featureCollection) {
  const data = DATA_TEMPLATE(featureCollection);
  const url = await geoServerUrl({
    url: `${ process.env.VUE_APP_WPS_TEST }`, 
    width: 0,
    height: 0,
    request: 'Execute',
    service: 'WPS',
    identifier: 'brl_wps_drainage',
    version: '1.0.0',
    encode: false,
    DataInputs: 'json_inputs=' + data,
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
