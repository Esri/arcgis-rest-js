/**
 * Test to see if we are in a Browser.
 */
export const isBrowser = new Function(
  "try {return this===window;}catch(e){ return false;}"
);
