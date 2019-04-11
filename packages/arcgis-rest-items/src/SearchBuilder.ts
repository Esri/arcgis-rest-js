import { IParamBuilder } from "@esri/arcgis-rest-request";

export class SearchQueryBuilder implements IParamBuilder {
  private termStack: any[] = [];
  private rangeStack: any[] = [];
  private q: string;

  constructor(q: string = "") {
    this.q = q;
  }

  public match(...terms: any[]) {
    this.termStack = this.termStack.concat(terms);
    return this;
  }

  public in(field: string) {
    if (field && field !== "*") {
      this.q += `${field}: `;
    }
    this.commit();
    return this;
  }

  public startGroup() {
    this.commit();
    this.q += "(";
    return this;
  }

  public endGroup() {
    this.q += ")";
    return this;
  }

  public and() {
    this.commit();
    this.q += " AND ";
    return this;
  }

  public or() {
    this.commit();
    this.q += " OR ";
    return this;
  }

  public not() {
    this.commit();
    this.q += " NOT ";
    return this;
  }

  public from(term: any) {
    this.rangeStack[0] = term;
    return this;
  }

  public to(term: any) {
    this.rangeStack[1] = term;
    return this;
  }

  public boost(num: number) {
    this.commit();
    this.q += "^${num}";
    return this;
  }

  public toParam() {
    return this.q;
  }

  public clone() {
    return new SearchQueryBuilder(this.q + "");
  }

  private hasWhiteSpace(s: string) {
    return /\s/g.test(s);
  }

  private formatTerm(term: any) {
    if (term instanceof Date) {
      return term.getTime();
    }

    if (typeof term === "string" && this.hasWhiteSpace(term)) {
      return `"${term}"`;
    }

    return term;
  }

  private commit() {
    if (this.rangeStack.length && this.rangeStack[0] && this.rangeStack[1]) {
      this.q += `[${this.formatTerm(this.rangeStack[0])} TO ${this.formatTerm(
        this.rangeStack[1]
      )}]`;
      this.rangeStack = [undefined, undefined];
    }

    if (this.termStack.length) {
      this.q += this.termStack
        .map(term => {
          return term;
        })
        .join(" ");
    }

    this.termStack = [];
  }
}
