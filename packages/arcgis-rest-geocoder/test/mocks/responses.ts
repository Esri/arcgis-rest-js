/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

export const FindAddressCandidates = {
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

export const Suggest = {
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

export const ReverseGeocode = {
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

export const GeocodeAddresses = {
  spatialReference: { wkid: 4326, latestWkid: 4326 },
  locations: [
    {
      address: "380 New York St, Redlands, California, 92373",
      location: { x: -117.19567031799994, y: 34.056488119000051 },
      score: 100,
      attributes: {
        ResultID: 1,
        Loc_name: "World",
        Status: "M",
        Score: 100,
        Match_addr: "380 New York St, Redlands, California, 92373",
        LongLabel: "380 New York St, Redlands, CA, 92373, USA",
        ShortLabel: "380 New York St",
        Addr_type: "PointAddress",
        Type: "",
        PlaceName: "",
        Place_addr: "380 New York St, Redlands, California, 92373",
        Phone: "",
        URL: "",
        Rank: 20,
        AddBldg: "",
        AddNum: "380",
        AddNumFrom: "",
        AddNumTo: "",
        AddRange: "",
        Side: "R",
        StPreDir: "",
        StPreType: "",
        StName: "New York",
        StType: "St",
        StDir: "",
        BldgType: "",
        BldgName: "",
        LevelType: "",
        LevelName: "",
        UnitType: "",
        UnitName: "",
        SubAddr: "",
        StAddr: "380 New York St",
        Block: "",
        Sector: "",
        Nbrhd: "West Redlands",
        District: "",
        City: "Redlands",
        MetroArea: "Inland Empire",
        Subregion: "San Bernardino",
        Region: "California",
        RegionAbbr: "CA",
        Territory: "",
        Zone: "",
        Postal: "92373",
        PostalExt: "",
        Country: "USA",
        LangCode: "ENG",
        Distance: 0,
        X: -117.1956703176181,
        Y: 34.056488119308924,
        DisplayX: -117.1953135,
        DisplayY: 34.056108000000009,
        Xmin: -117.1963135,
        Xmax: -117.19431349999999,
        Ymin: 34.055108000000011,
        Ymax: 34.057108000000007
      }
    },
    {
      address: "1 World Way, Los Angeles, California, 90045",
      location: { x: -118.39751976799994, y: 33.944172212000069 },
      score: 100,
      attributes: {
        ResultID: 2,
        Loc_name: "World",
        Status: "M",
        Score: 100,
        Match_addr: "1 World Way, Los Angeles, California, 90045",
        LongLabel: "1 World Way, Los Angeles, CA, 90045, USA",
        ShortLabel: "1 World Way",
        Addr_type: "StreetAddress",
        Type: "",
        PlaceName: "",
        Place_addr: "1 World Way, Los Angeles, California, 90045",
        Phone: "",
        URL: "",
        Rank: 20,
        AddBldg: "",
        AddNum: "1",
        AddNumFrom: "1",
        AddNumTo: "57",
        AddRange: "1-57",
        Side: "R",
        StPreDir: "",
        StPreType: "",
        StName: "World",
        StType: "Way",
        StDir: "",
        BldgType: "",
        BldgName: "",
        LevelType: "",
        LevelName: "",
        UnitType: "",
        UnitName: "",
        SubAddr: "",
        StAddr: "1 World Way",
        Block: "",
        Sector: "",
        Nbrhd: "Westchester",
        District: "",
        City: "Los Angeles",
        MetroArea: "Los Angeles Metro Area",
        Subregion: "Los Angeles",
        Region: "California",
        RegionAbbr: "CA",
        Territory: "",
        Zone: "",
        Postal: "90045",
        PostalExt: "",
        Country: "USA",
        LangCode: "ENG",
        Distance: 0,
        X: -118.39751976816108,
        Y: 33.944172211706103,
        DisplayX: -118.39751976816108,
        DisplayY: 33.944172211706103,
        Xmin: -118.39851976816108,
        Xmax: -118.39651976816107,
        Ymin: 33.943172211706106,
        Ymax: 33.945172211706101
      }
    }
  ]
};

export const SharingInfo = {
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
