/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IPoint } from "../../arcgis-rest-common-types/src";
import { ILocation } from "../src/types/geometry";
import { isLocation, isLocationArray } from "../src/util/location";

// -117.195677,34.056383;-117.918976,33.812092
const stops: Array<[number, number]> = [
  [-117.195677, 34.056383],
  [-117.918976, 33.812092]
];

const stops3: Array<[number, number, number]> = [
  [-117.195677, 34.056383, 10.11],
  [-117.918976, 33.812092, 8.43]
];

const stopsObjectsLatLong: ILocation[] = [
  {
    lat: 34.056383,
    long: -117.195677
  },
  {
    lat: 33.812092,
    long: -117.918976
  }
];

const stopsObjectsLatLong3: ILocation[] = [
  {
    lat: 34.056383,
    long: -117.195677,
    z: 10.11
  },
  {
    lat: 33.812092,
    long: -117.918976,
    z: 8.43
  }
];

const stopsObjectsLatitudeLongitude: ILocation[] = [
  {
    latitude: 34.056383,
    longitude: -117.195677
  },
  {
    latitude: 33.812092,
    longitude: -117.918976
  }
];

const stopsObjectsLatitudeLongitude3: ILocation[] = [
  {
    latitude: 34.056383,
    longitude: -117.195677,
    z: 10.11
  },
  {
    latitude: 33.812092,
    longitude: -117.918976,
    z: 8.43
  }
];

const stopsObjectsPoint: IPoint[] = [
  {
    x: 34.056383,
    y: -117.195677
  },
  {
    x: 33.812092,
    y: -117.918976
  }
];

const stopsObjectsPoint3: IPoint[] = [
  {
    x: 34.056383,
    y: -117.195677,
    z: 10.11
  },
  {
    x: 33.812092,
    y: -117.918976,
    z: 8.43
  }
];

describe("location helpers", () => {
  it("should recognize a shorthand location", done => {
    expect(isLocation(stopsObjectsLatLong[0])).toEqual(true);
    done();
  });

  it("should recognize a shorthand 3d location", done => {
    expect(isLocation(stopsObjectsLatLong3[0])).toEqual(true);
    done();
  });

  it("should recognize a spelled out location", done => {
    expect(isLocation(stopsObjectsLatitudeLongitude[0])).toEqual(true);
    done();
  });

  it("should recognize a spelled out 3d location", done => {
    expect(isLocation(stopsObjectsLatitudeLongitude[0])).toEqual(true);
    done();
  });

  it("should recognize that a point is not a location", done => {
    expect(isLocation(stopsObjectsPoint[0])).toEqual(false);
    done();
  });

  it("should recognize that a 3d point is not a location", done => {
    expect(isLocation(stopsObjectsPoint3[0])).toEqual(false);
    done();
  });

  it("should recognize that raw coordinates are not a location", done => {
    expect(isLocation(stops[0])).toEqual(false);
    done();
  });

  it("should recognize that raw 3d coordinates are not a location", done => {
    expect(isLocation(stops3[0])).toEqual(false);
    done();
  });

  it("should recognize a location array", done => {
    expect(isLocationArray(stops[0])).toEqual(true);
    expect(isLocationArray(stops[1])).toEqual(true);
    done();
  });

  it("should recognize a 3d location array", done => {
    expect(isLocationArray(stops3[0])).toEqual(true);
    expect(isLocationArray(stops3[1])).toEqual(true);
    done();
  });
});
