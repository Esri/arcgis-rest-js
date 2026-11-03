const NodeFormData = require("formdata-node");

const exists = globalThis.FormData && globalThis.File && globalThis.Blob;

module.exports = {
  FormData: exists ? globalThis.FormData : NodeFormData.FormData,
  File: exists ? globalThis.File : NodeFormData.File,
  Blob: exists ? globalThis.Blob : NodeFormData.Blob
};
