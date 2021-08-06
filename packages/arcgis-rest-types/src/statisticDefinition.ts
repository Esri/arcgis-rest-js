/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

export interface IStatisticDefinition {
  /**
   * Statistical operation to perform (count, sum, min, max, avg, stddev, var, percentile_cont, percentile_disc).
   */
  statisticType:
    | "count"
    | "sum"
    | "min"
    | "max"
    | "avg"
    | "stddev"
    | "var"
    | "percentile_cont"
    | "percentile_disc";
  /**
   * Parameters to be used along with statisticType. Currently, only applicable for percentile_cont (continuous percentile) and percentile_disc (discrete percentile).
   */
  statisticParameters?: {
    value: number;
    orderBy?: "asc" | "desc";
  };
  /**
   * Field on which to perform the statistical operation.
   */
  onStatisticField: string;
  /**
   * Field name for the returned statistic field. If outStatisticFieldName is empty or missing, the server will assign one. A valid field name can only contain alphanumeric characters and an underscore. If the outStatisticFieldName is a reserved keyword of the underlying DBMS, the operation can fail. Try specifying an alternative outStatisticFieldName.
   */
  outStatisticFieldName?: string;
}
