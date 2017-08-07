import { request, IAuthenticationManager } from "@esri/rest-request";
import { fetchToken } from "./utils";

export interface IApplicationSessionOptions {
  clientId: string;
  clientSecret: string;
  token?: string;
  expires?: Date;
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
    this.refreshToken().then(() => this);
  }
}
