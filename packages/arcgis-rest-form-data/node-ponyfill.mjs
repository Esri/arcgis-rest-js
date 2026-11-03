import * as NodeFormData from "formdata-node";

export const FormData = globalThis.FormData || NodeFormData.FormData;
export const File = globalThis.File || NodeFormData.File;
export const Blob = globalThis.Blob || NodeFormData.Blob;
