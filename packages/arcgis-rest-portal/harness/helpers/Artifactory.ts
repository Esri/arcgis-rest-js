/* Copyright (c) 2018-2021 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserSession } from "@esri/arcgis-rest-auth";

/**
 * @internal
 */
export default class Artifactory {
  public env: any;
  public orgs: Record<string, any>;
  public agoBaseDomain: string;

  constructor(config: any) {
    // qaext | prod
    // console.info(`Artifactory configured for qaext`);
    this.env = "devext";
    // hold the orgs...
    this.orgs = config.envs[this.env].orgs;
    // Copy over a set of other properties...
    this.agoBaseDomain = config.envs[this.env].agoBaseDomain;
  }

  /**
   * Get the portal url
   *
   * @param {string} name
   * @returns
   * @memberof Artifactory
   */
  getPortalUrl(name: string) {
    return `https://${this.getOrgShort(name)}.${this.agoBaseDomain}`;
  }

  /**
   * Given an identiry name (orgAdmin, orgViewer etc)
   * Return the username/password hash
   */
  getIdentity(orgType: string, role: string): Record<string, unknown> {
    const org = this.getOrg(orgType);
    const id = org[role] as Record<string, unknown>;
    if (!id) {
      throw new Error(
        `Artifactory does not have an Identity "${role}" for org "${orgType}". Please check configuration files.`
      );
    }
    return id;
  }
  /**
   * Return an ArcGIS Rest Js session for a given org and role
   * @param {string} orgType
   * @param {string} role
   */
  getSession(orgType: string, role: string): UserSession {
    const org = this.getOrg(orgType);
    const opts = this.getIdentity(orgType, role);
    if (!org.isPortal) {
      opts.portal = this.getPortalUrl(orgType) + `/sharing/rest`;
    } else {
      opts.portal = org.orgUrl;
    }

    return new UserSession(opts);
  }

  /**
   * Get the org-short
   */
  getOrgShort(name: string): string {
    return this.getOrg(name).orgShort as string;
  }
  /**
   * Get the org config by name
   */
  getOrg(name: string): Record<string, unknown> {
    const org = this.orgs[name];
    if (!org) {
      throw new Error(
        `Artifactory does not have an Org entry for "${name}". Please check configuration files.`
      );
    }
    return org;
  }

  getFixtures(name: string): Record<string, unknown> {
    return this.getOrg(name).fixtures as Record<string, unknown>;
  }
}
