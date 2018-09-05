/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

export const WebMapAsText =
  '{"operationalLayers":[{"id":"Alternative_Fueling_Stations_3694","layerType":"ArcGISFeatureLayer","url":"http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Alternative_Fueling_Stations/FeatureServer/0","visibility":true,"opacity":1,"title":"Alternative Fueling Stations","itemId":"44612e6217d34f40b1ce2a48f367e90a","layerDefinition":{"minScale":2896791,"maxScale":0}}],"baseMap":{"baseMapLayers":[{"id":"VectorTile_4047","type":"VectorTileLayer","layerType":"VectorTileLayer","title":"Dark Gray Canvas","styleUrl":"http://www.arcgis.com/sharing/rest/content/items/5ad3948260a147a993ef4865e3fad476/resources/styles/root.json","itemId":"5ad3948260a147a993ef4865e3fad476","visibility":true,"opacity":1}],"title":"Basemap"},"spatialReference":{"wkid":102100,"latestWkid":3857},"authoringApp":"WebMapViewer","authoringAppVersion":"5.1","version":"2.8"}';

export const WebMapAsJSON = {
  operationalLayers: [
    {
      id: "Alternative_Fueling_Stations_3694",
      layerType: "ArcGISFeatureLayer",
      url:
        "http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Alternative_Fueling_Stations/FeatureServer/0",
      visibility: true,
      opacity: 1,
      title: "Alternative Fueling Stations",
      itemId: "44612e6217d34f40b1ce2a48f367e90a",
      layerDefinition: { minScale: 2896791, maxScale: 0 }
    }
  ],
  baseMap: {
    baseMapLayers: [
      {
        id: "VectorTile_4047",
        type: "VectorTileLayer",
        layerType: "VectorTileLayer",
        title: "Dark Gray Canvas",
        styleUrl:
          "http://www.arcgis.com/sharing/rest/content/items/5ad3948260a147a993ef4865e3fad476/resources/styles/root.json",
        itemId: "5ad3948260a147a993ef4865e3fad476",
        visibility: true,
        opacity: 1
      }
    ],
    title: "Basemap"
  },
  spatialReference: { wkid: 102100, latestWkid: 3857 },
  authoringApp: "WebMapViewer",
  authoringAppVersion: "5.1",
  version: "2.8"
};
