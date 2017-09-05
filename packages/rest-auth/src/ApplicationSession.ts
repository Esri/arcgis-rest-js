import { IAuthenticationManager } from "@esri/rest-request";
import { fetchToken } from "./fetchToken";

export interface IApplicationSessionOptions {
  /**
   * Client ID of your application. Can be obtained by registering an application
   * on [ArcGIS for Developers](https://developers.arcgis.com/documentation/core-concepts/security-and-authentication/signing-in-arcgis-online-users/#registering-your-application),
   * [ArcGIS Online](http://doc.arcgis.com/en/arcgis-online/share-maps/add-items.htm#ESRI_SECTION1_0D1B620254F745AE84F394289F8AF44B) or on your instance of ArcGIS Enterprise.
   */
  clientId: string;

  /**
   * A Client Secret is also obtained by registering an application
   * on [ArcGIS for Developers](https://developers.arcgis.com/documentation/core-concepts/security-and-authentication/signing-in-arcgis-online-users/#registering-your-application),
   * [ArcGIS Online](http://doc.arcgis.com/en/arcgis-online/share-maps/add-items.htm#ESRI_SECTION1_0D1B620254F745AE84F394289F8AF44B) or on your instance of ArcGIS Enterprise. Treat it like a password.
   */
  clientSecret: string;

  /**
   * OAuth 2.0 access token from a previous application session.
   */
  token?: string;

  /**
   * Expiration date for the `token`
   */
  expires?: Date;

  /**
   * Duration of requested tokens in minutes. Used when requesting tokens with `username` and `password` for when validating the identities of unknown servers. Defaults to 2 weeks.
   */
  duration?: number;
}

export class ApplicationSession implements IAuthenticationManager {
  private clientId: string;
  private clientSecret: string;
  private token: string;
  private expires: Date;
  private portal: string;
  private duration: number;

  constructor(options: IApplicationSessionOptions) {
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.token = options.token;
    this.expires = options.expires;
    this.portal = "https://www.arcgis.com/sharing/rest";
    this.duration = options.duration || 20160;
  }

  getToken(url: string): Promise<string> {
    if (this.token && this.expires && this.expires.getTime() > Date.now()) {
      return Promise.resolve(this.token);
    }

    return this.refreshToken();
  }

  refreshToken(): Promise<string> {
    return fetchToken(`${this.portal}/oauth2/token/`, {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: "client_credentials"
    }).then(response => {
      this.token = response.token;
      this.expires = response.expires;
      return response.token;
    });
  }

  refreshSession() {
    return this.refreshToken().then(() => this);
  }
}
