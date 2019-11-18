import axios from 'axios';
import { xmlRequestTemplate } from './template';

export default function({ functionId, requestData, polygon, roadsIdentifier, filterData, cswUrls, bufferDist, segmentLength, layersSetup }) {
  const template = xmlRequestTemplate({ functionId, requestData, polygon, roadsIdentifier, filterData, cswUrls, bufferDist, segmentLength, layersSetup });

  return axios({
    method: 'post',
    // url: 'https://ri2de.openearth.eu/wps',
    url: `${ process.env.VUE_APP_GEO_SERVER }/wps`,
    data: template,
    headers: {'Content-Type': 'application/xml'},
  })
  .then(({ data }) => {
    return typeof data === 'object'
      ? data
      : JSON.parse(data);
  });
}
