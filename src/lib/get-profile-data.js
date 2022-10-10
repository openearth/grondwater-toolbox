import geoServerUrl from './geoserver-url';

export default async function getProfileData () {
  const json = { 'type':'FeatureCollection','name':'point','crs':{ 'type':'name','properties':{ 'name':'urn:ogc:def:crs:OGC:1.3:CRS84' } },'features':[ { 'type':'Feature','properties':{ 'fid':1,'layer':3,'area':5000,'modelprofile':10000 },'geometry':{ 'type':'Point','coordinates':[ 5.78,52.145 ] } } ] };

  const url = await geoServerUrl({
    url: process.env.VUE_APP_GEO_SERVER + '/wps',
    request: 'Execute',
    service: 'WPS',
    identifier: 'brl_wps_modelprofile',
    version: '1.0.0',
    width: false,
    height: false,
    encode: false,
    'DataInputs': `geojson_point=${ JSON.stringify(json, 0, false) }`,
  });

  console.log(url);

  return fetch(url)
    .then(res => console.log(res))
    .catch(err => console.log(err));
}
