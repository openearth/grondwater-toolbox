export const xmlRequestTemplate = ({
  functionId,
  requestData,
  polygon,
  filterData,
  cswUrls,
  bufferDist,
  segmentLength,
  layersSetup,
  featureCollection
}) =>
  `
  <wps:Execute xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" service="WPS" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
    <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">${ functionId }</ows:Identifier>
    <wps:DataInputs>
      ${
        requestData
          ? wpsInput(
              'waters_identifier',
              requestData.map(({ id }) => id).join(',')
            )
          : ''
      }
      ${
        requestData
          ? wpsInput('configuration', requestData.map(JSON.stringify).join(','))
          : ''
      }
      ${ polygon ? wpsInput('geojson_area', JSON.stringify(polygon)) : '' }
      ${ filterData ? wpsInput('keywords', JSON.stringify(filterData)) : '' }
      ${ cswUrls ? wpsInput('csw_url', JSON.stringify(cswUrls)) : '' }
      ${ bufferDist ? wpsInput('buffer_dist', bufferDist) : '' }
      ${ segmentLength ? wpsInput('segment_length', segmentLength) : '' }
      ${ layersSetup ? wpsInput('layers_setup', layersSetup) : '' }
      ${ featureCollection ? wpsInput('json_inputs', JSON.stringify(featureCollection)) : '' }

       
    </wps:DataInputs>
    <wps:ResponseForm>
      <wps:RawDataOutput mimeType="application/json">
        <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">output_json</ows:Identifier>
      </wps:RawDataOutput>
      </wps:ResponseForm>
    </wps:Execute>
`;

function wpsInput(identifier, data) {
  return `
    <wps:Input>
      <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">${ identifier }</ows:Identifier>
      <ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">${ identifier }</ows:Title>
      <wps:Data>
        <wps:LiteralData>${ data }</wps:LiteralData>
      </wps:Data>
    </wps:Input>
  `;
}
