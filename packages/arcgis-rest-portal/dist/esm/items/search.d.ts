import { IItem } from "../helpers.js";
import { SearchQueryBuilder } from "../util/SearchQueryBuilder.js";
import { ISearchOptions, ISearchResult } from "../util/search.js";
/**
 * Search a portal for items. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/search.htm) for more information.
 *
 * ```js
 * import { searchItems } from "@esri/arcgis-rest-portal";
 *
 * searchItems('water')
 *   .then(response) // response.total => 355
 * ```
 *
 * @param search - A string or RequestOptions object to pass through to the endpoint.
 * @returns A Promise that will resolve with the data from the response.
 */
export declare function searchItems(search: string | ISearchOptions | SearchQueryBuilder): Promise<ISearchResult<IItem>>;
