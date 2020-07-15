import { request } from "@esri/arcgis-rest-request";
import { determineOwner, IUserItemOptions } from './helpers';
import { getPortalUrl } from "../util/get-portal-url";

type ExportFormat = 'Shapefile' | 'CSV' | 'File Geodatabase' | 'Feature Collection' | 'GeoJson' | 'Scene Package' | 'KML' | 'Excel';

export interface IExportLayerInfo {
  id: number;
  where?: string;
  includeGeometry?: boolean;
  xColumnName?: string;
  yColumnName?: string;
}

export interface IExportParameters {
  layers: IExportLayerInfo[];
  targetSR?: string;
}

export interface IExportItemRequestOptions extends IUserItemOptions {
  title?: string;
  exportFormat: ExportFormat;
  exportParameters: IExportParameters;
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
 * ```js
 * import { exportItem } from "@esri/arcgis-rest-portal";
 * //
 * exportItem({
 *      id: '3daf',
 *      owner: 'geemike',
 *      exportFormat: 'CSV',
 *      exportParameters: {
 *        layers: [
 *          { id: 0 },
 *          { id: 1, where: 'POP1999 > 100000' }
 *        ]
 *      },
 *      authentication,
 *    })
 * ```
 * Exports an item from the portal. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/export-item.htm) for more information.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise<IExportItemResponse>
 */
export const exportItem = (requestOptions: IExportItemRequestOptions) : Promise<IExportItemResponse> => {
  const {
    authentication,
    id: itemId,
    title,
    exportFormat,
    exportParameters
  } = requestOptions;

  return determineOwner(requestOptions)
    .then(owner => `${getPortalUrl(requestOptions)}/content/users/${owner}/export`)
    .then(url => request(url, {
        httpMethod: 'POST',
        authentication,
        params: {
          itemId,
          title,
          exportFormat,
          exportParameters
        }
      })
    );
}
