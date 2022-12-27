"use strict";
/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.genericSearch = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const SearchQueryBuilder_js_1 = require("./SearchQueryBuilder.js");
const get_portal_url_js_1 = require("../util/get-portal-url.js");
function genericSearch(search, searchType) {
    let options;
    if (typeof search === "string" || search instanceof SearchQueryBuilder_js_1.SearchQueryBuilder) {
        options = {
            httpMethod: "GET",
            params: {
                q: search
            }
        };
    }
    else {
        // searchUserAccess has one (known) valid value: "groupMember"
        options = (0, arcgis_rest_request_1.appendCustomParams)(search, [
            "q",
            "num",
            "start",
            "sortField",
            "sortOrder",
            "searchUserAccess",
            "searchUserName",
            "filter",
            "countFields",
            "countSize",
            "categories",
            "categoryFilters"
        ], {
            httpMethod: "GET"
        });
    }
    let path;
    switch (searchType) {
        case "item":
            path = "/search";
            break;
        case "group":
            path = "/community/groups";
            break;
        case "groupContent":
            // Need to have groupId property to do group contents search,
            // cso filter out all but ISearchGroupContentOptions
            if (typeof search !== "string" &&
                !(search instanceof SearchQueryBuilder_js_1.SearchQueryBuilder) &&
                search.groupId) {
                path = `/content/groups/${search.groupId}/search`;
            }
            else {
                return Promise.reject(new Error("you must pass a `groupId` option to `searchGroupContent`"));
            }
            break;
        default:
            // "users"
            path = "/portals/self/users/search";
            break;
    }
    const url = (0, get_portal_url_js_1.getPortalUrl)(options) + path;
    // send the request
    return (0, arcgis_rest_request_1.request)(url, options).then((r) => {
        if (r.nextStart && r.nextStart !== -1) {
            r.nextPage = function () {
                let newOptions;
                if (typeof search === "string" ||
                    search instanceof SearchQueryBuilder_js_1.SearchQueryBuilder) {
                    newOptions = {
                        q: search,
                        start: r.nextStart
                    };
                }
                else {
                    newOptions = search;
                    newOptions.start = r.nextStart;
                }
                return genericSearch(newOptions, searchType);
            };
        }
        return r;
    });
}
exports.genericSearch = genericSearch;
//# sourceMappingURL=generic-search.js.map