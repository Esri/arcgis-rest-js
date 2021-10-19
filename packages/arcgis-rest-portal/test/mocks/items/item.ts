/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IItem } from "../../../src/helpers.js";
import {
  IGetRelatedItemsResponse,
  IGetItemGroupsResponse,
  IGetItemStatusResponse,
  IGetItemPartsResponse
} from "../../../src/items/get";

export const ItemSuccessResponse: any = {
  success: true,
  id: "3efakeitemid0000"
};

export const ItemResponse: IItem = {
  id: "4bc",
  owner: "jeffvader",
  title: "DS Plans",
  description: "The plans",
  snippet: "Yeah these are the ones",
  tags: ["plans", "star dust"],
  type: "Web Map",
  typeKeywords: ["Javascript", "hubSiteApplication"],
  properties: {
    parentId: "3eb"
  },
  created: 123,
  modified: 456,
  size: 123,
  numViews: 1337,
  protected: false
};

export const RelatedItemsResponse: IGetRelatedItemsResponse = {
  total: 1,
  relatedItems: [ItemResponse]
};

export const ItemDataResponse: any = {
  source: "3ef",
  values: {
    key: "value"
  }
};

export const ItemGroupResponse: IGetItemGroupsResponse = {
  admin: [
    {
      id: "2ecb37a8c8fb4051af9c086c25503bb0",
      title: "Street Maps",
      isInvitationOnly: false,
      owner: "jsmith",
      description:
        "The street maps group provides street maps for the city of Redlands.",
      snippet: null,
      tags: ["Redlands", "Street", "Maps"],
      phone: "909.555.1234",
      thumbnail: "streets.jpg",
      created: 1247082196000,
      modified: 1276793808000,
      access: "public",
      userMembership: {
        username: "jsmith",
        memberType: "owner",
        applications: 1
      },
      isFav: false,
      autoJoin: false,
      isViewOnly: false,
      protected: false
    }
  ],
  member: [
    {
      id: "bf51aa6e879e4676b683dcbefb0ab0a9",
      title: "Parks and Recreation",
      isInvitationOnly: true,
      owner: "swilson",
      description:
        "The Parks and Recreation group contains maps and applications used by the Parks Department.",
      snippet: null,
      tags: ["Redlands", "Parks", "Recreation"],
      phone: "909.555.1234",
      thumbnail: "parks.jpg",
      created: 1247082197000,
      modified: 1276793919000,
      access: "private",
      userMembership: {
        username: "jsmith",
        memberType: "member"
      },
      isFav: false,
      autoJoin: false,
      isViewOnly: false,
      protected: false
    }
  ],
  other: [
    {
      id: "dbc385ac1b7d4231b24b97750f0e633c",
      title: "Featured Maps and Apps",
      isInvitationOnly: true,
      owner: "city_redlands",
      description: "These items are featured on the gallery page.",
      snippet: null,
      tags: ["gallery", "Featured Maps", "Featured Apps"],
      phone: "909.555.1234",
      thumbnail: "gallery.jpg",
      created: 1327099662000,
      modified: 1327099662000,
      access: "public",
      userMembership: {
        username: "jsmith",
        memberType: "none"
      },
      isFav: false,
      autoJoin: false,
      isViewOnly: false,
      protected: false
    }
  ]
};

export const ItemStatusResponse: IGetItemStatusResponse = {
  status: "completed",
  statusMessage: "completed",
  itemId: "1df"
};

export const ItemPartsResponse: IGetItemPartsResponse = {
  parts: [1]
};

// https://www.arcgis.com/sharing/rest/content/items/1ce4060e854747038b153c5c8f8c894d/info/iteminfo.xml
export const ItemInfoResponse: string = `
<?xml version="1.0" encoding="UTF-8" standalone="no"?><ESRI_ItemInformation Culture="en-us"><name>Sharjah_selection_WFL1</name><title>Sharjah_selection_WFL1</title><thumbnail>thumbnail/thumbnail.png</thumbnail><type>Feature Service</type><typekeywords><typekeyword>ArcGIS Server</typekeyword><typekeyword>Data</typekeyword><typekeyword>Feature Access</typekeyword><typekeyword>Feature Service</typekeyword><typekeyword>Metadata</typekeyword><typekeyword>Service</typekeyword><typekeyword>Singlelayer</typekeyword><typekeyword>Hosted Service</typekeyword></typekeywords><description/><tags><tag>Sharjah_selection</tag></tags><snippet>Sharjah_selection</snippet><extent><xmin>55.00687876313506</xmin><ymin>24.749573764658628</ymin><xmax>56.38435669830817</xmax><ymax>25.911597786107645</ymax></extent><spatialreference>102100</spatialreference><accessinformation/><licenseinfo/><url>https://services1.arcgis.com/Kq4xB498o2K1KK7t/arcgis/rest/services/Sharjah_selection_WFL1/FeatureServer</url></ESRI_ItemInformation>
`;

// https://www.arcgis.com/sharing/rest/content/items/1ce4060e854747038b153c5c8f8c894d/info/metadata/metadata.xml
export const ItemMetadataResponse: string = `
<?xml version="1.0" encoding="UTF-8" standalone="no"?><metadata xml:lang="en">
    <Esri>
        <CreaDate>20200305</CreaDate>
        <CreaTime>16302900</CreaTime>
        <ArcGISFormat>1.0</ArcGISFormat>
        <SyncOnce>FALSE</SyncOnce>
        <DataProperties>
            <itemProps>
                <itemName Sync="TRUE">SDE.ARCDATA_AREAS</itemName>
                <imsContentType Sync="TRUE">002</imsContentType>
                <nativeExtBox>
                    <westBL Sync="TRUE">333996.493700</westBL>
                    <eastBL Sync="TRUE">437765.674000</eastBL>
                    <southBL Sync="TRUE">2742761.572800</southBL>
                    <northBL Sync="TRUE">2834452.030000</northBL>
                    <exTypeCode Sync="TRUE">1</exTypeCode>
                </nativeExtBox>
            </itemProps>
            <coordRef>
                <type Sync="TRUE">Projected</type>
                <geogcsn Sync="TRUE">GCS_WGS_1984</geogcsn>
                <csUnits Sync="TRUE">Linear Unit: Meter (1.000000)</csUnits>
                <projcsn Sync="TRUE">WGS_1984_UTM_Zone_40N</projcsn>
                <peXml Sync="TRUE">&lt;ProjectedCoordinateSystem xsi:type='typens:ProjectedCoordinateSystem' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xs='http://www.w3.org/2001/XMLSchema' xmlns:typens='http://www.esri.com/schemas/ArcGIS/10.5'&gt;&lt;WKT&gt;PROJCS[&amp;quot;WGS_1984_UTM_Zone_40N&amp;quot;,GEOGCS[&amp;quot;GCS_WGS_1984&amp;quot;,DATUM[&amp;quot;D_WGS_1984&amp;quot;,SPHEROID[&amp;quot;WGS_1984&amp;quot;,6378137.0,298.257223563]],PRIMEM[&amp;quot;Greenwich&amp;quot;,0.0],UNIT[&amp;quot;Degree&amp;quot;,0.0174532925199433]],PROJECTION[&amp;quot;Transverse_Mercator&amp;quot;],PARAMETER[&amp;quot;False_Easting&amp;quot;,500000.0],PARAMETER[&amp;quot;False_Northing&amp;quot;,0.0],PARAMETER[&amp;quot;Central_Meridian&amp;quot;,57.0],PARAMETER[&amp;quot;Scale_Factor&amp;quot;,0.9996],PARAMETER[&amp;quot;Latitude_Of_Origin&amp;quot;,0.0],UNIT[&amp;quot;Meter&amp;quot;,1.0],AUTHORITY[&amp;quot;EPSG&amp;quot;,32640]]&lt;/WKT&gt;&lt;XOrigin&gt;-5120900&lt;/XOrigin&gt;&lt;YOrigin&gt;-9998100&lt;/YOrigin&gt;&lt;XYScale&gt;10000&lt;/XYScale&gt;&lt;ZOrigin&gt;0&lt;/ZOrigin&gt;&lt;ZScale&gt;1&lt;/ZScale&gt;&lt;MOrigin&gt;0&lt;/MOrigin&gt;&lt;MScale&gt;1&lt;/MScale&gt;&lt;XYTolerance&gt;0.001&lt;/XYTolerance&gt;&lt;ZTolerance&gt;0.001&lt;/ZTolerance&gt;&lt;MTolerance&gt;0.001&lt;/MTolerance&gt;&lt;HighPrecision&gt;true&lt;/HighPrecision&gt;&lt;WKID&gt;32640&lt;/WKID&gt;&lt;LatestWKID&gt;32640&lt;/LatestWKID&gt;&lt;/ProjectedCoordinateSystem&gt;</peXml>
            </coordRef>
        </DataProperties>
        <SyncDate>20180711</SyncDate>
        <SyncTime>08475400</SyncTime>
        <ModDate>20180711</ModDate>
        <ModTime>08475400</ModTime>
    </Esri>
    <dataIdInfo>
        <envirDesc Sync="FALSE">Esri ArcGIS 10.5.0.6491</envirDesc>
        <dataLang>
            <languageCode Sync="TRUE" value="eng"/>
            <countryCode Sync="TRUE" value="USA"/>
        </dataLang>
        <idCitation>
            <resTitle Sync="TRUE">SDE.ARCDATA_AREAS</resTitle>
            <presForm>
                <PresFormCd Sync="TRUE" value="005"/>
            </presForm>
        </idCitation>
        <spatRpType>
            <SpatRepTypCd Sync="TRUE" value="001"/>
        </spatRpType>
        <dataExt>
            <geoEle>
                <GeoBndBox esriExtentType="search">
                    <exTypeCode Sync="TRUE">1</exTypeCode>
                    <westBL Sync="TRUE">55.346704</westBL>
                    <eastBL Sync="TRUE">56.384276</eastBL>
                    <northBL Sync="TRUE">25.626358</northBL>
                    <southBL Sync="TRUE">24.790622</southBL>
                </GeoBndBox>
            </geoEle>
        </dataExt>
        <idAbs/>
        <searchKeys>
            <keyword>Sharjah_selection</keyword>
        </searchKeys>
        <idPurp>Sharjah_selection</idPurp>
        <idCredit/>
        <resConst>
            <Consts>
                <useLimit/>
            </Consts>
        </resConst>
    </dataIdInfo>
    <mdLang>
        <languageCode Sync="TRUE" value="eng"/>
        <countryCode Sync="TRUE" value="USA"/>
    </mdLang>
    <distInfo>
        <distFormat>
            <formatName Sync="FALSE">Feature Class</formatName>
        </distFormat>
    </distInfo>
    <mdHrLv>
        <ScopeCd Sync="TRUE" value="005"/>
    </mdHrLv>
    <mdHrLvName Sync="TRUE">dataset</mdHrLvName>
    <refSysInfo>
        <RefSystem>
            <refSysID>
                <identCode Sync="TRUE" code="32640"/>
                <idCodeSpace Sync="TRUE">EPSG</idCodeSpace>
                <idVersion Sync="TRUE">2.1(3.0.1)</idVersion>
            </refSysID>
        </RefSystem>
    </refSysInfo>
    <spatRepInfo>
        <VectSpatRep>
            <geometObjs Name="SDE.ARCDATA_AREAS">
                <geoObjTyp>
                    <GeoObjTypCd Sync="TRUE" value="002"/>
                </geoObjTyp>
                <geoObjCnt Sync="TRUE">0</geoObjCnt>
            </geometObjs>
            <topLvl>
                <TopoLevCd Sync="TRUE" value="001"/>
            </topLvl>
        </VectSpatRep>
    </spatRepInfo>
    <spdoinfo>
        <ptvctinf>
            <esriterm Name="SDE.ARCDATA_AREAS">
                <efeatyp Sync="TRUE">Simple</efeatyp>
                <efeageom Sync="TRUE" code="4"/>
                <esritopo Sync="TRUE">FALSE</esritopo>
                <efeacnt Sync="TRUE">0</efeacnt>
                <spindex Sync="TRUE">TRUE</spindex>
                <linrefer Sync="TRUE">FALSE</linrefer>
            </esriterm>
        </ptvctinf>
    </spdoinfo>
    <eainfo>
        <detailed Name="SDE.ARCDATA_AREAS">
            <enttyp>
                <enttypl Sync="TRUE">SDE.ARCDATA_AREAS</enttypl>
                <enttypt Sync="TRUE">Feature Class</enttypt>
                <enttypc Sync="TRUE">0</enttypc>
            </enttyp>
            <attr>
                <attrlabl Sync="TRUE">REMARKS</attrlabl>
                <attalias Sync="TRUE">REMARKS</attalias>
                <attrtype Sync="TRUE">String</attrtype>
                <attwidth Sync="TRUE">254</attwidth>
                <atprecis Sync="TRUE">0</atprecis>
                <attscale Sync="TRUE">0</attscale>
            </attr>
            <attr>
                <attrlabl Sync="TRUE">AREA_CODE</attrlabl>
                <attalias Sync="TRUE">AREA_CODE</attalias>
                <attrtype Sync="TRUE">Double</attrtype>
                <attwidth Sync="TRUE">8</attwidth>
                <atprecis Sync="TRUE">38</atprecis>
                <attscale Sync="TRUE">8</attscale>
            </attr>
            <attr>
                <attrlabl Sync="TRUE">SUBURB_COD</attrlabl>
                <attalias Sync="TRUE">SUBURB_COD</attalias>
                <attrtype Sync="TRUE">Double</attrtype>
                <attwidth Sync="TRUE">8</attwidth>
                <atprecis Sync="TRUE">38</atprecis>
                <attscale Sync="TRUE">8</attscale>
            </attr>
            <attr>
                <attrlabl Sync="TRUE">AREA_NAME_</attrlabl>
                <attalias Sync="TRUE">AREA_NAME_</attalias>
                <attrtype Sync="TRUE">String</attrtype>
                <attwidth Sync="TRUE">50</attwidth>
                <atprecis Sync="TRUE">0</atprecis>
                <attscale Sync="TRUE">0</attscale>
            </attr>
            <attr>
                <attrlabl Sync="TRUE">AREA_NAME1</attrlabl>
                <attalias Sync="TRUE">AREA_NAME1</attalias>
                <attrtype Sync="TRUE">String</attrtype>
                <attwidth Sync="TRUE">50</attwidth>
                <atprecis Sync="TRUE">0</atprecis>
                <attscale Sync="TRUE">0</attscale>
            </attr>
            <attr>
                <attrlabl Sync="TRUE">POPULATION</attrlabl>
                <attalias Sync="TRUE">POPULATION</attalias>
                <attrtype Sync="TRUE">Double</attrtype>
                <attwidth Sync="TRUE">8</attwidth>
                <atprecis Sync="TRUE">38</atprecis>
                <attscale Sync="TRUE">8</attscale>
            </attr>
            <attr>
                <attrlabl Sync="TRUE">CITY_CODE</attrlabl>
                <attalias Sync="TRUE">CITY_CODE</attalias>
                <attrtype Sync="TRUE">Double</attrtype>
                <attwidth Sync="TRUE">8</attwidth>
                <atprecis Sync="TRUE">38</atprecis>
                <attscale Sync="TRUE">8</attscale>
            </attr>
            <attr>
                <attrlabl Sync="TRUE">OBJECTID</attrlabl>
                <attalias Sync="TRUE">OBJECTID</attalias>
                <attrtype Sync="TRUE">OID</attrtype>
                <attwidth Sync="TRUE">4</attwidth>
                <atprecis Sync="TRUE">10</atprecis>
                <attscale Sync="TRUE">0</attscale>
                <attrdef Sync="TRUE">Internal feature number.</attrdef>
                <attrdefs Sync="TRUE">Esri</attrdefs>
                <attrdomv>
                    <udom Sync="TRUE">Sequential unique whole numbers that are automatically generated.</udom>
                </attrdomv>
            </attr>
            <attr>
                <attrlabl Sync="TRUE">SHAPE</attrlabl>
                <attalias Sync="TRUE">SHAPE</attalias>
                <attrtype Sync="TRUE">Geometry</attrtype>
                <attwidth Sync="TRUE">4</attwidth>
                <atprecis Sync="TRUE">0</atprecis>
                <attscale Sync="TRUE">0</attscale>
                <attrdef Sync="TRUE">Feature geometry.</attrdef>
                <attrdefs Sync="TRUE">ESRI</attrdefs>
                <attrdomv>
                    <udom Sync="TRUE">Coordinates defining the features.</udom>
                </attrdomv>
            </attr>
            <attr>
                <attrlabl Sync="TRUE">GLOBALID</attrlabl>
                <attalias Sync="TRUE">GLOBALID</attalias>
                <attrtype Sync="TRUE">GlobalID</attrtype>
                <attwidth Sync="TRUE">38</attwidth>
                <atprecis Sync="TRUE">0</atprecis>
                <attscale Sync="TRUE">0</attscale>
            </attr>
            <attr>
                <attrlabl Sync="TRUE">CREATED_USER</attrlabl>
                <attalias Sync="TRUE">CREATED_USER</attalias>
                <attrtype Sync="TRUE">String</attrtype>
                <attwidth Sync="TRUE">255</attwidth>
                <atprecis Sync="TRUE">0</atprecis>
                <attscale Sync="TRUE">0</attscale>
            </attr>
            <attr>
                <attrlabl Sync="TRUE">CREATED_DATE</attrlabl>
                <attalias Sync="TRUE">CREATED_DATE</attalias>
                <attrtype Sync="TRUE">Date</attrtype>
                <attwidth Sync="TRUE">8</attwidth>
                <atprecis Sync="TRUE">0</atprecis>
                <attscale Sync="TRUE">0</attscale>
            </attr>
            <attr>
                <attrlabl Sync="TRUE">LAST_EDITED_USER</attrlabl>
                <attalias Sync="TRUE">LAST_EDITED_USER</attalias>
                <attrtype Sync="TRUE">String</attrtype>
                <attwidth Sync="TRUE">255</attwidth>
                <atprecis Sync="TRUE">0</atprecis>
                <attscale Sync="TRUE">0</attscale>
            </attr>
            <attr>
                <attrlabl Sync="TRUE">LAST_EDITED_DATE</attrlabl>
                <attalias Sync="TRUE">LAST_EDITED_DATE</attalias>
                <attrtype Sync="TRUE">Date</attrtype>
                <attwidth Sync="TRUE">8</attwidth>
                <atprecis Sync="TRUE">0</atprecis>
                <attscale Sync="TRUE">0</attscale>
            </attr>
            <attr>
                <attrlabl Sync="TRUE">LOCAL_POPULATION</attrlabl>
                <attalias Sync="TRUE">Local_Population</attalias>
                <attrtype Sync="TRUE">Integer</attrtype>
                <attwidth Sync="TRUE">4</attwidth>
                <atprecis Sync="TRUE">10</atprecis>
                <attscale Sync="TRUE">0</attscale>
            </attr>
            <attr>
                <attrlabl Sync="TRUE">FOREIGN_POPULATION</attrlabl>
                <attalias Sync="TRUE">Foreign_Population</attalias>
                <attrtype Sync="TRUE">Integer</attrtype>
                <attwidth Sync="TRUE">4</attwidth>
                <atprecis Sync="TRUE">10</atprecis>
                <attscale Sync="TRUE">0</attscale>
            </attr>
            <attr>
                <attrlabl Sync="TRUE">POPULATION2016</attrlabl>
                <attalias Sync="TRUE">Population2016</attalias>
                <attrtype Sync="TRUE">Integer</attrtype>
                <attwidth Sync="TRUE">4</attwidth>
                <atprecis Sync="TRUE">10</atprecis>
                <attscale Sync="TRUE">0</attscale>
            </attr>
            <attr>
                <attrlabl Sync="TRUE">AREA_USE</attrlabl>
                <attalias Sync="TRUE">AREA_USE</attalias>
                <attrtype Sync="TRUE">String</attrtype>
                <attwidth Sync="TRUE">1</attwidth>
                <atprecis Sync="TRUE">0</atprecis>
                <attscale Sync="TRUE">0</attscale>
            </attr>
            <attr>
                <attrlabl Sync="TRUE">SHAPE.AREA</attrlabl>
                <attalias Sync="TRUE">SHAPE.AREA</attalias>
                <attrtype Sync="TRUE">Double</attrtype>
                <attwidth Sync="TRUE">0</attwidth>
                <atprecis Sync="TRUE">0</atprecis>
                <attscale Sync="TRUE">0</attscale>
            </attr>
            <attr>
                <attrlabl Sync="TRUE">SHAPE.LEN</attrlabl>
                <attalias Sync="TRUE">SHAPE.LEN</attalias>
                <attrtype Sync="TRUE">Double</attrtype>
                <attwidth Sync="TRUE">0</attwidth>
                <atprecis Sync="TRUE">0</atprecis>
                <attscale Sync="TRUE">0</attscale>
            </attr>
        </detailed>
    </eainfo>
    <mdDateSt Sync="TRUE">20180711</mdDateSt>
</metadata>
`;

export const ItemFormJsonResponse: any = {
  portalUrl: "https://qaext.arcgis.com",
  header: {
    content:
      "%3Cp%20title%3D'Community%20Survey'%3ECommunity%20Survey%3C%2Fp%3E",
    isVisible: true
  },
  subHeader: {
    content:
      "%3Cp%3E%3Cspan%20style%3D%22font-size%3A%2014px%3B%22%3ESimple%20survey%20starter%20for%20ArcGIS%20Hub's%20Create%20Your%20Own%20Initiative.%20%3C%2Fspan%3E%3C%2Fp%3E%3Cp%3E%3Cbr%3E%3C%2Fp%3E%3Cp%3E%3Cbr%3E%3C%2Fp%3E%3Cp%3E%3Cspan%20style%3D%22font-size%3A%2014px%3B%22%3EIn%20edit%20mode%2C%20use%20the%20configuration%20panel%20at%20the%20right%20to%20add%20different%20kinds%20of%20questions.%20Save%20and%20publish%20your%20survey%20to%20gather%20feedback%20and%20data%20from%20your%20communities.%20%3C%2Fspan%3E%3C%2Fp%3E%3Cp%3E%3Cbr%3E%3C%2Fp%3E%3Cp%3E%3Cspan%20style%3D%22font-size%3A%2014px%3B%22%3E%3Cspan%20class%3D%22ql-cursor%22%3E%EF%BB%BF%3C%2Fspan%3E%3C%2Fspan%3E%3C%2Fp%3E",
    isVisible: true
  },
  questions: [
    {
      id: "field_0",
      position: 0,
      fieldName: "field_0",
      name: "field_0",
      type: "esriQuestionTypeSingleChoice",
      label: "What is your favorite pet?",
      description:
        "%3Cp%3EReplace%20this%20question%20with%20your%20own%2C%20and%20add%20more!%3C%2Fp%3E",
      isRequired: false,
      choices: {
        items: [
          {
            label: "Dog",
            value: "choice0",
            position: 0
          },
          {
            label: "Cat",
            value: "choice1",
            position: 1
          },
          {
            label: "Monkey",
            value: "choice2",
            position: 2
          }
        ],
        other: {
          isEnabled: true,
          label: "Other",
          value: "other",
          fieldName: "field_0_other",
          name: "field_0_other"
        }
      },
      appearance: {
        layout: "compact"
      }
    }
  ],
  rules: [],
  version: "2.5",
  theme: {
    name: "theme-color1",
    style: {
      header: {
        backgroundColor: "#31872e",
        color: "#ffffff"
      },
      subHeader: {},
      footer: {}
    }
  },
  footer: {
    content:
      "%3Ca%20href%3D'https%3A%2F%2Fsurvey123.arcgis.com'%20target%3D'_blank'%3EPowered%20by%20Survey123%20for%20ArcGIS%3C%2Fa%3E",
    isVisible: true
  },
  submit: {
    buttonText: "Submit"
  },
  settings: {
    showQuestionNumber: true,
    allowSubmitAnother: true,
    thankYouScreenContent: "Great! Your data was sent successfully. Thanks.",
    recordStartEndTime: {
      isEnabled: false,
      fieldInfos: []
    }
  }
};
