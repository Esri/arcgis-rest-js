/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IGeocodeResponse } from "../../src/geocode.js";
import { ISuggestResponse } from "../../src/suggest.js";
import { IReverseGeocodeResponse } from "../../src/reverse.js";
import { IBulkGeocodeResponse } from "../../src/bulk.js";

export const FindAddressCandidates: any = {
  spatialReference: { wkid: 4326, latestWkid: 4326 },
  candidates: [
    {
      address: "LAX",
      location: { x: -118.40896999999995, y: 33.942510000000027 },
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
      location: { x: -118.39223999999996, y: 33.945610000000045 },
      score: 100,
      attributes: {},
      extent: {
        xmin: -118.42923999999996,
        ymin: 33.908610000000046,
        xmax: -118.35523999999995,
        ymax: 33.982610000000044
      }
    },
    {
      address: "Lax, Georgia",
      location: { x: -83.121539999999982, y: 31.473250000000064 },
      score: 100,
      attributes: {},
      extent: {
        xmin: -83.141539999999978,
        ymin: 31.453250000000065,
        xmax: -83.101539999999986,
        ymax: 31.493250000000064
      }
    },
    {
      address: "Lax, Wallis",
      location: { x: 8.1173600000000761, y: 46.387720000000058 },
      score: 100,
      attributes: {},
      extent: {
        xmin: 8.0953600000000758,
        ymin: 46.36572000000006,
        xmax: 8.1393600000000763,
        ymax: 46.409720000000057
      }
    },
    {
      address: "LAX, Georgia",
      location: { x: -83.113229999999987, y: 31.478320000000053 },
      score: 100,
      attributes: {},
      extent: {
        xmin: -83.123229999999992,
        ymin: 31.468320000000052,
        xmax: -83.103229999999982,
        ymax: 31.488320000000055
      }
    },
    {
      address: "Lax, Mouret, Aveyron, Occitanie",
      location: { x: 2.5409300000000599, y: 44.507390000000044 },
      score: 100,
      attributes: {},
      extent: {
        xmin: 2.5309300000000601,
        ymin: 44.497390000000046,
        xmax: 2.5509300000000596,
        ymax: 44.517390000000042
      }
    },
    {
      address: "Lax, Saint-Hippolyte, Aveyron, Occitanie",
      location: { x: 2.604370000000074, y: 44.723100000000045 },
      score: 100,
      attributes: {},
      extent: {
        xmin: 2.5943700000000742,
        ymin: 44.713100000000047,
        xmax: 2.6143700000000738,
        ymax: 44.733100000000043
      }
    },
    {
      address: "Lax, Baraqueville, Aveyron, Occitanie",
      location: { x: 2.4934300000000462, y: 44.315860000000043 },
      score: 100,
      attributes: {},
      extent: {
        xmin: 2.4834300000000464,
        ymin: 44.305860000000045,
        xmax: 2.503430000000046,
        ymax: 44.325860000000041
      }
    },
    {
      address: "Lax",
      location: { x: 12.239340000000027, y: 48.030010000000061 },
      score: 100,
      attributes: {},
      extent: {
        xmin: 12.234340000000026,
        ymin: 48.025010000000059,
        xmax: 12.244340000000028,
        ymax: 48.035010000000064
      }
    },
    {
      address: "Lax",
      location: { x: -75.568029999999965, y: 6.180780000000027 },
      score: 100,
      attributes: {},
      extent: {
        xmin: -75.57302999999996,
        ymin: 6.1757800000000271,
        xmax: -75.563029999999969,
        ymax: 6.1857800000000269
      }
    },
    {
      address: "Lax",
      location: { x: -75.556379999999933, y: 6.1986100000000306 },
      score: 100,
      attributes: {},
      extent: {
        xmin: -75.561379999999929,
        ymin: 6.1936100000000307,
        xmax: -75.551379999999938,
        ymax: 6.2036100000000305
      }
    },
    {
      address: "Lax",
      location: { x: -75.565409999999986, y: 6.1981900000000678 },
      score: 100,
      attributes: {},
      extent: {
        xmin: -75.570409999999981,
        ymin: 6.1931900000000679,
        xmax: -75.56040999999999,
        ymax: 6.2031900000000677
      }
    },
    {
      address: "Lax",
      location: { x: -96.917359999999974, y: 19.528950000000066 },
      score: 100,
      attributes: {},
      extent: {
        xmin: -96.922359999999969,
        ymin: 19.523950000000067,
        xmax: -96.912359999999978,
        ymax: 19.533950000000065
      }
    },
    {
      address: "Lax",
      location: { x: -103.71520999999996, y: 19.256050000000073 },
      score: 100,
      attributes: {},
      extent: {
        xmin: -103.72020999999995,
        ymin: 19.251050000000074,
        xmax: -103.71020999999996,
        ymax: 19.261050000000072
      }
    },
    {
      address: "Lax",
      location: { x: 20.97431000000006, y: 42.008330000000058 },
      score: 100,
      attributes: {},
      extent: {
        xmin: 20.969310000000061,
        ymin: 42.003330000000055,
        xmax: 20.979310000000059,
        ymax: 42.01333000000006
      }
    },
    {
      address: "Lax",
      location: { x: -17.407549999999958, y: 65.967800000000068 },
      score: 100,
      attributes: {},
      extent: {
        xmin: -21.407549999999958,
        ymin: 61.967800000000068,
        xmax: -13.407549999999958,
        ymax: 69.967800000000068
      }
    },
    {
      address: "Lax",
      location: { x: -20.482389999999953, y: 64.107450000000028 },
      score: 100,
      attributes: {},
      extent: {
        xmin: -24.482389999999953,
        ymin: 60.107450000000028,
        xmax: -16.482389999999953,
        ymax: 68.107450000000028
      }
    },
    {
      address: "Lax",
      location: { x: 72.956330000000037, y: 19.170890000000043 },
      score: 100,
      attributes: {},
      extent: {
        xmin: 72.951330000000041,
        ymin: 19.165890000000044,
        xmax: 72.961330000000032,
        ymax: 19.175890000000042
      }
    }
  ]
};

export const FindAddressCandidates3857: any = {
  spatialReference: { wkid: 102100, latestWkid: 3857 },
  candidates: [
    {
      address: "LAX",
      location: { x: -13181226.245756002, y: 4021085.133528708 },
      score: 100,
      attributes: {},
      extent: {
        xmin: -13184009.233025834,
        ymin: 4017731.0054129288,
        xmax: -13178443.25848617,
        ymax: 4024440.2468070528
      }
    },
    {
      address: "LAX",
      location: { x: -13179363.870675031, y: 4021501.1140443031 },
      score: 100,
      attributes: {},
      extent: {
        xmin: -13183482.691834381,
        ymin: 4016537.1733597796,
        xmax: -13175245.049515678,
        ymax: 4026467.2129598851
      }
    },
    {
      address: "Lax, Georgia",
      location: { x: -9253047.5067527182, y: 3694363.3876446122 },
      score: 100,
      attributes: {},
      extent: {
        xmin: -9255273.8965685833,
        ymin: 3691753.2413776354,
        xmax: -9250821.116936855,
        ymax: 3696974.0917169792
      }
    },
    {
      address: "Lax, Wallis",
      location: { x: 903620.38178569567, y: 5842700.8168161009 },
      score: 100,
      attributes: {},
      extent: {
        xmin: 901171.35298824357,
        ymin: 5839151.0558100352,
        xmax: 906069.41058314766,
        ymax: 5846252.0087984027
      }
    },
    {
      address: "LAX, Georgia",
      location: { x: -9252122.4417842273, y: 3695025.1483260384 },
      score: 100,
      attributes: {},
      extent: {
        xmin: -9253235.6366921607,
        ymin: 3693719.9348085131,
        xmax: -9251009.2468762938,
        ymax: 3696330.5013301708
      }
    },
    {
      address: "Lax, Mouret, Aveyron, Occitanie",
      location: { x: 282855.03374135931, y: 5544300.6600977806 },
      score: 100,
      attributes: {},
      extent: {
        xmin: 281741.83883342659,
        ymin: 5542739.8611555723,
        xmax: 283968.22864929202,
        ymax: 5545861.726829391
      }
    },
    {
      address: "Lax, Saint-Hippolyte, Aveyron, Occitanie",
      location: { x: 289917.14223728608, y: 5578034.0781470081 },
      score: 100,
      attributes: {},
      extent: {
        xmin: 288803.94732935342,
        ymin: 5576467.4716463415,
        xmax: 291030.33714521886,
        ymax: 5579600.9554653689
      }
    },
    {
      address: "Lax, Baraqueville, Aveyron, Occitanie",
      location: { x: 277567.35792867729, y: 5514453.0687185861 },
      score: 100,
      attributes: {},
      extent: {
        xmin: 276454.16302074457,
        ymin: 5512897.3719480922,
        xmax: 278680.55283660995,
        ymax: 5516009.030624019
      }
    },
    {
      address: "Lax",
      location: { x: 1362477.0964457479, y: 6111848.8824957125 },
      score: 100,
      attributes: {},
      extent: {
        xmin: 1361920.4989917814,
        ymin: 6111016.6167508559,
        xmax: 1363033.6938997144,
        ymax: 6112681.2289920524
      }
    },
    {
      address: "Lax",
      location: { x: -8412194.6198508162, y: 689379.63465026789 },
      score: 100,
      attributes: {},
      extent: {
        xmin: -8412751.2173047829,
        ymin: 688819.78549905319,
        xmax: -8411638.0223968513,
        ymax: 689939.48909239401
      }
    },
    {
      address: "Lax",
      location: { x: -8410897.7477830723, y: 691376.09982812416 },
      score: 100,
      attributes: {},
      extent: {
        xmin: -8411454.3452370372,
        ymin: 690816.23178956239,
        xmax: -8410341.1503291074,
        ymax: 691935.97317315813
      }
    },
    {
      address: "Lax",
      location: { x: -8411902.9627849404, y: 691329.07070880022 },
      score: 100,
      attributes: {},
      extent: {
        xmin: -8412459.5602389071,
        ymin: 690769.20311578107,
        xmax: -8411346.3653309755,
        ymax: 691888.94360792264
      }
    },
    {
      address: "Lax",
      location: { x: -10788791.164228376, y: 2217311.2852158318 },
      score: 100,
      attributes: {},
      extent: {
        xmin: -10789347.761682343,
        ymin: 2216720.7229251787,
        xmax: -10788234.566774411,
        ymax: 2217901.86578603
      }
    },
    {
      address: "Lax",
      location: { x: -11545524.364717431, y: 2185104.9715203405 },
      score: 100,
      attributes: {},
      extent: {
        xmin: -11546080.962171396,
        ymin: 2184515.3984116013,
        xmax: -11544967.767263465,
        ymax: 2185694.5626025777
      }
    },
    {
      address: "Lax",
      location: { x: 2334849.5089402725, y: 5162227.3193348181 },
      score: 100,
      attributes: {},
      extent: {
        xmin: 2334292.9114863062,
        ymin: 5161478.2749526929,
        xmax: 2335406.1063942388,
        ymax: 5162976.4225926846
      }
    },
    {
      address: "Lax",
      location: { x: -1937799.6019584446, y: 9868038.655359244 },
      score: 100,
      attributes: {},
      extent: {
        xmin: -2383077.565131539,
        ymin: 8851511.6785163414,
        xmax: -1492521.6387853504,
        ymax: 11058243.401079001
      }
    },
    {
      address: "Lax",
      location: { x: -2280089.2250292334, y: 9377102.5183685143 },
      score: 100,
      attributes: {},
      extent: {
        xmin: -2725367.1882023276,
        ymin: 8423699.3995848913,
        xmax: -1834811.2618561389,
        ymax: 10479001.910809115
      }
    },
    {
      address: "Lax",
      location: { x: 8121461.5057460321, y: 2175065.8116463651 },
      score: 100,
      attributes: {},
      extent: {
        xmin: 8120904.9082920672,
        ymin: 2174476.5438052211,
        xmax: 8122018.1031999979,
        ymax: 2175655.0973659842
      }
    }
  ]
};

export const FindAddressCandidatesNullExtent: IGeocodeResponse = {
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
      attributes: {}
    },
    {
      address: "LAX",
      location: {
        x: -118.39223999999996,
        y: 33.945610000000045
      },
      score: 100,
      attributes: {}
    },
    {
      address: "Lax, Georgia",
      location: {
        x: -83.121539999999982,
        y: 31.473250000000064
      },
      score: 100,
      attributes: {}
    }
  ],
  geoJson: {
    type: "FeatureCollection",
    features: []
  }
};

export const Suggest: ISuggestResponse = {
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

export const ReverseGeocode: IReverseGeocodeResponse = {
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

export const GeocodeAddresses: IBulkGeocodeResponse = {
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
    },
    {
      address: "foo bar baz",
      score: 0,
      attributes: {} as any
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
