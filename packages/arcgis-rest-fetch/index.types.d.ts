declare module "@esri/arcgis-rest-fetch" {
  export function getFetch(): Promise<{
    fetch: typeof fetch;
    Request: typeof Request;
    Response: typeof Response;
    Headers: typeof Headers;
  }>;
}
