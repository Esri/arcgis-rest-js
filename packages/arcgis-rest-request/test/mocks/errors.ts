/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

export const ArcGISOnlineError: any = {
  error: {
    code: 400,
    message: "'type' and 'title' property required.",
    details: []
  }
};

export const ArcGISOnlineAuthError: any = {
  error: {
    code: 498,
    message: "Invalid token.",
    details: []
  }
};

export const ArcGISOnlineErrorNoMessageCode: any = {
  error: {
    code: 403,
    message:
      "You do not have permissions to access this resource or perform this operation.",
    details: []
  }
};

export const ArcGISOnlineErrorNoCode: any = {
  error: {
    message:
      "You do not have permissions to access this resource or perform this operation.",
    details: []
  }
};

export const ArcGISServerTokenRequired: any = {
  error: {
    code: 499,
    message: "Token Required",
    messageCode: "GWM_0003",
    details: ["Token Required"]
  }
};

export const BillingError: any = {
  code: 500,
  message: "Error getting subscription info",
  status: "failure",
  details: null as any
};

export const BillingErrorWithCode200: any = {
  code: 200,
  message: null,
  status: "failure"
};

export const TaskErrorWithJSON: any = {
  status: "failed",
  statusMessage:
    '{"code":400,"message":"Index was outside the bounds of the array."}'
};

export const TaskError: any = {
  status: "failed",
  statusMessage: "failed"
};
