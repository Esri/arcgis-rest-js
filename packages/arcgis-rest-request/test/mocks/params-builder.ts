import { IParamsBuilder, ResponseFormats } from "../../src/index";

export class MockParamsBuilder implements IParamsBuilder {
  public toParams() {
    return { where: "1=1", f: "geojson" as ResponseFormats };
  }
}
