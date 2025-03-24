import geoServerUrl from './geoserver-url';

export default async function getFeatureInfo ({ bounds, lng, lat, x, y, width, height, layer }) {
  let bbox = null;

  // Bounding box used with area selection.
  if (bounds) {
    bbox = [
      bounds._sw.lng,
      bounds._sw.lat,
      bounds._ne.lng,
      bounds._ne.lat,
    ].join();
  }

  // Bounding box used with single point selection.
  if (lng && lat) {
    bbox = [
      (lng - 0.1),
      (lat - 0.1),
      (lng + 0.1),
      (lat + 0.1),
    ].join(',');
  }

  const url = await geoServerUrl({
    url: process.env.VUE_APP_GEOSERVER_BASE_URL +'/ows',
    request: 'GetFeatureInfo',
    service: 'WMS',
    version: '1.1.1',
    format: 'image/png',
    info_format: 'application/json',
    crs: 'EPSG:4326',
    transparent: 'true',
    feature_count: '1',
    layers: layer,
    query_layers: layer,
    width: bounds ? width : '101',
    height: bounds ? height : '101',
    x: bounds ? x : '50',
    y: bounds ? y : '50',
    bbox,
  });

  return fetch(url)
    .then(response => response.json())
    .then((data) => data.features[0])
    .then((feature) => ({
      ...feature,
      id: String(feature.properties.id),
    }))
    .catch(err => Promise.reject(err));
}
