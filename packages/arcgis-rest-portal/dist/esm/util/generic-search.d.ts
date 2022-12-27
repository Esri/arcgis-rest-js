import { IGroup, IUser } from "@esri/arcgis-rest-request";
import { IItem } from "../helpers.js";
import { SearchQueryBuilder } from "./SearchQueryBuilder.js";
import { ISearchOptions, ISearchGroupContentOptions, ISearchResult } from "../util/search.js";
export declare function genericSearch<T extends IItem | IGroup | IUser>(search: string | ISearchOptions | ISearchGroupContentOptions | SearchQueryBuilder, searchType: "item" | "group" | "groupContent" | "user"): Promise<ISearchResult<T>>;
