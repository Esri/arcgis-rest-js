/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

export const GetItemResourcesResponse: any = {
  total: 3,
  start: 1,
  num: 3,
  nextStart: -1,
  resources: [
    {
      resource: "image/banner.jpg"
    },
    {
      resource: "image/logo.jpg"
    },
    {
      resource: "text/desc.txt"
    }
  ]
};

export const RemoveItemResourceResponse: any = {
  success: true
};

export const UpdateItemResourceResponse: any = {
  success: true,
  itemId: "0c66beb52dff4994be67937cdadbdbf1",
  owner: "jsmith",
  folder: null
};

export const UpdateItemInfoResponse: any = {
  success: true,
  itemId: "780cd83a15a64f0ba94ea18f60bb7a84",
  owner: "dbouwman_dc",
  folder: "4cd57c08164e450a842c03f9938b9027"
};
