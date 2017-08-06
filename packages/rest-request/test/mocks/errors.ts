export const ArcGISOnlineError = {
  error: {
    code: 403,
    messageCode: "GWM_0003",
    message:
      "You do not have permissions to access this resource or perform this operation.",
    details: []
  }
};

export const ArcGISOnlineErrorNoMessageCode = {
  error: {
    code: 403,
    message:
      "You do not have permissions to access this resource or perform this operation.",
    details: []
  }
};

export const ArcGISOnlineErrorNoCode = {
  error: {
    message:
      "You do not have permissions to access this resource or perform this operation.",
    details: []
  }
};

export const BillingError = {
  code: 500,
  message: "Error getting subscription info",
  status: "failure",
  details: null
};

export const TaskErrorWithJSON = {
  status: "failed",
  statusMessage:
    '{"code":400,"message":"Index was outside the bounds of the array."}'
};

export const TaskError = {
  status: "failed",
  statusMessage: "failed"
};
