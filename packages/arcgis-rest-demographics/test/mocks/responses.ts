/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

export const dataCollectionsResponse: any = {
  DataCollections: [
    {
      dataCollectionID: "KeyGlobalFacts",
      metadata: {
        title: "Key Global Facts",
        name: "KeyGlobalFacts",
        shortDescription: "Key global demographic facts",
        longDescription:
          "Key demographic facts for the all countries supported by the geoenrichment service, variables include population, households, gender, and average household size.  The source for the data from the U.S. is Esri, Environics for Canada, and Michael Bauer Research (BMBR) for the remaining countries.",
        url: "",
        keywords: "Global, Key, Facts, Demographics, Indicators, Population",
        creationDate: 0,
        lastRevisionDate: 0,
        webmap: "",
        coverage: "North America, Europe, and the rest of the world",
        author: "Esri",
        countries: null,
        IsRoyalties: false,
        mobileinfographics: '{"icon":true}',
        icon: "key",
        categories: [
          {
            id: "Population",
            name: "Population",
            alias: "Population",
            description: "Population Category",
            displayOrder: "100"
          }
        ],
        filters: [
          {
            id: "Gender",
            name: "Gender",
            aliasname: "Gender",
            type: "Enumeration",
            enumValues: "Male,Female"
          }
        ],
        datasets: null,
        hierarchies: "census"
      },
      data: [
        {
          id: "TOTPOP",
          alias: "Total Population",
          type: "esriFieldTypeDouble",
          precision: 0,
          length: null,
          averageBase: null,
          averageBaseAlias: null,
          description: null,
          fieldCategory: "Key Demographic Indicators",
          indexBase: null,
          percentBase: null,
          percentBaseAlias: null,
          popularity: 20,
          units: "count",
          vintage: null,
          hideInDataBrowser: true,
          filteringTags: [],
          derivative: false,
          provider: "MBR"
        },
        {
          id: "TOTHH",
          alias: "Total Households",
          type: "esriFieldTypeDouble",
          precision: 0,
          length: null,
          averageBase: null,
          averageBaseAlias: null,
          description: null,
          fieldCategory: "Key Demographic Indicators",
          indexBase: null,
          percentBase: null,
          percentBaseAlias: null,
          popularity: null,
          units: "count",
          vintage: null,
          hideInDataBrowser: true,
          filteringTags: [],
          derivative: false,
          provider: "MBR"
        },
        {
          id: "AVGHHSZ",
          alias: "Average Household Size",
          type: "esriFieldTypeDouble",
          precision: 2,
          length: null,
          averageBase: null,
          averageBaseAlias: null,
          description: null,
          fieldCategory: "Key Demographic Indicators",
          indexBase: 2.58,
          percentBase: null,
          percentBaseAlias: null,
          popularity: 10,
          units: "count",
          vintage: null,
          hideInDataBrowser: true,
          filteringTags: [],
          derivative: false,
          provider: "MBR"
        },
        {
          id: "TOTMALES",
          alias: "Male Population",
          type: "esriFieldTypeDouble",
          precision: 0,
          length: null,
          averageBase: null,
          averageBaseAlias: null,
          description: null,
          fieldCategory: "Age: 5 Year Increments",
          indexBase: null,
          percentBase: "TOTPOP_CY",
          percentBaseAlias: null,
          popularity: null,
          units: "count",
          vintage: null,
          hideInDataBrowser: true,
          filteringTags: [{ id: "Gender", name: "Gender", value: "Male" }],
          derivative: false,
          provider: "MBR"
        },
        {
          id: "TOTFEMALES",
          alias: "Female Population",
          type: "esriFieldTypeDouble",
          precision: 0,
          length: null,
          averageBase: null,
          averageBaseAlias: null,
          description: null,
          fieldCategory: "Age: 5 Year Increments",
          indexBase: null,
          percentBase: "TOTPOP_CY",
          percentBaseAlias: null,
          popularity: null,
          units: "count",
          vintage: null,
          hideInDataBrowser: true,
          filteringTags: [{ id: "Gender", name: "Gender", value: "Female" }],
          derivative: false,
          provider: "MBR"
        }
      ]
    }
  ]
};
