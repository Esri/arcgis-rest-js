import { ApiKeyManager, Job, JOB_STATUSES } from "@esri/arcgis-rest-request";
import * as dotenv from 'dotenv';
const SECRET_KEY = dotenv.config().parsed?.SECRET_KEY;

Job.submitJob({
  url: "https://logistics.arcgis.com/arcgis/rest/services/World/VehicleRoutingProblem/GPServer/SolveVehicleRoutingProblem/submitJob",
  params: {
    f: "json",
    orders: {
      features: [
        {
          geometry: { x: -122.51, y: 37.7724 },
          attributes: {
            DeliveryQuantities: 1706,
            Name: "Store_1",
            ServiceTime: 25,
            TimeWindowStart1: 1608051600000,
            TimeWindowEnd1: 1608080400000,
            MaxViolationTime1: 0
          }
        },
        {
          geometry: { x: -122.4889, y: 37.7538 },
          attributes: {
            DeliveryQuantities: 1533,
            Name: "Store_2",
            ServiceTime: 23,
            TimeWindowStart1: 1608051600000,
            TimeWindowEnd1: 1608080400000,
            MaxViolationTime1: 0
          }
        },
        {
          geometry: { x: -122.4649, y: 37.7747 },
          attributes: {
            DeliveryQuantities: 1580,
            Name: "Store_3",
            ServiceTime: 24,
            TimeWindowStart1: 1608051600000,
            TimeWindowEnd1: 1608080400000,
            MaxViolationTime1: 0
          }
        },
        {
          geometry: { x: -122.4739, y: 37.7432 },
          attributes: {
            DeliveryQuantities: 1289,
            Name: "Store_4",
            ServiceTime: 20,
            TimeWindowStart1: 1608051600000,
            TimeWindowEnd1: 1608080400000,
            MaxViolationTime1: 0
          }
        },
        {
          geometry: { x: -122.4493, y: 37.7315 },
          attributes: {
            DeliveryQuantities: 1302,
            Name: "Store_5",
            ServiceTime: 21,
            TimeWindowStart1: 1608051600000,
            TimeWindowEnd1: 1608080400000,
            MaxViolationTime1: 0
          }
        },
        {
          geometry: { x: -122.4917, y: 37.6493 },
          attributes: {
            DeliveryQuantities: 1775,
            Name: "Store_6",
            ServiceTime: 26,
            TimeWindowStart1: 1608051600000,
            TimeWindowEnd1: 1608080400000,
            MaxViolationTime1: 0
          }
        },
        {
          geometry: { x: -122.4832, y: 37.7012 },
          attributes: {
            DeliveryQuantities: 1014,
            Name: "Store_7",
            ServiceTime: 17,
            TimeWindowStart1: 1608051600000,
            TimeWindowEnd1: 1608080400000,
            MaxViolationTime1: 0
          }
        },
        {
          geometry: { x: -122.5301, y: 37.8935 },
          attributes: {
            DeliveryQuantities: 1761,
            Name: "Store_8",
            ServiceTime: 26,
            TimeWindowStart1: 1608051600000,
            TimeWindowEnd1: 1608080400000,
            MaxViolationTime1: 0
          }
        },
        {
          geometry: { x: -122.2875, y: 37.8909 },
          attributes: {
            DeliveryQuantities: 1815,
            Name: "Store_9",
            ServiceTime: 27,
            TimeWindowStart1: 1608051600000,
            TimeWindowEnd1: 1608080400000,
            MaxViolationTime1: 0
          }
        }
      ]
    },
    depots: {
      features: [
        {
          geometry: { x: -122.3943, y: 37.7967 },
          attributes: {
            Name: "San Francisco",
            TimeWindowStart1: 1608048000000,
            TimeWindowEnd1: 1608080400000
          }
        }
      ]
    },
    routes: {
      features: [
        {
          attributes: {
            Name: "Truck_1",
            StartDepotName: "San Francisco",
            EndDepotName: "San Francisco",
            StartDepotServiceTime: 60,
            EarliestStartTime: 1608048000000,
            LatestStartTime: 1608048000000,
            Capacities: "15000",
            CostPerUnitTime: 0.2,
            CostPerUnitDistance: 1.5,
            MaxOrderCount: 3,
            MaxTotalTime: 360,
            MaxTotalTravelTime: 180,
            MaxTotalDistance: 100
          }
        },
        {
          attributes: {
            Name: "Truck_2",
            StartDepotName: "San Francisco",
            EndDepotName: "San Francisco",
            StartDepotServiceTime: 60,
            EarliestStartTime: 1608048000000,
            LatestStartTime: 1608048000000,
            Capacities: "15000",
            CostPerUnitTime: 0.2,
            CostPerUnitDistance: 1.5,
            MaxOrderCount: 3,
            MaxTotalTime: 360,
            MaxTotalTravelTime: 180,
            MaxTotalDistance: 100
          }
        },
        {
          attributes: {
            Name: "Truck_3",
            StartDepotName: "San Francisco",
            EndDepotName: "San Francisco",
            StartDepotServiceTime: 60,
            EarliestStartTime: 1608048000000,
            LatestStartTime: 1608048000000,
            Capacities: "15000",
            CostPerUnitTime: 0.2,
            CostPerUnitDistance: 1.5,
            MaxOrderCount: 3,
            MaxTotalTime: 360,
            MaxTotalTravelTime: 180,
            MaxTotalDistance: 100
          }
        }
      ]
    },
    time_units: "Minutes",
    distance_units: "Miles",
    travel_mode: {
      attributeParameterValues: [
        {
          attributeName: "Use Preferred Truck Routes",
          parameterName: "Restriction Usage",
          value: "PREFER_HIGH"
        },
        {
          attributeName: "Avoid Unpaved Roads",
          parameterName: "Restriction Usage",
          value: "AVOID_HIGH"
        },
        {
          attributeName: "Avoid Private Roads",
          parameterName: "Restriction Usage",
          value: "AVOID_MEDIUM"
        },
        {
          attributeName: "Driving a Truck",
          parameterName: "Restriction Usage",
          value: "PROHIBITED"
        },
        {
          attributeName: "Roads Under Construction Prohibited",
          parameterName: "Restriction Usage",
          value: "PROHIBITED"
        },
        {
          attributeName: "Avoid Gates",
          parameterName: "Restriction Usage",
          value: "AVOID_MEDIUM"
        },
        {
          attributeName: "Avoid Express Lanes",
          parameterName: "Restriction Usage",
          value: "PROHIBITED"
        },
        {
          attributeName: "Avoid Carpool Roads",
          parameterName: "Restriction Usage",
          value: "PROHIBITED"
        },
        {
          attributeName: "Avoid Truck Restricted Roads",
          parameterName: "Restriction Usage",
          value: "AVOID_HIGH"
        },
        {
          attributeName: "TruckTravelTime",
          parameterName: "Vehicle Maximum Speed (km/h)",
          value: 0
        }
      ],
      description:
        "Models basic truck travel by preferring designated truck routes, and finds solutions that optimize travel time. Routes must obey one-way roads, avoid illegal turns, and so on. When you specify a start time, dynamic travel speeds based on traffic are used where it is available, up to the legal truck speed limit.",
      distanceAttributeName: "Kilometers",
      id: "ZzzRtYcPLjXFBKwr",
      impedanceAttributeName: "TruckTravelTime",
      name: "Trucking Time",
      restrictionAttributeNames: [
        "Avoid Carpool Roads",
        "Avoid Express Lanes",
        "Avoid Gates",
        "Avoid Private Roads",
        "Avoid Truck Restricted Roads",
        "Avoid Unpaved Roads",
        "Driving a Truck",
        "Roads Under Construction Prohibited",
        "Use Preferred Truck Routes"
      ],
      simplificationTolerance: 10,
      simplificationToleranceUnits: "esriMeters",
      timeAttributeName: "TruckTravelTime",
      type: "TRUCK",
      useHierarchy: true,
      uturnAtJunctions: "esriNFSBNoBacktrack"
    },
    populate_directions: true,
    directions_language: "en",
    populate_route_lines: false,
    default_date: "1608051600000"
  },
  authentication: SECRET_KEY,
  startMonitoring: true,
  pollingRate: 10
}).then(async (job: any) => {
  job.on(JOB_STATUSES.Success, (response: any) => {
    console.log(response)
  });
  // job.getAllResults();

  // await job.getResults("solve_succeeded").then((result:any) => {
  //   console.log(result);
  // }).catch((error: any) =>{
  //   console.error(error);
  // });
  
});
