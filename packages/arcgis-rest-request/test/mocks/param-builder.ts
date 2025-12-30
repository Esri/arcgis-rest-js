import { IParamBuilder } from "../../src/index.js";

export class MockParamBuilder implements IParamBuilder {
  public toParam() {
    return "1=1";
  }
}
