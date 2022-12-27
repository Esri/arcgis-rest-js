import { IRequestOptions, IUserRequestOptions } from "@esri/arcgis-rest-request";
/**
 * Base options interface for making authenticated requests for items.
 */
export interface IUserItemOptions extends IUserRequestOptions {
    /**
     * Unique identifier of the item.
     */
    id: string;
    /**
     * Item owner username. If not present, `authentication.username` is utilized.
     */
    owner?: string;
}
export interface IFolderIdOptions extends IUserRequestOptions {
    /**
     * Unique identifier of the folder.
     */
    folderId: string;
    /**
     * Item owner username. If not present, `authentication.username` is utilized.
     */
    owner?: string;
}
export declare type ItemRelationshipType = "APIKey2Item" | "Area2CustomPackage" | "Area2Package" | "Item2Attachment" | "Item2Report" | "Listed2Provisioned" | "Map2AppConfig" | "Map2Area" | "Map2FeatureCollection" | "Map2Service" | "MobileApp2Code" | "Service2Data" | "Service2Layer" | "Service2Route" | "Service2Service" | "Service2Style" | "Solution2Item" | "Style2Style" | "Survey2Data" | "Survey2Service" | "SurveyAddIn2Data" | "Theme2Story" | "TrackView2Map" | "WebStyle2DesktopStyle" | "WMA2Code" | "WorkforceMap2FeatureService";
/**
 * Names of methods for reading the body of a fetch response, see:
 * https://developer.mozilla.org/en-US/docs/Web/API/Body#Methods
 */
export declare type FetchReadMethodName = "arrayBuffer" | "blob" | "formData" | "json" | "text";
export interface IItemRelationshipOptions extends IRequestOptions {
    /**
     * Unique identifier of the item.
     */
    id: string;
    /**
     * The type of relationship between the two items.
     */
    relationshipType: ItemRelationshipType | ItemRelationshipType[];
    /**
     * The direction of the relationship. Either forward (from origin -> destination) or reverse (from destination -> origin).
     */
    direction?: "forward" | "reverse";
}
export interface IManageItemRelationshipOptions extends IUserRequestOptions {
    originItemId: string;
    destinationItemId: string;
    relationshipType: ItemRelationshipType;
}
export interface IItemInfoOptions extends IUserItemOptions {
    /**
     * Subfolder for added information.
     */
    folderName?: string;
    /**
     * Object to store
     */
    file: any;
}
export interface IItemResourceOptions extends IUserItemOptions {
    /**
     * New resource filename.
     */
    name?: string;
    /**
     * Folder in which to store the new resource.
     */
    prefix?: string;
    /**
     * Text input to be added as a file resource.
     */
    content?: string;
    /**
     * Controls whether access to the file resource is restricted to the owner or inherited from the sharing permissions set for the associated item.
     */
    private?: boolean;
    /**
     * Object to store
     */
    resource?: any;
}
export interface IRemoveItemResourceOptions extends IUserItemOptions {
    /**
     * Resource item to be removed. Resource prefix needs to be specified if the file resource has one.
     */
    resource?: string;
    /**
     * If true, all file resources are removed.
     */
    deleteAll?: boolean;
}
export interface ICreateUpdateItemOptions extends IUserRequestOptions {
    /**
     * The owner of the item. If this property is not present, `item.owner` will be passed, or lastly `authentication.username`.
     */
    owner?: string;
    /**
     * Id of the folder to house the item.
     */
    folderId?: string;
    /**
     * The file to be uploaded. If uploading a file, the request must be a multipart request.
     */
    file?: Blob | File;
    /**
     * The URL where the item can be downloaded. The resource will be downloaded and stored as a file type. Similar to uploading a file to be added, but instead of transferring the contents of the file, the URL of the data file is referenced and creates a file item.
     */
    dataUrl?: string;
    /**
     * The text content for the item to be submitted.
     */
    text?: string;
    /**
     * If true, the file is uploaded asynchronously. If false, the file is uploaded synchronously.
     */
    async?: boolean;
    /**
     * If true, the file is uploaded in multiple parts.
     */
    multipart?: boolean;
    /**
     * The filename being uploaded in multipart mode. Required if multipart=true.
     */
    filename?: string;
    /**
     * If true, overwrite the existing file.
     */
    overwrite?: boolean;
}
export interface IItemDataOptions extends IRequestOptions {
    /**
     * Used to request binary data.
     */
    file?: boolean;
}
export interface IItemPartOptions extends IUserItemOptions {
    /**
     * The file part to be uploaded.
     */
    file: any;
    /**
     * Part numbers can be any number from 1 to 10,000, inclusive. A part number uniquely identifies a part and also defines its position within the object being created. If you upload a new part using the same part number that was used with a previous part, the previously uploaded part is overwritten.
     */
    partNum: number;
}
export interface IUpdateItemResponse {
    success: boolean;
    id: string;
}
export interface IItemInfoResponse {
    success: boolean;
    itemId: string;
    owner: string;
    folder: string;
}
export interface IItemResourceResponse {
    success: boolean;
    itemId: string;
    owner: string;
    folder: string;
}
export interface IAddFolderResponse {
    /**
     * Success or failure of request.
     */
    success: boolean;
    /**
     * Information about created folder: its alphanumeric id, name, and owner's name.
     */
    folder: {
        id: string;
        title: string;
        username: string;
    };
}
export interface IMoveItemResponse {
    /**
     * Success or failure of request.
     */
    success: boolean;
    /**
     * Alphanumeric id of moved item.
     */
    itemId: string;
    /**
     * Name of owner of item.
     */
    owner: string;
    /**
     * Alphanumeric id of folder now housing item.
     */
    folder: string;
}
/**
 * `requestOptions.owner` is given priority, `requestOptions.item.owner` will be checked next. If neither are present, `authentication.getUserName()` will be used instead.
 */
export declare function determineOwner(requestOptions: any): Promise<string>;
/**
 * checks if the extent is a valid BBox (2 element array of coordinate pair arrays)
 * @param extent
 * @returns
 */
export declare function isBBox(extent: unknown): boolean;
/**
 * Given a Bbox, convert it to a string. Some api endpoints expect a string
 *
 * @param {BBox} extent
 * @return {*}  {string}
 */
export declare function bboxToString(extent: number[][]): string;
