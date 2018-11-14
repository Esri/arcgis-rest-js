/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IPoint, ILocation } from "../types/geometry";

export function isLocationArray(
  coords: ILocation | IPoint | [number, number]
): coords is [number, number] {
  return (coords as [number, number]).length === 2;
}

export function isLocation(
  coords: ILocation | IPoint | [number, number]
): coords is ILocation {
  return (
    (coords as ILocation).latitude !== undefined ||
    (coords as ILocation).lat !== undefined
  );
}
