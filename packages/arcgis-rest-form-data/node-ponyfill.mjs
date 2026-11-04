import * as NodeFormData from "formdata-node";

const useNativeNodeLibraries =
  globalThis.FormData && globalThis.File && globalThis.Blob;

export const FormData = useNativeNodeLibraries
  ? globalThis.FormData
  : NodeFormData.FormData;
export const File = useNativeNodeLibraries
  ? globalThis.File
  : NodeFormData.File;
export const Blob = useNativeNodeLibraries
  ? globalThis.Blob
  : NodeFormData.Blob;
