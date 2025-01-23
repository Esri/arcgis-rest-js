import { IUser } from "./types/user.js";
import { IRequestOptions } from "./utils/IRequestOptions.js";
import { request } from "./request.js";
import { cleanUrl } from "./utils/clean-url.js";

class AuthenticationManagerBase {
  /**
   * The current portal the user is authenticated with.
   */
  public readonly portal: string;

  /**
   * The username of the currently authenticated user.
   */
  get username() {
    if (this._username) {
      return this._username;
    }

    if (this._user && this._user.username) {
      return this._user.username;
    }
  }

  constructor(options: any) {
    this.portal = options.portal
      ? cleanUrl(options.portal)
      : "https://www.arcgis.com/sharing/rest";
    this._username = options.username;
  }

  /**
   * Internal varible to track the pending user request so we do not make multiple requests.
   */
  private _pendingUserRequest: Promise<IUser>;

  /**
   * Hydrated by a call to [getUser()](#getUser-summary).
   */
  private _user: IUser;

  /**
   * Internal variable to store the username.
   */
  private _username: string;

  /**
   * Returns the username for the currently logged in [user](https://developers.arcgis.com/rest/users-groups-and-items/user.htm). Subsequent calls will *not* result in additional web traffic. This is also used internally when a username is required for some requests but is not present in the options.
   *
   * ```js
   * manager.getUsername()
   *   .then(response => {
   *     console.log(response); // "casey_jones"
   *   })
   * ```
   */
  public getUsername() {
    if (this.username) {
      return Promise.resolve(this.username);
    } else {
      return this.getUser().then((user) => {
        return user.username;
      });
    }
  }

  /**
   * Returns information about the currently logged in [user](https://developers.arcgis.com/rest/users-groups-and-items/user.htm). Subsequent calls will *not* result in additional web traffic.
   *
   * ```js
   * manager.getUser()
   *   .then(response => {
   *     console.log(response.role); // "org_admin"
   *   })
   * ```
   *
   * @param requestOptions - Options for the request. NOTE: `rawResponse` is not supported by this operation.
   * @returns A Promise that will resolve with the data from the response.
   */
  public getUser(requestOptions?: IRequestOptions): Promise<IUser> {
    if (this._pendingUserRequest) {
      return this._pendingUserRequest;
    } else if (this._user) {
      return Promise.resolve(this._user);
    } else {
      const url = `${this.portal}/community/self`;

      const options = {
        httpMethod: "GET",
        authentication: this,
        ...requestOptions,
        rawResponse: false
      } as IRequestOptions;

      this._pendingUserRequest = request(url, options).then((response) => {
        this._user = response;
        this._pendingUserRequest = null;
        return response;
      });

      return this._pendingUserRequest;
    }
  }

  /**
   * Clear the cached user infornation. Usefull to ensure that the most recent user information from {@linkcode AuthenticationManagerBase.getUser} is used.
   */
  public clearCachedUserInfo() {
    this._user = null;
  }
}

export { AuthenticationManagerBase };
