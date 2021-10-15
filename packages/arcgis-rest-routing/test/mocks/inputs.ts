/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  IPoint,
  IFeatureSet,
  IPolyline,
  IPolygon,
} from "@esri/arcgis-rest-request";

export const barriers: IPoint[] = [
  { x: -117.1957, y: 34.0564 },
  { x: -117.184, y: 34.0546 },
];

export const barriersFeatureSet: IFeatureSet = {
  features: [
    {
      geometry: {
        x: -117.1957,
        y: 34.0564,
        spatialReference: {
          wkid: 4326,
        },
      } as IPoint,
      attributes: {
        Name: "Point barrier 1",
      },
    },
    {
      geometry: {
        x: -117.184,
        y: 34.0546,
        spatialReference: {
          wkid: 4326,
        },
      } as IPoint,
      attributes: {
        Name: "Point barrier 2",
      },
    },
  ],
};

export const polylineBarriers: IFeatureSet = {
  features: [
    {
      geometry: {
        paths: [
          [
            [-10804823.397, 3873688.372],
            [-10804811.152, 3873025.945],
          ],
        ],
        spatialReference: {
          wkid: 102100,
        },
      } as IPolyline,
      attributes: {
        Name: "Barrier 1",
      },
    },
    {
      geometry: {
        paths: [
          [
            [-10804823.397, 3873688.372],
            [-10804807.813, 3873290.911],
            [-10804811.152, 3873025.945],
          ],
          [
            [-10805032.678, 3863358.76],
            [-10805001.508, 3862829.281],
          ],
        ],
        spatialReference: {
          wkid: 102100,
        },
      } as IPolyline,
      attributes: {
        Name: "Barrier 2",
      },
    },
  ],
};

export const polygonBarriers: IFeatureSet = {
  features: [
    {
      geometry: {
        rings: [
          [
            [-97.0634, 32.8442],
            [-97.0554, 32.84],
            [-97.0558, 32.8327],
            [-97.0638, 32.83],
            [-97.0634, 32.8442],
          ],
        ],
      } as IPolygon,
      attributes: {
        Name: "Flood zone",
        BarrierType: 0,
      },
    },
    {
      geometry: {
        rings: [
          [
            [-97.0803, 32.8235],
            [-97.0776, 32.8277],
            [-97.074, 32.8254],
            [-97.0767, 32.8227],
            [-97.0803, 32.8235],
          ],
          [
            [-97.0871, 32.8311],
            [-97.0831, 32.8292],
            [-97.0853, 32.8259],
            [-97.0892, 32.8279],
            [-97.0871, 32.8311],
          ],
        ],
      } as IPolygon,
      attributes: {
        Name: "Severe weather zone",
        BarrierType: 1,
        Attr_TravelTime: 3,
      },
    },
  ],
};
