import geoServerUrl from './geoserver-url';

const DATA_TEMPLATE = (selections) =>
  JSON.stringify({
    type: 'FeatureCollection',
    name: 'test_watersystem',
    crs: {
      type: 'name',
      properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
    },
    features: selections.map(({ geometry, ...properties }) => (
      {
        type: 'Feature',
        properties,
        geometry,
      })
    ),
  }, null, 0);

export default async function getSystemData (selections) {
  const data = DATA_TEMPLATE(selections);
  const url = await geoServerUrl({
    url: `${ process.env.VUE_APP_WPS_TEST }`,
    request: 'Execute',
    service: 'WPS',
    identifier: 'brl_wps_watersystem',
    version: '1.0.0',
    encode: false,
    DataInputs: 'configuration=' + data,
  });

  return fetch(url)
    .then(response => response.text())
    .then(string => {
      const document = new window.DOMParser().parseFromString(string, 'text/xml');
      const element = document.getElementsByTagName('wps:ComplexData');
      const value = JSON.parse(element[0].childNodes[0].nodeValue);
      return value ? value : null;
    
    })
    .catch(err => console.log(err));
}
