const NodeFormData = require("formdata-node");

module.exports = {
  FormData: globalThis.FormData || NodeFormData.FormData,
  File: globalThis.File || NodeFormData.File,
  Blob: globalThis.Blob || NodeFormData.Blob
};
