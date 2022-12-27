/**
 * `GroupMembership` can also be imported from the following packages:
 *
 * ```js
 * import { GroupMembership } from "@esri/arcgis-rest-portal";
 * ```
 */
export declare type GroupMembership = "owner" | "admin" | "member" | "none";
/**
 * A [Group](https://developers.arcgis.com/rest/users-groups-and-items/common-parameters.htm) that has not been created yet.
 *
 * `IGroupAdd` can also be imported from the following packages:
 *
 * ```js
 * import { IGroupAdd } from "@esri/arcgis-rest-portal";
 * ```
 */
export interface IGroupAdd {
    title: string;
    access: "private" | "org" | "public";
    owner?: string;
    tags?: string[];
    description?: string;
    phone?: string;
    sortField?: "title" | "owner" | "avgrating" | "numviews" | "created" | "modified";
    sortOrder?: "asc" | "desc";
    isViewOnly?: boolean;
    isInvitationOnly?: boolean;
    thumbnail?: string;
    autoJoin?: boolean;
    snippet?: string;
    [key: string]: any;
}
/**
 * Existing Portal [Group](https://developers.arcgis.com/rest/users-groups-and-items/group.htm).
 *
 * `IGroup` can also be imported from the following packages:
 *
 * ```js
 * import { IGroup } from "@esri/arcgis-rest-portal";
 * ```
 */
export interface IGroup extends IGroupAdd {
    id: string;
    owner: string;
    tags: string[];
    created: number;
    modified: number;
    protected: boolean;
    isInvitationOnly: boolean;
    isViewOnly: boolean;
    isOpenData?: boolean;
    isFav: boolean;
    autoJoin: boolean;
    userMembership?: {
        username?: string;
        memberType?: GroupMembership;
        applications?: number;
    };
    hasCategorySchema?: boolean;
}
