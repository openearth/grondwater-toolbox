import axios from 'axios';
import { xmlRequestTemplate } from './template';

export default function({ functionId, requestData, polygon, watersIdentifier, filterData, cswUrls, bufferDist, segmentLength, layersSetup, featureCollection }) {
  const template = xmlRequestTemplate({ functionId, requestData, polygon, watersIdentifier, filterData, cswUrls, bufferDist, segmentLength, layersSetup, featureCollection });

  return axios({
    method: 'post',
    url: `${ process.env.VUE_APP_GEO_SERVER }/wps`,
    data: template,
    headers: { 'Content-Type': 'application/xml' },
  })
  .then(({ data }) => {
    return typeof data === 'object'
      ? data
      : JSON.parse(data);
  });
}
