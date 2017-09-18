import * as fetchMock from "fetch-mock";
import { generateToken } from "../src/index";
import { TOMORROW } from "./utils";

const TOKEN_URL = "https://www.arcgis.com/sharing/rest/generateToken";

describe("generateToken()", () => {
  let paramsSpy: jasmine.Spy;

  beforeEach(() => {
    paramsSpy = spyOn(FormData.prototype, "append").and.callThrough();
  });

  afterAll(() => {
    paramsSpy.calls.reset();
  });

  afterEach(fetchMock.restore);

  it("should generate a token for a username and password", done => {
    fetchMock.postOnce(TOKEN_URL, {
      token: "token",
      expires: TOMORROW.getTime()
    });

    generateToken(TOKEN_URL, {
      username: "Casey",
      password: "Jones"
    })
      .then(response => {
        const [url]: [string, RequestInit] = fetchMock.lastCall(TOKEN_URL);
        expect(url).toEqual(TOKEN_URL);
        expect(paramsSpy).toHaveBeenCalledWith("f", "json");
        expect(paramsSpy).toHaveBeenCalledWith("username", "Casey");
        expect(paramsSpy).toHaveBeenCalledWith("password", "Jones");
        expect(response.token).toEqual("token");
        expect(response.expires).toEqual(TOMORROW.getTime());
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});
