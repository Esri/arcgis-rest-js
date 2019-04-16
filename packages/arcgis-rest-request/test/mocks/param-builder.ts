import { IParamBuilder } from "../../src/index";

export class MockParamBuilder implements IParamBuilder {
  public toParam() {
    return "1=1";
  }
}
