import { IParamBuilder } from "@esri/arcgis-rest-request";
/**
 * `SearchQueryBuilder` can be used to construct the `q` param for {@linkcode searchItems} or {@linkcode searchGroups}.
 *
 * By chaining methods, it helps build complex search queries.
 *
 * ```js
 * const startDate = new Date("2020-01-01");
 * const endDate = new Date("2020-09-01");
 * const query = new SearchQueryBuilder()
 *  .match("Patrick")
 *  .in("owner")
 *  .and()
 *  .from(startDate)
 *  .to(endDate)
 *  .in("created")
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
 * "owner: Patrick AND created:[1577836800000 TO 1598918400000] AND (type:"Web Mapping Application" OR type:"Mobile Application" OR type:Application) AND Demo App"
 * ```
 */
export declare class SearchQueryBuilder implements IParamBuilder {
    private termStack;
    private rangeStack;
    private q;
    private openGroups;
    private currentModifer;
    /**
     * @param q An existing query string to start building from.
     */
    constructor(q?: string);
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
    match(this: SearchQueryBuilder, ...terms: string[]): SearchQueryBuilder;
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
    in(this: SearchQueryBuilder, field?: string): SearchQueryBuilder;
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
    startGroup(this: SearchQueryBuilder): SearchQueryBuilder;
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
    endGroup(this: SearchQueryBuilder): SearchQueryBuilder;
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
    and(this: SearchQueryBuilder): SearchQueryBuilder;
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
    or(this: SearchQueryBuilder): SearchQueryBuilder;
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
    not(this: SearchQueryBuilder): SearchQueryBuilder;
    /**
     * Begins a new range query.
     *
     * ```js
     *
     * const NEWYEARS = new Date("2020-01-01")
     * const TODAY = new Date()
     *
     * const query = new SearchQueryBuilder()
     *   .from(NEWYEARS)
     *   .to(TODAY)
     *   .in("created")
     * ```
     */
    from(this: SearchQueryBuilder, term: number | string | Date): SearchQueryBuilder;
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
    to(this: SearchQueryBuilder, term: any): SearchQueryBuilder;
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
    boost(this: SearchQueryBuilder, num: number): SearchQueryBuilder;
    /**
     * Returns the current query string. Called internally when the request is made.
     */
    toParam(): string;
    /**
     * Returns a new instance of `SearchQueryBuilder` based on the current instance.
     */
    clone(): SearchQueryBuilder;
    private addModifier;
    private hasWhiteSpace;
    private formatTerm;
    private commit;
    private get hasTerms();
    private get hasRange();
    private cleanup;
}
