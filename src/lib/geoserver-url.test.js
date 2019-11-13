import geoserverUrl from './geoserver-url';

describe('Geoserver url', () => {
  it("should return nothing if request parameter is not given", () => {
    const testUrl = 'https://test.com'; 
    const url = geoserverUrl({ url: testUrl });
    expect(url).toBe(undefined);
  });
  
  it("should return a URL if request parameter is given", () => {
    const testUrl = 'https://test.com'; 
    const url = geoserverUrl({ url: testUrl, request: 'function' });
    expect(url).toBe('https://test.com?request=function&width=256&height=256');
  });
 
  it("should add rest parameter to URL", () => {
    const testUrl = 'https://test.com'; 
    const url = geoserverUrl({ url: testUrl, request: 'function', foreignParameter: 'value' });
    expect(url).toBe('https://test.com?request=function&width=256&height=256&foreignParameter=value');
  });
});