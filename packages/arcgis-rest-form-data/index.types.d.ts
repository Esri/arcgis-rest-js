declare const _FormData: typeof FormData;
declare const _File: typeof File;
declare const _Blob: typeof Blob;

declare module "@esri/arcgis-rest-form-data" {
  export const FormData: typeof _FormData;
  export const File: typeof _File;
  export const Blob: typeof _Blob;
}
