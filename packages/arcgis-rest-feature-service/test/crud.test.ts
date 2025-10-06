/* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, afterEach, test, expect } from "vitest";
import fetchMock from "fetch-mock";
import {
  addFeatures,
  updateFeatures,
  deleteFeatures,
  applyEdits,
  IDeleteFeaturesOptions,
  IUpdateFeaturesOptions
} from "../src/index.js";

import {
  addFeaturesResponse,
  updateFeaturesResponse,
  deleteFeaturesResponse,
  applyEditsResponse
} from "./mocks/feature.js";

const serviceUrl =
  "https://services.arcgis.com/f8b/arcgis/rest/services/Custom/FeatureServer/0";

describe("feature", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  test("should return objectId of the added feature and a truthy success", async () => {
    const requestOptions = {
      url: serviceUrl,
      features: [
        {
          geometry: {
            x: -9177311.62541634,
            y: 4247151.205222242,
            spatialReference: {
              wkid: 102100,
              latestWkid: 3857
            }
          },
          attributes: {
            Tree_ID: 102,
            Collected: 1349395200000,
            Crew: "Linden+ Forrest+ Johnny"
          }
        }
      ]
    };

    fetchMock.once("*", addFeaturesResponse);

    const response = await addFeatures(requestOptions);

    expect(fetchMock.called()).toBeTruthy();
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toBe(`${requestOptions.url}/addFeatures`);
    expect(options.body).toContain(
      "features=" +
        encodeURIComponent(
          '[{"geometry":{"x":-9177311.62541634,"y":4247151.205222242,"spatialReference":{"wkid":102100,"latestWkid":3857}},"attributes":{"Tree_ID":102,"Collected":1349395200000,"Crew":"Linden+ Forrest+ Johnny"}}]'
        )
    );
    expect(options.method).toBe("POST");
    expect(response.addResults[0].objectId).toBe(1001);
    expect(response.addResults[0].success).toBe(true);
  });

  test("should return objectId of the updated feature and a truthy success", async () => {
    const requestOptions = {
      url: serviceUrl,
      features: [
        {
          attributes: {
            OBJECTID: 1001,
            Street: "NO",
            Native: "YES"
          }
        }
      ],
      rollbackOnFailure: false,
      trueCurveClient: false
    } as IUpdateFeaturesOptions;
    fetchMock.once("*", updateFeaturesResponse);
    const response = await updateFeatures(requestOptions);
    expect(fetchMock.called()).toBeTruthy();
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toBe(`${requestOptions.url}/updateFeatures`);
    expect(options.method).toBe("POST");
    expect(options.body).toContain(
      "features=" +
        encodeURIComponent(
          '[{"attributes":{"OBJECTID":1001,"Street":"NO","Native":"YES"}}]'
        )
    );
    expect(options.body).toContain("rollbackOnFailure=false");
    expect(options.body).toContain("trueCurveClient=false");
    expect(response.updateResults[0].success).toBe(true);
  });

  test("should return objectId of the deleted feature and a truthy success", async () => {
    const requestOptions = {
      url: serviceUrl,
      objectIds: [1001],
      where: "1=1"
    } as IDeleteFeaturesOptions;
    fetchMock.once("*", deleteFeaturesResponse);
    const response = await deleteFeatures(requestOptions);
    expect(fetchMock.called()).toBeTruthy();
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toBe(`${requestOptions.url}/deleteFeatures`);
    expect(options.body).toContain("objectIds=1001");
    expect(options.body).toContain("where=1%3D1");
    expect(options.method).toBe("POST");
    expect(response.deleteResults[0].objectId).toBe(
      requestOptions.objectIds[0]
    );
    expect(response.deleteResults[0].success).toBe(true);
  });

  test("should return objectId of the added, updated or deleted feature(s) and a truthy success", async () => {
    const requestOptions = {
      url: serviceUrl,
      adds: [
        {
          geometry: {
            x: -9177311.62541634,
            y: 4247151.205222242,
            spatialReference: {
              wkid: 102100,
              latestWkid: 3857
            }
          },
          attributes: {
            Tree_ID: 102,
            Collected: 1349395200000,
            Crew: "Linden+ Forrest+ Johnny"
          }
        }
      ],
      updates: [
        {
          attributes: {
            OBJECTID: 1001,
            Crew: "Tom+ Patrick+ Dave"
          }
        }
      ],
      deletes: [455]
    };
    fetchMock.once("*", applyEditsResponse);
    const response = await applyEdits(requestOptions);
    expect(fetchMock.called()).toBeTruthy();
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toBe(`${requestOptions.url}/applyEdits`);
    expect(options.method).toBe("POST");
    expect(options.body).toContain(
      "adds=" +
        encodeURIComponent(
          '[{"geometry":{"x":-9177311.62541634,"y":4247151.205222242,"spatialReference":{"wkid":102100,"latestWkid":3857}},"attributes":{"Tree_ID":102,"Collected":1349395200000,"Crew":"Linden+ Forrest+ Johnny"}}]'
        )
    );
    expect(options.body).toContain(
      "updates=" +
        encodeURIComponent(
          '[{"attributes":{"OBJECTID":1001,"Crew":"Tom+ Patrick+ Dave"}}]'
        )
    );
    expect(options.body).toContain("deletes=455");
    expect(response.addResults[0].objectId).toBe(2156);
    expect(response.addResults[0].success).toBe(true);
    expect(response.updateResults[0].objectId).toBe(1001);
    expect(response.updateResults[0].success).toBe(true);
    expect(response.deleteResults[0].objectId).toBe(455);
    expect(response.deleteResults[0].success).toBe(true);
  });
});
