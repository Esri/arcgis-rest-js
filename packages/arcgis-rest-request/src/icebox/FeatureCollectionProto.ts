// Enums
export enum GeometryType {
  esriGeometryTypePoint = 0,
  esriGeometryTypeMultipoint = 1,
  esriGeometryTypePolyline = 2,
  esriGeometryTypePolygon = 3,
  esriGeometryTypeMultipatch = 4,
  esriGeometryTypeNone = 127
}

export enum FieldType {
  esriFieldTypeSmallInteger = 0,
  esriFieldTypeInteger = 1,
  esriFieldTypeSingle = 2,
  esriFieldTypeDouble = 3,
  esriFieldTypeString = 4,
  esriFieldTypeDate = 5,
  esriFieldTypeOID = 6,
  esriFieldTypeGeometry = 7,
  esriFieldTypeBlob = 8,
  esriFieldTypeRaster = 9,
  esriFieldTypeGUID = 10,
  esriFieldTypeGlobalID = 11,
  esriFieldTypeXML = 12
}

export enum SQLType {
  sqlTypeBigInt = 0,
  sqlTypeBinary = 1,
  sqlTypeBit = 2,
  sqlTypeChar = 3,
  sqlTypeDate = 4,
  sqlTypeDecimal = 5,
  sqlTypeDouble = 6,
  sqlTypeFloat = 7,
  sqlTypeGeometry = 8,
  sqlTypeGUID = 9,
  sqlTypeInteger = 10,
  sqlTypeLongNVarchar = 11,
  sqlTypeLongVarbinary = 12,
  sqlTypeLongVarchar = 13,
  sqlTypeNChar = 14,
  sqlTypeNVarchar = 15,
  sqlTypeOther = 16,
  sqlTypeReal = 17,
  sqlTypeSmallInt = 18,
  sqlTypeSqlXml = 19,
  sqlTypeTime = 20,
  sqlTypeTimestamp = 21,
  sqlTypeTimestamp2 = 22,
  sqlTypeTinyInt = 23,
  sqlTypeVarbinary = 24,
  sqlTypeVarchar = 25
}

export enum QuantizeOriginPostion {
  upperLeft = 0,
  lowerLeft = 1
}

// Interfaces
export interface SpatialReference {
  wkid: number;
  lastestWkid: number;
  vcsWkid: number;
  latestVcsWkid: number;
  wkt: string;
}

export interface Field {
  name: string;
  fieldType: FieldType;
  alias: string;
  sqlType: SQLType;
  domain: string;
  defaultValue: string;
}

export interface Value {
  string_value?: string;
  float_value?: number;
  double_value?: number;
  sint_value?: number;
  uint_value?: number;
  int64_value?: number;
  uint64_value?: number;
  sint64_value?: number;
  bool_value?: boolean;
  value_type: string;
}

export interface Geometry {
  lengths: number[];
  coords: number[];
}

export interface EsriShapeBuffer {
  bytes: Uint8Array | null;
}

export interface Feature {
  attributes: Value[];
  geometry?: Geometry;
  compressed_geometry?: string;
  shapeBuffer?: EsriShapeBuffer;
  centroid?: Geometry;
}

export interface UniqueIdField {
  name: string;
  isSystemMaintained: boolean;
}

export interface GeometryProperties {
  shapeAreaFieldName: string;
  shapeLengthFieldName: string;
  units: string;
}

export interface ServerGens {
  minServerGen: number;
  serverGen: number;
}

export interface Scale {
  xScale: number;
  yScale: number;
  mScale: number;
  zScale: number;
}

export interface Translate {
  xTranslate: number;
  yTranslate: number;
  mTranslate: number;
  zTranslate: number;
}

export interface Transform {
  quantizeOriginPostion: QuantizeOriginPostion;
  scale: Scale | null;
  translate: Translate | null;
}

export interface FeatureResult {
  objectIdFieldName: string;
  uniqueIdField: UniqueIdField | null;
  globalIdFieldName: string;
  geohashFieldName: string;
  geometryProperties: GeometryProperties | null;
  serverGens: ServerGens | null;
  geometryType: GeometryType;
  spatialReference: SpatialReference | null;
  exceededTransferLimit: boolean;
  hasZ: boolean;
  hasM: boolean;
  transform: Transform | null;
  fields: Field[];
  values: Value[];
  features: Feature[];
}

export interface CountResult {
  count: number;
}

export interface ObjectIdsResult {
  objectIdFieldName: string;
  serverGens: ServerGens | null;
  objectIds: number[];
}

export interface QueryResult {
  featureResult?: FeatureResult;
  Results?: string;
  countResult?: CountResult;
  idsResult?: ObjectIdsResult;
}

export interface FeatureCollectionPBufferType {
  version: string;
  queryResult: QueryResult | null;
}
