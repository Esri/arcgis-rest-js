export const GPEndpointCall = {
  url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/submitJob",
  params: {
    Query: `"DATE" > date '1998-01-01 00:00:00' AND "DATE" < date '1998-01-31 00:00:00') AND ("Day" = 'SUN' OR "Day"= 'SAT')
  `
  },
  startMonitoring: true,
  pollingRate: 5000
};

export const GPJobIdResponse = {
  jobId: "j4fa1db2338f042a19eb68856afabc27e",
  jobStatus: "esriJobSubmitted"
};

export const GPJobInfoFailure = {
  jobId: "j4fa1db2338f042a19eb68856afabc27e",
  jobStatus: "error",
  messages: [{ description: "error" }]
};

export const GPJobInfoWithResults = {
  jobId: "j4fa1db2338f042a19eb68856afabc27e",
  jobStatus: "esriJobSucceeded",
  results: {
    Hotspot_Raster: {
      paramUrl: "results/hotspot_raster"
    },
    Output_Features: {
      paramUrl: "results/output_features"
    }
  }
};

export const failedState = {
  jobStatus: "esriJobFailed",
  jobId: "FAILED_JOB_ID",
  message: [
    {
      description: "Failed"
    }
  ],
  statusCode: 400
};

export const mockCancelledState = {
  jobId: "j4fa1db2338f042a19eb68856afabc27e",
  jobStatus: "esriJobCancelled",
  messages: [
    {
      type: "esriJobMessageTypeInformative",
      description: "Submitted."
    },
    {
      type: "esriJobMessageTypeInformative",
      description: "Cancel complete."
    }
  ]
};
export const mockHotspot_Raster = {
  paramUrl: "results/hotspot_raster",
  distance: "123",
  item: "123"
};

export const mockAllResults = {
  jobStatus: "esriJobSucceeded",
  jobId: "j4fa1db2338f042a19eb68856afabc27e",
  results: {
    out_unassigned_stops: { paramUrl: "results/out_unassigned_stops" },
    out_stops: { paramUrl: "results/out_stops" },
    out_routes: { paramUrl: "results/out_routes" }
  }
};
export const mockAllResultsRequest = {
  out_unassigned_stops: {
    paramName: "out_unassigned_stops",
    dataType: "GPRecordSet",
    value: {
      displayFieldName: "",
      fields: [] as any,
      features: [] as any,
      exceededTransferLimit: false
    }
  },
  out_stops: {
    paramName: "out_stops",
    dataType: "GPRecordSet",
    value: {
      displayFieldName: "",
      fields: [] as any,
      features: [] as any,
      exceededTransferLimit: false
    }
  },
  out_routes: {
    paramName: "out_routes",
    dataType: "GPFeatureRecordSetLayer",
    value: {
      displayFieldName: "",
      geometryType: "esriGeometryPolyline",
      spatialReference: [] as any,
      fields: [] as any,
      features: [] as any,
      exceededTransferLimit: false
    }
  }
};
