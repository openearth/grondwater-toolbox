import { xmlRequestTemplate } from './template';

describe('Wps template', () => {
  it("should generate an XML template with roadsId", () => {
    const expected = `<wps:Execute xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" service="WPS" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
    <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">undefined</ows:Identifier>
    <wps:DataInputs>
      <wps:Input>
        <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">roads_identifier</ows:Identifier>
        <ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">roads_identifier</ows:Title>
        <wps:Data>
          <wps:LiteralData>123</wps:LiteralData>
        </wps:Data>
      </wps:Input>
    </wps:DataInputs>
    <wps:ResponseForm>
      <wps:RawDataOutput mimeType="application/json">
        <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">output_json</ows:Identifier>
      </wps:RawDataOutput>
    </wps:ResponseForm>
  </wps:Execute>`;
  
    const output = xmlRequestTemplate({
      roadsIdentifier: '123'
    });
  
    expect(expected).toBe(output);
  });

  it("should generate an XML template single input", () => {
    const expected = `<wps:Execute xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" service="WPS" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
    <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">undefined</ows:Identifier>
    <wps:DataInputs>
      <wps:Input>
        <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">roads_identifier</ows:Identifier>
        <ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">roads_identifier</ows:Title>
        <wps:Data>
          <wps:LiteralData>123</wps:LiteralData>
        </wps:Data>
      </wps:Input>
      <wps:Input>
        <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">layers_setup</ows:Identifier>
        <ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">layers_setup</ows:Title>
        <wps:Data>
          <wps:LiteralData>{"collection":1}</wps:LiteralData>
        </wps:Data>
      </wps:Input>
    </wps:DataInputs>
    <wps:ResponseForm>
      <wps:RawDataOutput mimeType="application/json">
        <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">output_json</ows:Identifier>
      </wps:RawDataOutput>
    </wps:ResponseForm>
  </wps:Execute>`;
  
    const output = xmlRequestTemplate({
      roadsIdentifier: '123',
      requestData: {
        collection: 1
      }
    });
  
    expect(expected).toBe(output);
  });
  

  it("should generate an XML template multiple inputs", () => {
    const expected = `<wps:Execute xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" service="WPS" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
    <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">undefined</ows:Identifier>
    <wps:DataInputs>
      <wps:Input>
        <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">roads_identifier</ows:Identifier>
        <ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">roads_identifier</ows:Title>
        <wps:Data>
          <wps:LiteralData>123</wps:LiteralData>
        </wps:Data>
      </wps:Input>
      <wps:Input>
        <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">layers_setup</ows:Identifier>
        <ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">layers_setup</ows:Title>
        <wps:Data>
          <wps:LiteralData>{"collection":1}</wps:LiteralData>
        </wps:Data>
      </wps:Input>
      <wps:Input>
        <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">buffer_dist</ows:Identifier>
        <ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">buffer_dist</ows:Title>
        <wps:Data>
          <wps:LiteralData>200</wps:LiteralData>
        </wps:Data>
      </wps:Input>
    </wps:DataInputs>
    <wps:ResponseForm>
      <wps:RawDataOutput mimeType="application/json">
        <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">output_json</ows:Identifier>
      </wps:RawDataOutput>
    </wps:ResponseForm>
  </wps:Execute>`;
  
    const output = xmlRequestTemplate({
      roadsIdentifier: '123',
      requestData: {
        collection: 1
      },
      bufferDist: 200
    });
  
    expect(expected).toBe(output);
  });
});