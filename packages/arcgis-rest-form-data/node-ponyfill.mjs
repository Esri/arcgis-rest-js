import * as NodeFormData from "formdata-node";

const exists = globalThis.FormData && globalThis.File && globalThis.Blob;

export const FormData = exists ? globalThis.FormData : NodeFormData.FormData;
export const File = exists ? globalThis.File : NodeFormData.File;
export const Blob = exists ? globalThis.Blob : NodeFormData.Blob;
