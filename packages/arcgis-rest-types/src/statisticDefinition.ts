/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

/**
 * Enum of all different statistics operations
 */
export const enum StatisticType {
  Count = "count",
  Sum = "sum",
  Minimum = "min",
  Maximum = "max",
  Average = "avg",
  StandardDeviation = "stddev",
  Variance = "var",
  ContinuousPercentile = "percentile_cont",
  DiscretePercentile = "percentile_disc"
}

/**
 * Enum of sorting orders
 */
export const enum SortingOrder {
  Ascending = "asc",
  Descending = "desc"
}

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
    | "percentile_disc"
    | StatisticType;
  /**
   * Parameter to be used along with statisticType. Currently, only applicable for percentile_cont (continuous percentile) and percentile_disc (discrete percentile).
   */
  statisticParameter?: {
    value: number;
    orderBy?: "asc" | "desc" | SortingOrder;
  };
  /**
   * Field on which to perform the statistical operation.
   */
  onStatisticField: string;
  /**
   * Field name for the returned statistic field. If outStatisticFieldName is empty or missing, the server will assign one. A valid field name can only contain alphanumeric characters and an underscore. If the outStatisticFieldName is a reserved keyword of the underlying DBMS, the operation can fail. Try specifying an alternative outStatisticFieldName.
   */
  outStatisticFieldName: string;
}
