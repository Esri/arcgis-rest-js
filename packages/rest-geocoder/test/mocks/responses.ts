export const findAddressCandidatesResponse = {
  spatialReference: {
    wkid: 4326,
    latestWkid: 4326
  },
  candidates: [
    {
      address: "LAX",
      location: {
        x: -118.40896999999995,
        y: 33.942510000000027
      },
      score: 100,
      attributes: {},
      extent: {
        xmin: -118.43396999999996,
        ymin: 33.917510000000028,
        xmax: -118.38396999999995,
        ymax: 33.967510000000026
      }
    },
    {
      address: "LAX",
      location: {
        x: -118.39223999999996,
        y: 33.945610000000045
      },
      score: 100,
      attributes: {},
      extent: {
        xmin: -118.39723999999995,
        ymin: 33.940610000000042,
        xmax: -118.38723999999996,
        ymax: 33.950610000000047
      }
    },
    {
      address: "Lax, Georgia",
      location: {
        x: -83.121539999999982,
        y: 31.473250000000064
      },
      score: 100,
      attributes: {},
      extent: {
        xmin: -83.141539999999978,
        ymin: 31.453250000000065,
        xmax: -83.101539999999986,
        ymax: 31.493250000000064
      }
    }
  ]
};

export const suggestResponse = {
  suggestions: [
    {
      text: "LAX, Los Angeles, CA, USA",
      magicKey:
        "dHA9MCNsb2M9ODU0NzQzNCNsbmc9MzMjcGw9MzcyMzM5OCNsYnM9MTQ6MTQwODQ0MjY=",
      isCollection: false
    },
    {
      text: "LAX, W Century Blvd, Los Angeles, CA, 90045, USA",
      magicKey:
        "dHA9MCNsb2M9NTM2MDg5NyNsbmc9MzMjcGw9MTcyOTI5NCNsYnM9MTQ6MTQwODQ0MjY=",
      isCollection: false
    },
    {
      text: "Laxou, Meurthe-et-Moselle, Alsace-Champagne-Ardenne-Lorraine, FRA",
      magicKey:
        "dHA9MCNsb2M9MTI0NTI0ODMjbG5nPTQxI3BsPTYxMzg0NDAjbGJzPTE0OjE0NTM3NzIw",
      isCollection: false
    },
    {
      text: "Laxå, SWE",
      magicKey:
        "dHA9MCNsb2M9NDA5NTk3NTEjbG5nPTEzOCNwbD0zNzQzODEyNyNsYnM9MTQ6MTQ1Mzc4NjI=",
      isCollection: false
    },
    {
      text: "Laxmanchanda, Adilabad, Telangana, IND",
      magicKey:
        "dHA9MCNsb2M9MzExMDM2MzEjbG5nPTMzI3BsPTIyNjA1MDczI2xicz0xNDoxNDUyOTc5MA==",
      isCollection: false
    }
  ]
};

export const reverseGeocodeResponse = {
  address: {
    Match_addr: "LA Airport",
    LongLabel: "LA Airport, Los Angeles, CA, USA",
    ShortLabel: "LA Airport",
    Addr_type: "POI",
    Type: "Airport",
    PlaceName: "LA Airport",
    AddNum: "",
    Address: "",
    Block: "",
    Sector: "",
    Neighborhood: "",
    District: "",
    City: "Los Angeles",
    MetroArea: "",
    Subregion: "Los Angeles County",
    Region: "California",
    Territory: "",
    Postal: "",
    PostalExt: "",
    CountryCode: "USA"
  },
  location: {
    x: -118.40896999999995,
    y: 33.942510000000027,
    spatialReference: {
      wkid: 4326,
      latestWkid: 4326
    }
  }
};

export const metadataResponse = {
  currentVersion: 10.41,
  serviceDescription: "Sample geocoder for San Diego, California, USA",
  addressFields: [
    {
      name: "Address",
      type: "esriFieldTypeString",
      alias: "Address",
      required: false,
      length: 100
    },
    {
      name: "Neighborhood",
      type: "esriFieldTypeString",
      alias: "Neighborhood",
      required: false,
      length: 50
    },
    {
      name: "City",
      type: "esriFieldTypeString",
      alias: "City",
      required: false,
      length: 100
    },
    {
      name: "Subregion",
      type: "esriFieldTypeString",
      alias: "Subregion",
      required: false,
      length: 50
    },
    {
      name: "Region",
      type: "esriFieldTypeString",
      alias: "Region",
      required: false,
      length: 75
    },
    {
      name: "Postal",
      type: "esriFieldTypeString",
      alias: "Postal",
      required: false,
      length: 15
    },
    {
      name: "PostalExt",
      type: "esriFieldTypeString",
      alias: "PostalExt",
      required: false,
      length: 12
    },
    {
      name: "Country",
      type: "esriFieldTypeString",
      alias: "Country",
      required: false,
      length: 50
    }
  ],
  singleLineAddressField: {
    name: "SingleLine",
    type: "esriFieldTypeString",
    alias: "Single Line Input",
    required: false,
    length: 250
  },
  candidateFields: [
    {
      name: "Loc_name",
      type: "esriFieldTypeString",
      alias: "Loc_name",
      required: false,
      length: 29
    },
    {
      name: "Shape",
      type: "esriFieldTypeGeometry",
      alias: "Shape",
      required: false
    },
    {
      name: "Score",
      type: "esriFieldTypeDouble",
      alias: "Score",
      required: false
    },
    {
      name: "Match_addr",
      type: "esriFieldTypeString",
      alias: "Match_addr",
      required: false,
      length: 200
    },
    {
      name: "Side",
      type: "esriFieldTypeString",
      alias: "Side",
      required: false,
      length: 1
    },
    {
      name: "StAddr",
      type: "esriFieldTypeString",
      alias: "StAddr",
      required: false,
      length: 120
    },
    {
      name: "AddNum",
      type: "esriFieldTypeString",
      alias: "AddNum",
      required: false,
      length: 12
    },
    {
      name: "StPreDir",
      type: "esriFieldTypeString",
      alias: "StPreDir",
      required: false,
      length: 20
    },
    {
      name: "StPreType",
      type: "esriFieldTypeString",
      alias: "StPreType",
      required: false,
      length: 20
    },
    {
      name: "StName",
      type: "esriFieldTypeString",
      alias: "StName",
      required: false,
      length: 70
    },
    {
      name: "StType",
      type: "esriFieldTypeString",
      alias: "StType",
      required: false,
      length: 20
    },
    {
      name: "StDir",
      type: "esriFieldTypeString",
      alias: "StDir",
      required: false,
      length: 20
    },
    {
      name: "City",
      type: "esriFieldTypeString",
      alias: "City",
      required: false,
      length: 120
    },
    {
      name: "Region",
      type: "esriFieldTypeString",
      alias: "Region",
      required: false,
      length: 120
    },
    {
      name: "Postal",
      type: "esriFieldTypeString",
      alias: "Postal",
      required: false,
      length: 10
    },
    {
      name: "Country",
      type: "esriFieldTypeString",
      alias: "Country",
      required: false,
      length: 10
    }
  ],
  intersectionCandidateFields: [
    {
      name: "Loc_name",
      type: "esriFieldTypeString",
      alias: "Loc_name",
      required: false,
      length: 29
    },
    {
      name: "Shape",
      type: "esriFieldTypeGeometry",
      alias: "Shape",
      required: false
    },
    {
      name: "Score",
      type: "esriFieldTypeDouble",
      alias: "Score",
      required: false
    },
    {
      name: "Match_addr",
      type: "esriFieldTypeString",
      alias: "Match_addr",
      required: false,
      length: 200
    },
    {
      name: "Side",
      type: "esriFieldTypeString",
      alias: "Side",
      required: false,
      length: 1
    },
    {
      name: "StAddr",
      type: "esriFieldTypeString",
      alias: "StAddr",
      required: false,
      length: 120
    },
    {
      name: "AddNum",
      type: "esriFieldTypeString",
      alias: "AddNum",
      required: false,
      length: 12
    },
    {
      name: "StPreDir",
      type: "esriFieldTypeString",
      alias: "StPreDir",
      required: false,
      length: 20
    },
    {
      name: "StPreType",
      type: "esriFieldTypeString",
      alias: "StPreType",
      required: false,
      length: 20
    },
    {
      name: "StName",
      type: "esriFieldTypeString",
      alias: "StName",
      required: false,
      length: 70
    },
    {
      name: "StType",
      type: "esriFieldTypeString",
      alias: "StType",
      required: false,
      length: 20
    },
    {
      name: "StDir",
      type: "esriFieldTypeString",
      alias: "StDir",
      required: false,
      length: 20
    },
    {
      name: "City",
      type: "esriFieldTypeString",
      alias: "City",
      required: false,
      length: 120
    },
    {
      name: "Region",
      type: "esriFieldTypeString",
      alias: "Region",
      required: false,
      length: 120
    },
    {
      name: "Postal",
      type: "esriFieldTypeString",
      alias: "Postal",
      required: false,
      length: 10
    },
    {
      name: "Country",
      type: "esriFieldTypeString",
      alias: "Country",
      required: false,
      length: 10
    }
  ],
  spatialReference: {
    wkid: 4326,
    latestWkid: 4326
  },
  locatorProperties: {
    UICLSID: "{3D486637-6BCF-4A0C-83DB-A02D437FB8FC}",
    IntersectionConnectors: "& @ | and",
    SuggestedBatchSize: 150,
    MaxBatchSize: 1000,
    LoadBalancerTimeOut: 60,
    WriteXYCoordFields: "TRUE",
    WriteStandardizedAddressField: "FALSE",
    WriteReferenceIDField: "FALSE",
    WritePercentAlongField: "FALSE"
  },
  locators: [
    {
      name: "PointAddress"
    },
    {
      name: "StreetAddress"
    },
    {
      name: "PostalExt"
    },
    {
      name: "StreetName"
    },
    {
      name: "Postal"
    },
    {
      name: "Gazetteer"
    },
    {
      name: "AdminPlaces"
    }
  ],
  capabilities: "Geocode,ReverseGeocode,Suggest"
};
