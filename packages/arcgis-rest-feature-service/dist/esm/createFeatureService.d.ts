import { IExtent, ISpatialReference } from "@esri/arcgis-rest-request";
import { ICreateUpdateItemOptions } from "@esri/arcgis-rest-portal";
/**
 * A [`createParameters` JSON object for a new
 * service](https://developers.arcgis.com/rest/users-groups-and-items/create-service.htm).
 */
export interface ICreateServiceParams {
    /**
     * Name of the service to be created. This name must be unique. If the name already exists, the operation will fail. ArcGIS Enterprise does not allow spaces or special characters other than underscores in a service name.
     */
    name: string;
    /**
     * Description given to the service.
     */
    serviceDescription?: string;
    /**
     * Indicates whether the data changes.
     */
    hasStaticData?: boolean;
    /**
     * A double value indicating any constraints enforced on query operations.
     */
    maxRecordCount?: number;
    /**
     * The formats in which query results are returned.
     */
    supportedQueryFormats?: string;
    /**
     * Specify feature service editing capabilities for Create, Delete, Query, Update, and Sync.
     */
    capabilities?: string;
    /**
     * A user-friendly description for the published dataset.
     */
    description?: string;
    /**
     * Copyright information associated with the dataset.
     */
    copyrightText?: string;
    /**
     * All layers added to a hosted feature service need to have the same spatial reference defined for
     * the feature service. When creating a new empty service without specifying its spatial reference,
     * the spatial reference of the hosted feature service is set to the first layer added to that
     * feature service.
     */
    spatialReference?: ISpatialReference;
    /**
     * The initial extent set for the service.
     */
    initialExtent?: IExtent;
    /**
     * Indicates if updating the geometry of the service is permitted.
     */
    allowGeometryUpdates?: boolean;
    /**
     * Units used by the feature service
     */
    units?: string;
    /**
     * A JSON object specifying the properties of cross-site scripting prevention.
     */
    xssPreventionInfo?: any;
    /**
     * Editor tracking info.
     */
    editorTrackingInfo?: {
        enableEditorTracking?: boolean;
        enableOwnershipAccessControl?: boolean;
        allowOthersToUpdate?: boolean;
        allowOthersToDelete?: boolean;
        allowOthersToQuery?: boolean;
        allowAnonymousToUpdate?: boolean;
        allowAnonymousToDelete?: boolean;
    };
}
export interface ICreateServiceOptions extends ICreateUpdateItemOptions {
    /**
     * A JSON object specifying the properties of the newly-created service. See the [REST
     * Documentation](https://developers.arcgis.com/rest/users-groups-and-items/working-with-users-groups-and-items.htm)
     * for more information.
     */
    item: ICreateServiceParams;
    /**
     * Alphanumeric id of folder to house moved item. If null, empty, or "/", the destination is the
     * root folder.
     */
    folderId?: string;
}
export interface ICreateServiceResult {
    /**
     * The encoded URL to the hosted service.
     */
    encodedServiceURL: string;
    /**
     * Indicates if this feature service represents a view.
     */
    isView: boolean;
    /**
     * The unique ID for this item.
     */
    itemId: string;
    /**
     * Name of the service item.
     */
    name: string;
    /**
     * The ID of the new service item.
     */
    serviceItemId: string;
    /**
     * The URL to the hosted service.
     */
    serviceurl: string;
    /**
     * The size of the item.
     */
    size: number;
    /**
     * Indicates if the operation was successful.
     */
    success: boolean;
    /**
     * The type of service created.
     */
    type: string;
}
/**
 * Create a new [hosted feature service](https://developers.arcgis.com/rest/users-groups-and-items/create-service.htm). After the service has been created, call [`addToServiceDefinition()`](../addToServiceDefinition/) if you'd like to update it's schema.
 *
 * ```js
 * import {
 *   createFeatureService,
 *   addToServiceDefinition
 * } from '@esri/arcgis-rest-service-admin';
 * //
 * createFeatureService({
 *   authentication: ArcGISIdentityManager,
 *   item: {
 *     "name": "NewEmptyService",
 *     "capabilities": "Create,Delete,Query,Update,Editing"
 *   }
 * });
 * ```
 *
 * @param requestOptions - Options for the request. NOTE: `rawResponse` is not supported by this operation.
 * @returns A Promise that resolves with service details once the service has been created
 */
export declare function createFeatureService(requestOptions: ICreateServiceOptions): Promise<ICreateServiceResult>;
