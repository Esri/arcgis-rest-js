/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

/**
 * Method used internally to surface messages to developers.
 */
export function warn(message: string) {
  if (console && console.warn) {
    console.warn.apply(console, [message]);
  }
}
