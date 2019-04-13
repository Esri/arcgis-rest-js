import { IParamsBuilder, IParams } from "../../src/index";
import { MockParamBuilder } from "./param-builder";

export class MockNestedBuilder implements IParamsBuilder {
  public toParams(): IParams {
    return { where: new MockParamBuilder(), f: "geojson" };
  }
}
