import sendWpsRequest from '@/lib/wps-template';

export default async function getSystemData (selections) {
  
const data  = {
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
  };
  

  try {
    const response = await sendWpsRequest({
      identifier: 'brl_wps_watersystem',
      inputs: [ { id: 'configuration', title: 'setup for the modelling process',
        type: 'ComplexData', mimeType: 'application/json', value: data } ],
      outputIdentifier: 'output_json',
      mimeType: 'application/json',
    });

    if (response.errMsg) {
      throw new Error(response.errMsg);
    }

    return response;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
}



