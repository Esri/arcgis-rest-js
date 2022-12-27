import { ISpatialReference } from "@esri/arcgis-rest-request";
import { IUserItemOptions } from "./helpers.js";
declare type ExportFormat = "Shapefile" | "CSV" | "File Geodatabase" | "Feature Collection" | "GeoJson" | "Scene Package" | "KML" | "Excel";
export interface IExportLayerInfo {
    id: number;
    where?: string;
    includeGeometry?: boolean;
    xColumnName?: string;
    yColumnName?: string;
}
export interface IExportParameters {
    layers?: IExportLayerInfo[];
    targetSR?: ISpatialReference | string;
}
export interface IExportItemRequestOptions extends IUserItemOptions {
    title?: string;
    exportFormat: ExportFormat;
    exportParameters?: IExportParameters;
}
export interface IExportItemResponse {
    type: string;
    size: number;
    jobId: string;
    exportItemId: string;
    serviceItemId: string;
    exportFormat: ExportFormat;
}
/**
 * Exports an item from the portal. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/export-item.htm) for more information.
 *
 * ```js
 * import { exportItem } from "@esri/arcgis-rest-portal";
 *
 * exportItem({
 *   id: '3daf',
 *   owner: 'geemike',
 *   exportFormat: 'CSV',
 *   exportParameters: {
 *     layers: [
 *       { id: 0 },
 *       { id: 1, where: 'POP1999 > 100000' }
 *     ]
 *   },
 *   authentication,
 * })
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise<IExportItemResponse>
 */
export declare const exportItem: (requestOptions: IExportItemRequestOptions) => Promise<IExportItemResponse>;
export {};
