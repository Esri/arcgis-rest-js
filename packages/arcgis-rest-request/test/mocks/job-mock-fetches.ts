export const GPEndpointCall = {
  url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/submitJob",
  params: {
    Query: `"DATE" > date '1998-01-01 00:00:00' AND "DATE" < date '1998-01-31 00:00:00') AND ("Day" = 'SUN' OR "Day"= 'SAT')
  `
  },
  startMonitoring: false,
  pollingRate: 5000
};

export const GPJobIdResponse = {
  jobId: "j4fa1db2338f042a19eb68856afabc27e",
  jobStatus: "esriJobSubmitted"
};

export const GPJobInfoWithResults = {
  jobId: "j4fa1db2338f042a19eb68856afabc27e",
  jobStatus: "esriJobSucceeded",
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

const GPServiceAreasCall = {
  url: "https://logistics.arcgis.com/arcgis/rest/services/World/ServiceAreas/GPServer/GenerateServiceAreas/submitJob",
  params: {
    facilities: "117.133163,34.022445",
    defaultBreaks: "2.5",
    travelDirection: "esriNATravelDirectionToFacility",
    travelMode: {
      attributeParameterValues: [
        {
          attributeName: "Avoid Private Roads",
          parameterName: "Restriction Usage",
          value: "AVOID_MEDIUM"
        },
        {
          attributeName: "Walking",
          parameterName: "Restriction Usage",
          value: "PROHIBITED"
        },
        {
          attributeName: "Preferred for Pedestrians",
          parameterName: "Restriction Usage",
          value: "PREFER_LOW"
        },
        {
          attributeName: "WalkTime",
          parameterName: "Walking Speed (km/h)",
          value: 5
        },
        {
          attributeName: "Avoid Roads Unsuitable for Pedestrians",
          parameterName: "Restriction Usage",
          value: "AVOID_HIGH"
        }
      ],
      description:
        "Follows paths and roads that allow pedestrian traffic and finds solutions that optimize travel distance.",
      distanceAttributeName: "Kilometers",
      id: "yFuMFwIYblqKEefX",
      impedanceAttributeName: "Kilometers",
      name: "Walking Distance",
      restrictionAttributeNames: [
        "Avoid Private Roads",
        "Avoid Roads Unsuitable for Pedestrians",
        "Preferred for Pedestrians",
        "Walking"
      ],
      simplificationTolerance: 2,
      simplificationToleranceUnits: "esriMeters",
      timeAttributeName: "WalkTime",
      type: "WALK",
      useHierarchy: false,
      uturnAtJunctions: "esriNFSBAllowBacktrack"
    }
  }
};
