import { IRequestOptions, IGroup, IUser } from "@esri/arcgis-rest-request";
import { IItem, IPagingParams } from "../helpers.js";
import { SearchQueryBuilder } from "./SearchQueryBuilder.js";
export interface ISearchOptions extends IRequestOptions, IPagingParams {
    /** The query string to search against. */
    q: string | SearchQueryBuilder;
    /** Field to sort by. */
    sortField?: string;
    /** Describes whether order returns in ascending or descending order. The default is ascending. */
    sortOrder?: "asc" | "desc";
    /** A comma-separated list of fields to count. The maximum count fields allowed per request is three. Supported count fields are tags, type, access, contentstatus, and categories. */
    countFields?: string;
    /** The maximum number of field values to count for each `countFields`. The default value is 10, and the maximum number allowed is 200. */
    countSize?: number;
    /** Structured filtering is accomplished by specifying a field name followed by a colon and the term you are searching for with double quotation marks. It allows the passing in of application-level filters based on the context. Use an exact keyword match of the expected value for the specified field. Partially matching the filter keyword will not return meaningful results. */
    filter?: string;
    /** A JSON array or comma-separated list of up to eight org content categories to search items. */
    categories?: string | Array<string>;
    /** A comma-separated list of up to three category terms to search for items that have matching categories. */
    categoryFilters?: string;
    [key: string]: any;
}
export interface ISearchGroupContentOptions extends ISearchOptions {
    groupId: string;
}
/**
 * Results from an item or group search.
 */
export interface ISearchResult<T extends IItem | IGroup | IUser> {
    query: string;
    total: number;
    start: number;
    num: number;
    nextStart: number;
    results: T[];
    nextPage?: () => Promise<ISearchResult<T>>;
    /**
     * Aggregations will only be present on item searches when [`fieldCounts`](https://developers.arcgis.com/rest/users-groups-and-items/search.htm#GUID-1C625F8A-4A12-45BB-B537-74C82315759A) are requested.
     */
    aggregations?: {
        counts: Array<{
            fieldName: string;
            fieldValues: Array<{
                value: any;
                count: number;
            }>;
        }>;
    };
}
