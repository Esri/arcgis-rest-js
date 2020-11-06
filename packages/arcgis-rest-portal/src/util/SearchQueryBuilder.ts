import { IParamBuilder, warn } from "@esri/arcgis-rest-request";
/**
 * `SearchQueryBuilder` can be used to construct the `q` param for [`searchItems`](/arcgis-rest-js/api/portal/searchItems#searchItems-search) or [`searchGroups`](/arcgis-rest-js/api/portal/searchGroups#searchGroups-search). By chaining methods, it helps build complex search queries.
 *
 * ```js
 * const query = new SearchQueryBuilder()
 *  .match("Patrick")
 *  .in("owner")
 *  .and()
 *  .startGroup()
 *    .match("Web Mapping Application")
 *    .in("type")
 *    .or()
 *    .match("Mobile Application")
 *    .in("type")
 *    .or()
 *    .match("Application")
 *    .in("type")
 *  .endGroup()
 *  .and()
 *  .match("Demo App");
 *
 * searchItems(query).then((res) => {
 *   console.log(res.results);
 * });
 * ```
 *
 * Will search for items matching
 * ```
 * "owner: Patrick AND (type:"Web Mapping Application" OR type:"Mobile Application" OR type:Application) AND Demo App"
 * ```
 */
export class SearchQueryBuilder implements IParamBuilder {
  private termStack: any[] = [];
  private rangeStack: any[] = [];
  private q: string;
  private openGroups = 0;
  private currentModifer: string;

  /**
   * @param q An existing query string to start building from.
   */
  constructor(q: string = "") {
    this.q = q;
  }

  /**
   * Defines strings to search for.
   *
   * ```js
   * const query = new SearchQueryBuilder()
   *   .match("My Layer")
   * ```
   *
   * @param terms strings to search for.
   */
  public match(this: SearchQueryBuilder, ...terms: string[]) {
    this.termStack = this.termStack.concat(terms);
    return this;
  }

  /**
   * Defines fields to search in. You can pass `"*"` or call this method without arguments to search a default set of fields
   *
   * ```js
   * const query = new SearchQueryBuilder()
   *   .match("My Layer")
   *   .in("title")
   * ```
   *
   * @param field The field to search for the previous match in.
   */
  public in(this: SearchQueryBuilder, field?: string) {
    const fn = `\`in(${field ? `"${field}"` : ""})\``;

    if (!this.hasRange && !this.hasTerms) {
      warn(
        // prettier-ignore
        `${fn} was called with no call to \`match(...)\` or \`from(...)\`/\`to(...)\`. Your query was not modified.`
      );
      return this;
    }

    if (field && field !== "*") {
      this.q += `${field}:`;
    }

    return this.commit();
  }

  /**
   * Starts a new search group.
   *
   * ```js
   * const query = new SearchQueryBuilder()
   *   .startGroup()
   *     .match("Lakes")
   *     .in("title")
   *   .endGroup()
   *   .or()
   *   .startGroup()
   *     .match("Rivers")
   *     .in("title")
   *   .endGroup()
   * ```
   */
  public startGroup(this: SearchQueryBuilder) {
    this.commit();
    if (this.openGroups > 0) {
      this.q += " ";
    }
    this.openGroups++;
    this.q += "(";
    return this;
  }

  /**
   * Ends a search group.
   *
   * ```js
   * const query = new SearchQueryBuilder()
   *   .startGroup()
   *     .match("Lakes")
   *     .in("title")
   *   .endGroup()
   *   .or()
   *   .startGroup()
   *     .match("Rivers")
   *     .in("title")
   *   .endGroup()
   * ```
   */
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

  /**
   * Joins two sets of queries with an `AND` clause.
   *
   * ```js
   * const query = new SearchQueryBuilder()
   *   .match("Lakes")
   *   .in("title")
   *   .and()
   *   .match("Rivers")
   *   .in("title")
   * ```
   */
  public and(this: SearchQueryBuilder) {
    return this.addModifier("and");
  }

  /**
   * Joins two sets of queries with an `OR` clause.
   *
   * ```js
   * const query = new SearchQueryBuilder()
   *   .match("Lakes")
   *   .in("title")
   *   .or()
   *   .match("Rivers")
   *   .in("title")
   * ```
   */
  public or(this: SearchQueryBuilder) {
    return this.addModifier("or");
  }

  /**
   * Joins two sets of queries with a `NOT` clause. Another option for filtering results is the [prohibit operator '-'](https://developers.arcgis.com/rest/users-groups-and-items/search-reference.htm#ESRI_SECTION1_5C6C35DB9E4A4F4492C5B937BDA2BF67).
   *
   * ```js
   * // omit results with "Rivers" in their title
   * const query = new SearchQueryBuilder()
   *   .not()
   *   .match("Rivers")
   *   .in("title")
   *
   * // equivalent
   * const query = new SearchQueryBuilder()
   *   .match("Rivers")
   *   .in("-title")
   * ```
   */
  public not(this: SearchQueryBuilder) {
    return this.addModifier("not");
  }

  /**
   * Begins a new range query.
   *
   * ```js
   * const query = new SearchQueryBuilder()
   *   .from(yesterdaysDate)
   *   .to(todaysDate)
   *   .in("created")
   * ```
   */
  public from(this: SearchQueryBuilder, term: number | string | Date) {
    if (this.hasTerms) {
      warn(
        // prettier-ignore
        `\`from(...)\` is not allowed after \`match(...)\` try using \`.from(...).to(...).in(...)\`. Your query was not modified.`
      );
      return this;
    }
    this.rangeStack[0] = term;
    return this;
  }

  /**
   * Ends a range query.
   *
   * ```js
   * const query = new SearchQueryBuilder()
   *   .from(yesterdaysDate)
   *   .to(todaysDate)
   *   .in("created")
   * ```
   */
  public to(this: SearchQueryBuilder, term: any) {
    if (this.hasTerms) {
      warn(
        // prettier-ignore
        `\`to(...)\` is not allowed after \`match(...)\` try using \`.from(...).to(...).in(...)\`. Your query was not modified.`
      );
      return this;
    }
    this.rangeStack[1] = term;
    return this;
  }

  /**
   * Boosts the previous term to increase its rank in the results.
   *
   * ```js
   * const query = new SearchQueryBuilder()
   *   .match("Lakes")
   *   .in("title")
   *   .or()
   *   .match("Rivers")
   *   .in("title")
   *   .boost(3)
   * ```
   */
  public boost(this: SearchQueryBuilder, num: number) {
    this.commit();
    this.q += `^${num}`;
    return this;
  }

  /**
   * Returns the current query string. Called internally when the request is made.
   */
  public toParam() {
    this.commit();
    this.cleanup();
    return this.q;
  }

  /**
   * Returns a new instance of `SearchQueryBuilder` based on the current instance.
   */
  public clone() {
    this.commit();
    this.cleanup();
    return new SearchQueryBuilder(this.q + "");
  }

  private addModifier(modifier: string) {
    if (this.currentModifer) {
      warn(
        // prettier-ignore
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
        .map(term => {
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
    // end a group if we have started one
    if (this.openGroups > 0) {
      warn(
        // prettier-ignore
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

    // clear empty groups
    this.q = this.q.replace(/(\(\))*/, "");
  }
}
