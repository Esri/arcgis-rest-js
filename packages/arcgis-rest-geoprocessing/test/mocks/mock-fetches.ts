export const GPEndpointCall = {
  url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/submitJob",
  params: {
    Query: `"DATE" > date '1998-01-01 00:00:00' AND "DATE" < date '1998-01-31 00:00:00') AND ("Day" = 'SUN' OR "Day"= 'SAT')`
  },
  didTurnMonitoringOn: true,
  pollingRate: 5000,
  isPolling: true
};

export const GPJobIdResponse = {
  jobStatus: "esriJobSubmitted",
  jobId: "j4fa1db2338f042a19eb68856afabc27e"
};

export const mockResults = {
  results: [
    {
      Hotspot_Raster: {
        paramUrl: "results/hotspot_raster"
      },
      Output_Features: {
        paramUrl: "results/output_features"
      }
    }
  ]
};

export const mockHotspot_Raster = {
  distance: "123",
  item: "123"
};
