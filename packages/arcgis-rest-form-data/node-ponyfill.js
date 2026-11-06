const NodeFormData = require("formdata-node");

const useNativeNodeLibraries =
  globalThis.FormData && globalThis.File && globalThis.Blob;

module.exports = {
  FormData: useNativeNodeLibraries
    ? globalThis.FormData
    : NodeFormData.FormData,
  File: useNativeNodeLibraries ? globalThis.File : NodeFormData.File,
  Blob: useNativeNodeLibraries ? globalThis.Blob : NodeFormData.Blob
};
