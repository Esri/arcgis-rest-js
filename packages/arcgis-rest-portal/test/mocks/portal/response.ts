/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IPortal } from "../../../src/util/get-portal";
import { ISubscriptionInfo } from "../../../src/util/get-subscription-info";

export const PortalResponse: IPortal = {
  access: "public",
  allSSL: false,
  allowedRedirectUris: [],
  analysisLayersGroupQuery:
    'title:"Living Atlas Analysis Layers" AND owner:esri',
  authorizedCrossOriginDomains: [],
  availableCredits: 9584.193,
  basemapGalleryGroupQuery: "id:06d589ea1fdb47768ee3870f497333c0",
  canListApps: false,
  canListData: false,
  canListPreProvisionedItems: false,
  canProvisionDirectPurchase: false,
  canSearchPublic: true,
  canShareBingPublic: false,
  canSharePublic: true,
  canSignInArcGIS: true,
  canSignInIDP: true,
  colorSetsGroupQuery: 'title:"Esri Colors" AND owner:esri_en',
  commentsEnabled: true,
  created: 1392336986000,
  creditAssignments: "enabled",
  culture: "en",
  customBaseUrl: "mapsdevext.arcgis.com",
  databaseQuota: -1,
  databaseUsage: -1,
  defaultBasemap: {},
  defaultExtent: {
    type: "extent",
    xmin: -8589300.590116454,
    ymin: 4692777.971239516,
    xmax: -8562027.314872108,
    ymax: 4722244.554454538,
    spatialReference: {
      wkid: 102100
    }
  },
  defaultUserCreditAssignment: 100,
  defaultVectorBasemap: {
    baseMapLayers: [],
    title: "Topographic"
  },
  description: "We're the DC R&amp;D Center",
  eueiEnabled: false,
  featuredGroups: [],
  featuredGroupsId: "",
  featuredItemsGroupQuery: "",
  galleryTemplatesGroupQuery: 'title:"Gallery Templates" AND owner:esri_en',
  hasCategorySchema: false,
  helpBase: "http://docdev.arcgis.com/en/arcgis-online/",
  helpMap: {},
  helperServices: {},
  homePageFeaturedContent: "",
  homePageFeaturedContentCount: 12,
  id: "LjjARY1mkhxulWPq",
  isPortal: false,
  layerTemplatesGroupQuery: 'title:"Esri Layer Templates" AND owner:esri_en',
  livingAtlasGroupQuery: 'title:"Featured Maps And Apps" AND owner:esri',
  maxTokenExpirationMinutes: -1,
  metadataEditable: true,
  metadataFormats: ["iso19139"],
  modified: 1511894763000,
  name: "Washington, DC",
  notificationsEnabled: false,
  portalHostname: "devext.arcgis.com",
  portalMode: "multitenant",
  portalName: "ArcGIS Online",
  portalProperties: {},
  portalThumbnail: null,
  region: "WO",
  rotatorPanels: [
    {
      id: "banner-2",
      innerHTML:
        "<img src='images/banner-2.jpg' style='-webkit-border-radius:0 0 10px 10px; -moz-border-radius:0 0 10px 10px; -o-border-radius:0 0 10px 10px; border-radius:0 0 10px 10px; margin-top:0; width:960px; height:180px;'/><div style='position:absolute; bottom:80px; left:80px; max-height:65px; width:660px; margin:0;'><img src='http://dc.mapsdevext.arcgis.com/sharing/rest/portals/self/resources/thumbnail.png?token=SECURITY_TOKEN' alt='Washington, DC'  class='esriFloatLeading esriTrailingMargin025' style='margin-bottom:0; max-height:100px;'/><span style='position:absolute; bottom:0; margin-bottom:0; line-height:normal; font-family:HelveticaNeue,Verdana; font-weight:600; font-size:32px; color:#369;'>Washington, DC</span></div>"
    }
  ],
  showHomePageDescription: false,
  staticImagesUrl: "http://static.arcgis.com/images",
  storageQuota: 2199023255552,
  storageUsage: 17622609523,
  stylesGroupQuery: 'title:"Esri Styles" AND owner:esri_en',
  supportsHostedServices: true,
  symbolSetsGroupQuery: 'title:"Esri Symbols" AND owner:esri_en',
  templatesGroupQuery: "id:f233da8d297e4ff9ae992c21f8f4010f",
  thumbnail: "thumbnail.png",
  units: "english",
  updateUserProfileDisabled: false,
  urlKey: "dc",
  useStandardizedQuery: true,
  useVectorBasemaps: false,
  vectorBasemapGalleryGroupQuery:
    'title:"ArcGIS Online Vector Basemaps" AND owner:esri_en',
  subscriptionInfo: {},
  isHubEnabled: false,
  ipCntryCode: "US",
  httpPort: 80,
  httpsPort: 443,
  supportsOAuth: true,
  currentVersion: "5.4",
  allowedOrigins: [],
  mfaAdmins: [],
  contacts: ["dcadmin"],
  mfaEnabled: false,
  user: {},
  appInfo: {}
};

export const SubscriptionInfoResponse: ISubscriptionInfo = {
  id: "LjjARY1mkhxulWPq",
  type: "In House",
  state: "active",
  expDate: 1591253999000,
  userLicenseTypes: {},
  maxUsersPerLevel: {},
  maxUsers: 60,
  availableCredits: 9999.99,
  collaborationSettings: {},
  orgCapabilities: []
};
