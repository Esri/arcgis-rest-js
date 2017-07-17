import { request, FormData } from '../src/request';
import * as fetchMock from 'fetch-mock';
import * as sharingRestInfo from './mocks/sharing-rest-info.json';

describe("request()", function () {
  it("should make a basic JSON request", function () {
    const paramsSpy =  spyOn(FormData.prototype, 'append');

    fetchMock.once('*', sharingRestInfo);

    request('https://www.arcgis.com/sharing/rest/info')
      .then((response) => {
        const [ url, options ]: [ string, RequestInit ] = fetchMock.lastCall('*');
        expect(url).toEqual('https://www.arcgis.com/sharing/rest/info');
        expect(options.method).toBe('POST');
        expect(paramsSpy).toHaveBeenCalledWith('f', 'json');
        expect(response).toEqual(sharingRestInfo);
      });
  });
});
