import { IParamBuilder, warn } from "@esri/arcgis-rest-request";
export class SearchQueryBuilder implements IParamBuilder {
  private termStack: any[] = [];
  private rangeStack: any[] = [];
  private q: string;
  private openGroups = 0;
  private currentModifer: string;

  constructor(q = "") {
    this.q = q;
  }

  public match(this: SearchQueryBuilder, ...terms: string[]) {
    this.termStack = this.termStack.concat(terms);
    return this;
  }

  public in(this: SearchQueryBuilder, field?: string) {
    const fn = `\`in(${field ? `"${field}"` : ""})\``;

    if (!this.hasRange && !this.hasTerms) {
      warn(
        `${fn} was called with no call to \`match(...)\` or \`from(...)\`/\`to(...)\`. Your query was not modified.`
      );
      return this;
    }

    if (field && field !== "*") {
      this.q += `${field}:`;
    }

    return this.commit();
  }

  public startGroup(this: SearchQueryBuilder) {
    this.commit();
    if (this.openGroups > 0) {
      this.q += " ";
    }
    this.openGroups++;
    this.q += "(";
    return this;
  }

  public endGroup(this: SearchQueryBuilder) {
    if (this.openGroups <= 0) {
      warn(
        `\`endGroup(...)\` was called without calling \`startGroup(...)\` first. Your query was not modified.`
      );
      return this;
    }
    this.commit();
    this.openGroups--;
    this.q += ")";
    return this;
  }

  public and(this: SearchQueryBuilder) {
    return this.addModifier("and");
  }

  public or(this: SearchQueryBuilder) {
    return this.addModifier("or");
  }

  public not(this: SearchQueryBuilder) {
    return this.addModifier("not");
  }

  public from(this: SearchQueryBuilder, term: number | string | Date) {
    if (this.hasTerms) {
      warn(
        `\`from(...)\` is not allowed after \`match(...)\` try using \`.from(...).to(...).in(...)\`. Your query was not modified.`
      );
      return this;
    }
    this.rangeStack[0] = term;
    return this;
  }

  public to(this: SearchQueryBuilder, term: any) {
    if (this.hasTerms) {
      warn(
        `\`to(...)\` is not allowed after \`match(...)\` try using \`.from(...).to(...).in(...)\`. Your query was not modified.`
      );
      return this;
    }
    this.rangeStack[1] = term;
    return this;
  }

  public boost(this: SearchQueryBuilder, num: number) {
    this.commit();
    this.q += `^${num}`;
    return this;
  }

  public toParam() {
    this.commit();
    this.cleanup();
    return this.q;
  }

  public clone() {
    this.commit();
    this.cleanup();
    return new SearchQueryBuilder(this.q + "");
  }

  private addModifier(modifier: string) {
    if (this.currentModifer) {
      warn(
        `You have called \`${this.currentModifer}()\` after \`${modifier}()\`. Your current query was not modified.`
      );
      return this;
    }

    this.commit();

    if (this.q === "" && modifier !== "not") {
      warn(
        `You have called \`${modifier}()\` without calling another method to modify your query first. Try calling \`match()\` first.`
      );
      return this;
    }

    this.currentModifer = modifier;
    this.q += this.q === "" ? "" : " ";
    this.q += `${modifier.toUpperCase()} `;
    return this;
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
    this.currentModifer = undefined;
    if (this.hasRange) {
      this.q += `[${this.formatTerm(this.rangeStack[0])} TO ${this.formatTerm(
        this.rangeStack[1]
      )}]`;
      this.rangeStack = [undefined, undefined];
    }

    if (this.hasTerms) {
      this.q += this.termStack
        .map((term) => {
          return this.formatTerm(term);
        })
        .join(" ");
      this.termStack = [];
    }

    return this;
  }

  private get hasTerms() {
    return this.termStack.length > 0;
  }

  private get hasRange() {
    return this.rangeStack.length && this.rangeStack[0] && this.rangeStack[1];
  }

  private cleanup() {
    if (this.openGroups > 0) {
      warn(
        `Automatically closing ${this.openGroups} group(s). You can use \`endGroup(...)\` to remove this warning.`
      );

      while (this.openGroups > 0) {
        this.q += ")";
        this.openGroups--;
      }
    }

    const oldQ = this.q;
    this.q = oldQ.replace(/( AND ?| NOT ?| OR ?)*$/, "");

    if (oldQ !== this.q) {
      warn(
        `\`startGroup(...)\` was called without calling \`endGroup(...)\` first. Your query was not modified.`
      );
    }

    this.q = this.q.replace(/(\(\))*/, "");
  }
}
