/**
 * This file `FeatureCollection.js` file is a slightly slimmed down version of
 * https://github.com/Esri/arcgis-pbf/blob/main/proto/FeatureCollection/parsers/js/FeatureCollection.js
 * It's currently unused but kept for completeness sake because it's a bit bigger and uses
 * the protocol-buffer dependency.
 *
 * Copyright 2021 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader,
  $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const esriPBuffer = ($root.esriPBuffer = (() => {
  /**
   * Namespace esriPBuffer.
   * @exports esriPBuffer
   * @namespace
   */
  const esriPBuffer = {};

  esriPBuffer.FeatureCollectionPBuffer = (function () {
    /**
     * Properties of a FeatureCollectionPBuffer.
     * @memberof esriPBuffer
     * @interface IFeatureCollectionPBuffer
     * @property {string|null} [version] FeatureCollectionPBuffer version
     * @property {esriPBuffer.FeatureCollectionPBuffer.QueryResult|null} [queryResult] FeatureCollectionPBuffer queryResult
     */

    /**
     * Constructs a new FeatureCollectionPBuffer.
     * @memberof esriPBuffer
     * @classdesc Represents a FeatureCollectionPBuffer.
     * @implements IFeatureCollectionPBuffer
     * @constructor
     * @param {esriPBuffer.IFeatureCollectionPBuffer=} [properties] Properties to set
     */
    function FeatureCollectionPBuffer(properties) {
      if (properties)
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * FeatureCollectionPBuffer version.
     * @member {string} version
     * @memberof esriPBuffer.FeatureCollectionPBuffer
     * @instance
     */
    FeatureCollectionPBuffer.prototype.version = "";

    /**
     * FeatureCollectionPBuffer queryResult.
     * @member {esriPBuffer.FeatureCollectionPBuffer.QueryResult|null|undefined} queryResult
     * @memberof esriPBuffer.FeatureCollectionPBuffer
     * @instance
     */
    FeatureCollectionPBuffer.prototype.queryResult = null;

    /**
     * Decodes a FeatureCollectionPBuffer message from the specified reader or buffer.
     * @function decode
     * @memberof esriPBuffer.FeatureCollectionPBuffer
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {esriPBuffer.FeatureCollectionPBuffer} FeatureCollectionPBuffer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    FeatureCollectionPBuffer.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      const end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.esriPBuffer.FeatureCollectionPBuffer();
      while (reader.pos < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.version = reader.string();
            break;
          case 2:
            message.queryResult =
              $root.esriPBuffer.FeatureCollectionPBuffer.QueryResult.decode(
                reader,
                reader.uint32()
              );
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * GeometryType enum.
     * @name esriPBuffer.FeatureCollectionPBuffer.GeometryType
     * @enum {number}
     * @property {number} esriGeometryTypePoint=0 esriGeometryTypePoint value
     * @property {number} esriGeometryTypeMultipoint=1 esriGeometryTypeMultipoint value
     * @property {number} esriGeometryTypePolyline=2 esriGeometryTypePolyline value
     * @property {number} esriGeometryTypePolygon=3 esriGeometryTypePolygon value
     * @property {number} esriGeometryTypeMultipatch=4 esriGeometryTypeMultipatch value
     * @property {number} esriGeometryTypeNone=127 esriGeometryTypeNone value
     */
    FeatureCollectionPBuffer.GeometryType = (function () {
      const valuesById = {},
        values = Object.create(valuesById);
      values[(valuesById[0] = "esriGeometryTypePoint")] = 0;
      values[(valuesById[1] = "esriGeometryTypeMultipoint")] = 1;
      values[(valuesById[2] = "esriGeometryTypePolyline")] = 2;
      values[(valuesById[3] = "esriGeometryTypePolygon")] = 3;
      values[(valuesById[4] = "esriGeometryTypeMultipatch")] = 4;
      values[(valuesById[127] = "esriGeometryTypeNone")] = 127;
      return values;
    })();

    /**
     * FieldType enum.
     * @name esriPBuffer.FeatureCollectionPBuffer.FieldType
     * @enum {number}
     * @property {number} esriFieldTypeSmallInteger=0 esriFieldTypeSmallInteger value
     * @property {number} esriFieldTypeInteger=1 esriFieldTypeInteger value
     * @property {number} esriFieldTypeSingle=2 esriFieldTypeSingle value
     * @property {number} esriFieldTypeDouble=3 esriFieldTypeDouble value
     * @property {number} esriFieldTypeString=4 esriFieldTypeString value
     * @property {number} esriFieldTypeDate=5 esriFieldTypeDate value
     * @property {number} esriFieldTypeOID=6 esriFieldTypeOID value
     * @property {number} esriFieldTypeGeometry=7 esriFieldTypeGeometry value
     * @property {number} esriFieldTypeBlob=8 esriFieldTypeBlob value
     * @property {number} esriFieldTypeRaster=9 esriFieldTypeRaster value
     * @property {number} esriFieldTypeGUID=10 esriFieldTypeGUID value
     * @property {number} esriFieldTypeGlobalID=11 esriFieldTypeGlobalID value
     * @property {number} esriFieldTypeXML=12 esriFieldTypeXML value
     */
    FeatureCollectionPBuffer.FieldType = (function () {
      const valuesById = {},
        values = Object.create(valuesById);
      values[(valuesById[0] = "esriFieldTypeSmallInteger")] = 0;
      values[(valuesById[1] = "esriFieldTypeInteger")] = 1;
      values[(valuesById[2] = "esriFieldTypeSingle")] = 2;
      values[(valuesById[3] = "esriFieldTypeDouble")] = 3;
      values[(valuesById[4] = "esriFieldTypeString")] = 4;
      values[(valuesById[5] = "esriFieldTypeDate")] = 5;
      values[(valuesById[6] = "esriFieldTypeOID")] = 6;
      values[(valuesById[7] = "esriFieldTypeGeometry")] = 7;
      values[(valuesById[8] = "esriFieldTypeBlob")] = 8;
      values[(valuesById[9] = "esriFieldTypeRaster")] = 9;
      values[(valuesById[10] = "esriFieldTypeGUID")] = 10;
      values[(valuesById[11] = "esriFieldTypeGlobalID")] = 11;
      values[(valuesById[12] = "esriFieldTypeXML")] = 12;
      return values;
    })();

    /**
     * QuantizeOriginPostion enum.
     * @name esriPBuffer.FeatureCollectionPBuffer.QuantizeOriginPostion
     * @enum {number}
     * @property {number} upperLeft=0 upperLeft value
     * @property {number} lowerLeft=1 lowerLeft value
     */
    FeatureCollectionPBuffer.QuantizeOriginPostion = (function () {
      const valuesById = {},
        values = Object.create(valuesById);
      values[(valuesById[0] = "upperLeft")] = 0;
      values[(valuesById[1] = "lowerLeft")] = 1;
      return values;
    })();

    FeatureCollectionPBuffer.SpatialReference = (function () {
      /**
       * Properties of a SpatialReference.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface ISpatialReference
       * @property {number|null} [wkid] SpatialReference wkid
       * @property {number|null} [lastestWkid] SpatialReference lastestWkid
       * @property {number|null} [vcsWkid] SpatialReference vcsWkid
       * @property {number|null} [latestVcsWkid] SpatialReference latestVcsWkid
       * @property {string|null} [wkt] SpatialReference wkt
       */

      /**
       * Constructs a new SpatialReference.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents a SpatialReference.
       * @implements ISpatialReference
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.ISpatialReference=} [properties] Properties to set
       */
      function SpatialReference(properties) {
        if (properties)
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * SpatialReference wkid.
       * @member {number} wkid
       * @memberof esriPBuffer.FeatureCollectionPBuffer.SpatialReference
       * @instance
       */
      SpatialReference.prototype.wkid = 0;

      /**
       * SpatialReference lastestWkid.
       * @member {number} lastestWkid
       * @memberof esriPBuffer.FeatureCollectionPBuffer.SpatialReference
       * @instance
       */
      SpatialReference.prototype.lastestWkid = 0;

      /**
       * SpatialReference vcsWkid.
       * @member {number} vcsWkid
       * @memberof esriPBuffer.FeatureCollectionPBuffer.SpatialReference
       * @instance
       */
      SpatialReference.prototype.vcsWkid = 0;

      /**
       * SpatialReference latestVcsWkid.
       * @member {number} latestVcsWkid
       * @memberof esriPBuffer.FeatureCollectionPBuffer.SpatialReference
       * @instance
       */
      SpatialReference.prototype.latestVcsWkid = 0;

      /**
       * SpatialReference wkt.
       * @member {string} wkt
       * @memberof esriPBuffer.FeatureCollectionPBuffer.SpatialReference
       * @instance
       */
      SpatialReference.prototype.wkt = "";

      /**
       * Decodes a SpatialReference message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.SpatialReference
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.SpatialReference} SpatialReference
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      SpatialReference.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        const end = length === undefined ? reader.len : reader.pos + length,
          message =
            new $root.esriPBuffer.FeatureCollectionPBuffer.SpatialReference();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.wkid = reader.uint32();
              break;
            case 2:
              message.lastestWkid = reader.uint32();
              break;
            case 3:
              message.vcsWkid = reader.uint32();
              break;
            case 4:
              message.latestVcsWkid = reader.uint32();
              break;
            case 5:
              message.wkt = reader.string();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      return SpatialReference;
    })();

    FeatureCollectionPBuffer.Field = (function () {
      /**
       * Properties of a Field.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface IField
       * @property {string|null} [name] Field name
       * @property {esriPBuffer.FeatureCollectionPBuffer.FieldType|null} [fieldType] Field fieldType
       * @property {string|null} [alias] Field alias
       * @property {esriPBuffer.FeatureCollectionPBuffer.SQLType|null} [sqlType] Field sqlType
       * @property {string|null} [domain] Field domain
       * @property {string|null} [defaultValue] Field defaultValue
       */

      /**
       * Constructs a new Field.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents a Field.
       * @implements IField
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.IField=} [properties] Properties to set
       */
      function Field(properties) {
        if (properties)
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * Field name.
       * @member {string} name
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Field
       * @instance
       */
      Field.prototype.name = "";

      /**
       * Field fieldType.
       * @member {esriPBuffer.FeatureCollectionPBuffer.FieldType} fieldType
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Field
       * @instance
       */
      Field.prototype.fieldType = 0;

      /**
       * Field alias.
       * @member {string} alias
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Field
       * @instance
       */
      Field.prototype.alias = "";

      /**
       * Field sqlType.
       * @member {esriPBuffer.FeatureCollectionPBuffer.SQLType} sqlType
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Field
       * @instance
       */
      Field.prototype.sqlType = 0;

      /**
       * Field domain.
       * @member {string} domain
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Field
       * @instance
       */
      Field.prototype.domain = "";

      /**
       * Field defaultValue.
       * @member {string} defaultValue
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Field
       * @instance
       */
      Field.prototype.defaultValue = "";

      /**
       * Decodes a Field message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Field
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Field} Field
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      Field.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        const end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.esriPBuffer.FeatureCollectionPBuffer.Field();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.name = reader.string();
              break;
            case 2:
              message.fieldType = reader.int32();
              break;
            case 3:
              message.alias = reader.string();
              break;
            case 4:
              message.sqlType = reader.int32();
              break;
            case 5:
              message.domain = reader.string();
              break;
            case 6:
              message.defaultValue = reader.string();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      return Field;
    })();

    FeatureCollectionPBuffer.Value = (function () {
      /**
       * Properties of a Value.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface IValue
       * @property {string|null} [stringValue] Value stringValue
       * @property {number|null} [floatValue] Value floatValue
       * @property {number|null} [doubleValue] Value doubleValue
       * @property {number|null} [sintValue] Value sintValue
       * @property {number|null} [uintValue] Value uintValue
       * @property {number|Long|null} [int64Value] Value int64Value
       * @property {number|Long|null} [uint64Value] Value uint64Value
       * @property {number|Long|null} [sint64Value] Value sint64Value
       * @property {boolean|null} [boolValue] Value boolValue
       */

      /**
       * Constructs a new Value.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents a Value.
       * @implements IValue
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.IValue=} [properties] Properties to set
       */
      function Value(properties) {
        if (properties)
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * Value stringValue.
       * @member {string|null|undefined} stringValue
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @instance
       */
      Value.prototype.stringValue = null;

      /**
       * Value floatValue.
       * @member {number|null|undefined} floatValue
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @instance
       */
      Value.prototype.floatValue = null;

      /**
       * Value doubleValue.
       * @member {number|null|undefined} doubleValue
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @instance
       */
      Value.prototype.doubleValue = null;

      /**
       * Value sintValue.
       * @member {number|null|undefined} sintValue
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @instance
       */
      Value.prototype.sintValue = null;

      /**
       * Value uintValue.
       * @member {number|null|undefined} uintValue
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @instance
       */
      Value.prototype.uintValue = null;

      /**
       * Value int64Value.
       * @member {number|Long|null|undefined} int64Value
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @instance
       */
      Value.prototype.int64Value = null;

      /**
       * Value uint64Value.
       * @member {number|Long|null|undefined} uint64Value
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @instance
       */
      Value.prototype.uint64Value = null;

      /**
       * Value sint64Value.
       * @member {number|Long|null|undefined} sint64Value
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @instance
       */
      Value.prototype.sint64Value = null;

      /**
       * Value boolValue.
       * @member {boolean|null|undefined} boolValue
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @instance
       */
      Value.prototype.boolValue = null;

      // OneOf field names bound to virtual getters and setters
      let $oneOfFields;

      /**
       * Value valueType.
       * @member {"stringValue"|"floatValue"|"doubleValue"|"sintValue"|"uintValue"|"int64Value"|"uint64Value"|"sint64Value"|"boolValue"|undefined} valueType
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @instance
       */
      Object.defineProperty(Value.prototype, "valueType", {
        get: $util.oneOfGetter(
          ($oneOfFields = [
            "stringValue",
            "floatValue",
            "doubleValue",
            "sintValue",
            "uintValue",
            "int64Value",
            "uint64Value",
            "sint64Value",
            "boolValue"
          ])
        ),
        set: $util.oneOfSetter($oneOfFields)
      });

      /**
       * Decodes a Value message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Value
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Value} Value
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      Value.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        const end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.esriPBuffer.FeatureCollectionPBuffer.Value();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.stringValue = reader.string();
              break;
            case 2:
              message.floatValue = reader.float();
              break;
            case 3:
              message.doubleValue = reader.double();
              break;
            case 4:
              message.sintValue = reader.sint32();
              break;
            case 5:
              message.uintValue = reader.uint32();
              break;
            case 6:
              message.int64Value = reader.int64();
              break;
            case 7:
              message.uint64Value = reader.uint64();
              break;
            case 8:
              message.sint64Value = reader.sint64();
              break;
            case 9:
              message.boolValue = reader.bool();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      return Value;
    })();

    FeatureCollectionPBuffer.Geometry = (function () {
      /**
       * Properties of a Geometry.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface IGeometry
       * @property {Array.<number>|null} [lengths] Geometry lengths
       * @property {Array.<number|Long>|null} [coords] Geometry coords
       */

      /**
       * Constructs a new Geometry.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents a Geometry.
       * @implements IGeometry
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.IGeometry=} [properties] Properties to set
       */
      function Geometry(properties) {
        this.lengths = [];
        this.coords = [];
        if (properties)
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * Geometry lengths.
       * @member {Array.<number>} lengths
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Geometry
       * @instance
       */
      Geometry.prototype.lengths = $util.emptyArray;

      /**
       * Geometry coords.
       * @member {Array.<number|Long>} coords
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Geometry
       * @instance
       */
      Geometry.prototype.coords = $util.emptyArray;

      /**
       * Decodes a Geometry message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Geometry
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Geometry} Geometry
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      Geometry.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        const end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.esriPBuffer.FeatureCollectionPBuffer.Geometry();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 2:
              if (!(message.lengths && message.lengths.length))
                message.lengths = [];
              if ((tag & 7) === 2) {
                const end2 = reader.uint32() + reader.pos;
                while (reader.pos < end2) message.lengths.push(reader.uint32());
              } else message.lengths.push(reader.uint32());
              break;
            case 3:
              if (!(message.coords && message.coords.length))
                message.coords = [];
              if ((tag & 7) === 2) {
                const end2 = reader.uint32() + reader.pos;
                while (reader.pos < end2) message.coords.push(reader.sint64());
              } else message.coords.push(reader.sint64());
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      return Geometry;
    })();

    FeatureCollectionPBuffer.esriShapeBuffer = (function () {
      /**
       * Properties of an esriShapeBuffer.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface IesriShapeBuffer
       * @property {Uint8Array|null} [bytes] esriShapeBuffer bytes
       */

      /**
       * Constructs a new esriShapeBuffer.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents an esriShapeBuffer.
       * @implements IesriShapeBuffer
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.IesriShapeBuffer=} [properties] Properties to set
       */
      function esriShapeBuffer(properties) {
        if (properties)
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * esriShapeBuffer bytes.
       * @member {Uint8Array} bytes
       * @memberof esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer
       * @instance
       */
      esriShapeBuffer.prototype.bytes = $util.newBuffer([]);

      /**
       * Decodes an esriShapeBuffer message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer} esriShapeBuffer
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      esriShapeBuffer.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        const end = length === undefined ? reader.len : reader.pos + length,
          message =
            new $root.esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.bytes = reader.bytes();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      return esriShapeBuffer;
    })();

    FeatureCollectionPBuffer.Feature = (function () {
      /**
       * Properties of a Feature.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface IFeature
       * @property {Array.<esriPBuffer.FeatureCollectionPBuffer.Value>|null} [attributes] Feature attributes
       * @property {esriPBuffer.FeatureCollectionPBuffer.Geometry|null} [geometry] Feature geometry
       * @property {esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer|null} [shapeBuffer] Feature shapeBuffer
       * @property {esriPBuffer.FeatureCollectionPBuffer.Geometry|null} [centroid] Feature centroid
       */

      /**
       * Constructs a new Feature.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents a Feature.
       * @implements IFeature
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.IFeature=} [properties] Properties to set
       */
      function Feature(properties) {
        this.attributes = [];
        if (properties)
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * Feature attributes.
       * @member {Array.<esriPBuffer.FeatureCollectionPBuffer.Value>} attributes
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Feature
       * @instance
       */
      Feature.prototype.attributes = $util.emptyArray;

      /**
       * Feature geometry.
       * @member {esriPBuffer.FeatureCollectionPBuffer.Geometry|null|undefined} geometry
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Feature
       * @instance
       */
      Feature.prototype.geometry = null;

      /**
       * Feature shapeBuffer.
       * @member {esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer|null|undefined} shapeBuffer
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Feature
       * @instance
       */
      Feature.prototype.shapeBuffer = null;

      /**
       * Feature centroid.
       * @member {esriPBuffer.FeatureCollectionPBuffer.Geometry|null|undefined} centroid
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Feature
       * @instance
       */
      Feature.prototype.centroid = null;

      // OneOf field names bound to virtual getters and setters
      let $oneOfFields;

      /**
       * Feature compressedGeometry.
       * @member {"geometry"|"shapeBuffer"|undefined} compressedGeometry
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Feature
       * @instance
       */
      Object.defineProperty(Feature.prototype, "compressedGeometry", {
        get: $util.oneOfGetter(($oneOfFields = ["geometry", "shapeBuffer"])),
        set: $util.oneOfSetter($oneOfFields)
      });

      /**
       * Decodes a Feature message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Feature
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Feature} Feature
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      Feature.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        const end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.esriPBuffer.FeatureCollectionPBuffer.Feature();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              if (!(message.attributes && message.attributes.length))
                message.attributes = [];
              message.attributes.push(
                $root.esriPBuffer.FeatureCollectionPBuffer.Value.decode(
                  reader,
                  reader.uint32()
                )
              );
              break;
            case 2:
              message.geometry =
                $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.decode(
                  reader,
                  reader.uint32()
                );
              break;
            case 3:
              message.shapeBuffer =
                $root.esriPBuffer.FeatureCollectionPBuffer.esriShapeBuffer.decode(
                  reader,
                  reader.uint32()
                );
              break;
            case 4:
              message.centroid =
                $root.esriPBuffer.FeatureCollectionPBuffer.Geometry.decode(
                  reader,
                  reader.uint32()
                );
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      return Feature;
    })();

    FeatureCollectionPBuffer.UniqueIdField = (function () {
      /**
       * Properties of an UniqueIdField.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface IUniqueIdField
       * @property {string|null} [name] UniqueIdField name
       * @property {boolean|null} [isSystemMaintained] UniqueIdField isSystemMaintained
       */

      /**
       * Constructs a new UniqueIdField.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents an UniqueIdField.
       * @implements IUniqueIdField
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.IUniqueIdField=} [properties] Properties to set
       */
      function UniqueIdField(properties) {
        if (properties)
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * UniqueIdField name.
       * @member {string} name
       * @memberof esriPBuffer.FeatureCollectionPBuffer.UniqueIdField
       * @instance
       */
      UniqueIdField.prototype.name = "";

      /**
       * UniqueIdField isSystemMaintained.
       * @member {boolean} isSystemMaintained
       * @memberof esriPBuffer.FeatureCollectionPBuffer.UniqueIdField
       * @instance
       */
      UniqueIdField.prototype.isSystemMaintained = false;

      /**
       * Decodes an UniqueIdField message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.UniqueIdField
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.UniqueIdField} UniqueIdField
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      UniqueIdField.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        const end = length === undefined ? reader.len : reader.pos + length,
          message =
            new $root.esriPBuffer.FeatureCollectionPBuffer.UniqueIdField();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.name = reader.string();
              break;
            case 2:
              message.isSystemMaintained = reader.bool();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      return UniqueIdField;
    })();

    FeatureCollectionPBuffer.GeometryProperties = (function () {
      /**
       * Properties of a GeometryProperties.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface IGeometryProperties
       * @property {string|null} [shapeAreaFieldName] GeometryProperties shapeAreaFieldName
       * @property {string|null} [shapeLengthFieldName] GeometryProperties shapeLengthFieldName
       * @property {string|null} [units] GeometryProperties units
       */

      /**
       * Constructs a new GeometryProperties.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents a GeometryProperties.
       * @implements IGeometryProperties
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.IGeometryProperties=} [properties] Properties to set
       */
      function GeometryProperties(properties) {
        if (properties)
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * GeometryProperties shapeAreaFieldName.
       * @member {string} shapeAreaFieldName
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryProperties
       * @instance
       */
      GeometryProperties.prototype.shapeAreaFieldName = "";

      /**
       * GeometryProperties shapeLengthFieldName.
       * @member {string} shapeLengthFieldName
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryProperties
       * @instance
       */
      GeometryProperties.prototype.shapeLengthFieldName = "";

      /**
       * GeometryProperties units.
       * @member {string} units
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryProperties
       * @instance
       */
      GeometryProperties.prototype.units = "";

      /**
       * Decodes a GeometryProperties message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.GeometryProperties
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.GeometryProperties} GeometryProperties
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      GeometryProperties.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        const end = length === undefined ? reader.len : reader.pos + length,
          message =
            new $root.esriPBuffer.FeatureCollectionPBuffer.GeometryProperties();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.shapeAreaFieldName = reader.string();
              break;
            case 2:
              message.shapeLengthFieldName = reader.string();
              break;
            case 3:
              message.units = reader.string();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      return GeometryProperties;
    })();

    FeatureCollectionPBuffer.Scale = (function () {
      /**
       * Properties of a Scale.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface IScale
       * @property {number|null} [xScale] Scale xScale
       * @property {number|null} [yScale] Scale yScale
       * @property {number|null} [mScale] Scale mScale
       * @property {number|null} [zScale] Scale zScale
       */

      /**
       * Constructs a new Scale.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents a Scale.
       * @implements IScale
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.IScale=} [properties] Properties to set
       */
      function Scale(properties) {
        if (properties)
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * Scale xScale.
       * @member {number} xScale
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Scale
       * @instance
       */
      Scale.prototype.xScale = 0;

      /**
       * Scale yScale.
       * @member {number} yScale
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Scale
       * @instance
       */
      Scale.prototype.yScale = 0;

      /**
       * Scale mScale.
       * @member {number} mScale
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Scale
       * @instance
       */
      Scale.prototype.mScale = 0;

      /**
       * Scale zScale.
       * @member {number} zScale
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Scale
       * @instance
       */
      Scale.prototype.zScale = 0;

      /**
       * Decodes a Scale message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Scale
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Scale} Scale
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      Scale.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        const end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.esriPBuffer.FeatureCollectionPBuffer.Scale();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.xScale = reader.double();
              break;
            case 2:
              message.yScale = reader.double();
              break;
            case 3:
              message.mScale = reader.double();
              break;
            case 4:
              message.zScale = reader.double();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      return Scale;
    })();

    FeatureCollectionPBuffer.Translate = (function () {
      /**
       * Properties of a Translate.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface ITranslate
       * @property {number|null} [xTranslate] Translate xTranslate
       * @property {number|null} [yTranslate] Translate yTranslate
       * @property {number|null} [mTranslate] Translate mTranslate
       * @property {number|null} [zTranslate] Translate zTranslate
       */

      /**
       * Constructs a new Translate.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents a Translate.
       * @implements ITranslate
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.ITranslate=} [properties] Properties to set
       */
      function Translate(properties) {
        if (properties)
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * Translate xTranslate.
       * @member {number} xTranslate
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Translate
       * @instance
       */
      Translate.prototype.xTranslate = 0;

      /**
       * Translate yTranslate.
       * @member {number} yTranslate
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Translate
       * @instance
       */
      Translate.prototype.yTranslate = 0;

      /**
       * Translate mTranslate.
       * @member {number} mTranslate
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Translate
       * @instance
       */
      Translate.prototype.mTranslate = 0;

      /**
       * Translate zTranslate.
       * @member {number} zTranslate
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Translate
       * @instance
       */
      Translate.prototype.zTranslate = 0;

      /**
       * Decodes a Translate message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Translate
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Translate} Translate
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      Translate.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        const end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.esriPBuffer.FeatureCollectionPBuffer.Translate();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.xTranslate = reader.double();
              break;
            case 2:
              message.yTranslate = reader.double();
              break;
            case 3:
              message.mTranslate = reader.double();
              break;
            case 4:
              message.zTranslate = reader.double();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      return Translate;
    })();

    FeatureCollectionPBuffer.Transform = (function () {
      /**
       * Properties of a Transform.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface ITransform
       * @property {esriPBuffer.FeatureCollectionPBuffer.QuantizeOriginPostion|null} [quantizeOriginPostion] Transform quantizeOriginPostion
       * @property {esriPBuffer.FeatureCollectionPBuffer.Scale|null} [scale] Transform scale
       * @property {esriPBuffer.FeatureCollectionPBuffer.Translate|null} [translate] Transform translate
       */

      /**
       * Constructs a new Transform.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents a Transform.
       * @implements ITransform
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.ITransform=} [properties] Properties to set
       */
      function Transform(properties) {
        if (properties)
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * Transform quantizeOriginPostion.
       * @member {esriPBuffer.FeatureCollectionPBuffer.QuantizeOriginPostion} quantizeOriginPostion
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Transform
       * @instance
       */
      Transform.prototype.quantizeOriginPostion = 0;

      /**
       * Transform scale.
       * @member {esriPBuffer.FeatureCollectionPBuffer.Scale|null|undefined} scale
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Transform
       * @instance
       */
      Transform.prototype.scale = null;

      /**
       * Transform translate.
       * @member {esriPBuffer.FeatureCollectionPBuffer.Translate|null|undefined} translate
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Transform
       * @instance
       */
      Transform.prototype.translate = null;

      /**
       * Decodes a Transform message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.Transform
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.Transform} Transform
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      Transform.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        const end = length === undefined ? reader.len : reader.pos + length,
          message = new $root.esriPBuffer.FeatureCollectionPBuffer.Transform();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.quantizeOriginPostion = reader.int32();
              break;
            case 2:
              message.scale =
                $root.esriPBuffer.FeatureCollectionPBuffer.Scale.decode(
                  reader,
                  reader.uint32()
                );
              break;
            case 3:
              message.translate =
                $root.esriPBuffer.FeatureCollectionPBuffer.Translate.decode(
                  reader,
                  reader.uint32()
                );
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      return Transform;
    })();

    FeatureCollectionPBuffer.FeatureResult = (function () {
      /**
       * Properties of a FeatureResult.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface IFeatureResult
       * @property {string|null} [objectIdFieldName] FeatureResult objectIdFieldName
       * @property {esriPBuffer.FeatureCollectionPBuffer.UniqueIdField|null} [uniqueIdField] FeatureResult uniqueIdField
       * @property {string|null} [globalIdFieldName] FeatureResult globalIdFieldName
       * @property {string|null} [geohashFieldName] FeatureResult geohashFieldName
       * @property {esriPBuffer.FeatureCollectionPBuffer.GeometryProperties|null} [geometryProperties] FeatureResult geometryProperties
       * @property {esriPBuffer.FeatureCollectionPBuffer.ServerGens|null} [serverGens] FeatureResult serverGens
       * @property {esriPBuffer.FeatureCollectionPBuffer.GeometryType|null} [geometryType] FeatureResult geometryType
       * @property {esriPBuffer.FeatureCollectionPBuffer.SpatialReference|null} [spatialReference] FeatureResult spatialReference
       * @property {boolean|null} [exceededTransferLimit] FeatureResult exceededTransferLimit
       * @property {boolean|null} [hasZ] FeatureResult hasZ
       * @property {boolean|null} [hasM] FeatureResult hasM
       * @property {esriPBuffer.FeatureCollectionPBuffer.Transform|null} [transform] FeatureResult transform
       * @property {Array.<esriPBuffer.FeatureCollectionPBuffer.Field>|null} [fields] FeatureResult fields
       * @property {Array.<esriPBuffer.FeatureCollectionPBuffer.Value>|null} [values] FeatureResult values
       * @property {Array.<esriPBuffer.FeatureCollectionPBuffer.Feature>|null} [features] FeatureResult features
       */

      /**
       * Constructs a new FeatureResult.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents a FeatureResult.
       * @implements IFeatureResult
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.IFeatureResult=} [properties] Properties to set
       */
      function FeatureResult(properties) {
        this.fields = [];
        this.values = [];
        this.features = [];
        if (properties)
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * FeatureResult objectIdFieldName.
       * @member {string} objectIdFieldName
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.objectIdFieldName = "";

      /**
       * FeatureResult uniqueIdField.
       * @member {esriPBuffer.FeatureCollectionPBuffer.UniqueIdField|null|undefined} uniqueIdField
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.uniqueIdField = null;

      /**
       * FeatureResult globalIdFieldName.
       * @member {string} globalIdFieldName
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.globalIdFieldName = "";

      /**
       * FeatureResult geohashFieldName.
       * @member {string} geohashFieldName
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.geohashFieldName = "";

      /**
       * FeatureResult geometryProperties.
       * @member {esriPBuffer.FeatureCollectionPBuffer.GeometryProperties|null|undefined} geometryProperties
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.geometryProperties = null;

      /**
       * FeatureResult serverGens.
       * @member {esriPBuffer.FeatureCollectionPBuffer.ServerGens|null|undefined} serverGens
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.serverGens = null;

      /**
       * FeatureResult geometryType.
       * @member {esriPBuffer.FeatureCollectionPBuffer.GeometryType} geometryType
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.geometryType = 0;

      /**
       * FeatureResult spatialReference.
       * @member {esriPBuffer.FeatureCollectionPBuffer.SpatialReference|null|undefined} spatialReference
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.spatialReference = null;

      /**
       * FeatureResult exceededTransferLimit.
       * @member {boolean} exceededTransferLimit
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.exceededTransferLimit = false;

      /**
       * FeatureResult hasZ.
       * @member {boolean} hasZ
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.hasZ = false;

      /**
       * FeatureResult hasM.
       * @member {boolean} hasM
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.hasM = false;

      /**
       * FeatureResult transform.
       * @member {esriPBuffer.FeatureCollectionPBuffer.Transform|null|undefined} transform
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.transform = null;

      /**
       * FeatureResult fields.
       * @member {Array.<esriPBuffer.FeatureCollectionPBuffer.Field>} fields
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.fields = $util.emptyArray;

      /**
       * FeatureResult values.
       * @member {Array.<esriPBuffer.FeatureCollectionPBuffer.Value>} values
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.values = $util.emptyArray;

      /**
       * FeatureResult features.
       * @member {Array.<esriPBuffer.FeatureCollectionPBuffer.Feature>} features
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @instance
       */
      FeatureResult.prototype.features = $util.emptyArray;

      /**
       * Decodes a FeatureResult message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.FeatureResult
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.FeatureResult} FeatureResult
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      FeatureResult.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        const end = length === undefined ? reader.len : reader.pos + length,
          message =
            new $root.esriPBuffer.FeatureCollectionPBuffer.FeatureResult();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.objectIdFieldName = reader.string();
              break;
            case 2:
              message.uniqueIdField =
                $root.esriPBuffer.FeatureCollectionPBuffer.UniqueIdField.decode(
                  reader,
                  reader.uint32()
                );
              break;
            case 3:
              message.globalIdFieldName = reader.string();
              break;
            case 4:
              message.geohashFieldName = reader.string();
              break;
            case 5:
              message.geometryProperties =
                $root.esriPBuffer.FeatureCollectionPBuffer.GeometryProperties.decode(
                  reader,
                  reader.uint32()
                );
              break;
            case 7:
              message.geometryType = reader.int32();
              break;
            case 8:
              message.spatialReference =
                $root.esriPBuffer.FeatureCollectionPBuffer.SpatialReference.decode(
                  reader,
                  reader.uint32()
                );
              break;
            case 9:
              message.exceededTransferLimit = reader.bool();
              break;
            case 10:
              message.hasZ = reader.bool();
              break;
            case 11:
              message.hasM = reader.bool();
              break;
            case 12:
              message.transform =
                $root.esriPBuffer.FeatureCollectionPBuffer.Transform.decode(
                  reader,
                  reader.uint32()
                );
              break;
            case 13:
              if (!(message.fields && message.fields.length))
                message.fields = [];
              message.fields.push(
                $root.esriPBuffer.FeatureCollectionPBuffer.Field.decode(
                  reader,
                  reader.uint32()
                )
              );
              break;
            case 14:
              if (!(message.values && message.values.length))
                message.values = [];
              message.values.push(
                $root.esriPBuffer.FeatureCollectionPBuffer.Value.decode(
                  reader,
                  reader.uint32()
                )
              );
              break;
            case 15:
              if (!(message.features && message.features.length))
                message.features = [];
              message.features.push(
                $root.esriPBuffer.FeatureCollectionPBuffer.Feature.decode(
                  reader,
                  reader.uint32()
                )
              );
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      return FeatureResult;
    })();

    FeatureCollectionPBuffer.QueryResult = (function () {
      /**
       * Properties of a QueryResult.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @interface IQueryResult
       * @property {esriPBuffer.FeatureCollectionPBuffer.FeatureResult|null} [featureResult] QueryResult featureResult
       * @property {esriPBuffer.FeatureCollectionPBuffer.CountResult|null} [countResult] QueryResult countResult
       * @property {esriPBuffer.FeatureCollectionPBuffer.ObjectIdsResult|null} [idsResult] QueryResult idsResult
       */

      /**
       * Constructs a new QueryResult.
       * @memberof esriPBuffer.FeatureCollectionPBuffer
       * @classdesc Represents a QueryResult.
       * @implements IQueryResult
       * @constructor
       * @param {esriPBuffer.FeatureCollectionPBuffer.IQueryResult=} [properties] Properties to set
       */
      function QueryResult(properties) {
        if (properties)
          for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * QueryResult featureResult.
       * @member {esriPBuffer.FeatureCollectionPBuffer.FeatureResult|null|undefined} featureResult
       * @memberof esriPBuffer.FeatureCollectionPBuffer.QueryResult
       * @instance
       */
      QueryResult.prototype.featureResult = null;

      // OneOf field names bound to virtual getters and setters
      let $oneOfFields;

      /**
       * QueryResult Results.
       * @member {"featureResult"|"countResult"|"idsResult"|undefined} Results
       * @memberof esriPBuffer.FeatureCollectionPBuffer.QueryResult
       * @instance
       */
      Object.defineProperty(QueryResult.prototype, "Results", {
        get: $util.oneOfGetter(($oneOfFields = ["featureResult"])),
        set: $util.oneOfSetter($oneOfFields)
      });

      /**
       * Decodes a QueryResult message from the specified reader or buffer.
       * @function decode
       * @memberof esriPBuffer.FeatureCollectionPBuffer.QueryResult
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {esriPBuffer.FeatureCollectionPBuffer.QueryResult} QueryResult
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      QueryResult.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
        const end = length === undefined ? reader.len : reader.pos + length,
          message =
            new $root.esriPBuffer.FeatureCollectionPBuffer.QueryResult();
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.featureResult =
                $root.esriPBuffer.FeatureCollectionPBuffer.FeatureResult.decode(
                  reader,
                  reader.uint32()
                );
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      return QueryResult;
    })();

    return FeatureCollectionPBuffer;
  })();

  return esriPBuffer;
})());

export { $root as default };
