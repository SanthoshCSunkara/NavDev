import {
  ApplicationCustomizerContext
} from '@microsoft/sp-application-base';
import { SPHttpClient } from '@microsoft/sp-http';

import {
  ICorpChromeConfig,
  IBrandingConfigItem,
  IGlobalNavItem,
  IDivisionNavItem,
  IFooterLinkItem,
  IHubDivisionMappingItem,
  ISharePointUrlValue
} from '../models/ICorpChromeConfig';
import { ICorpChromeConfigService } from './ICorpChromeConfigService';
import {
  FIELDS,
  LISTS,
  REQUIRED_FIELDS_BY_LIST
} from '../../../common/spSchema';

export class CorpChromeConfigService implements ICorpChromeConfigService {
  constructor(
    private readonly context: ApplicationCustomizerContext,
    private readonly configSiteUrl: string
  ) {}

  private readonly _jsonRequestOptions = {
    headers: {
      accept: 'application/json;odata=nometadata'
    }
  };

  public async getConfig(): Promise<ICorpChromeConfig> {
    const defaultBranding: IBrandingConfigItem = {
      id: 0,
      title: this.context.pageContext.web.title || 'Intranet',
      enabled: true,
      logoUrl: { Url: '', Description: '' },
      headerRow1Bg: '#003366',
      headerRow2Bg: '#0b4f8a',
      middleRowBg: '#ffffff',
      hoverColor: '#005a9e',
      searchPlaceholder: 'Search this site',
      footerBg: '#003366',
      footerTextColor: '#ffffff',
      copyrightText: `© ${new Date().getFullYear()} Corp Chrome`,
      useUnsupportedHideNativeHeader: false,
      cacheTtlMinutes: 15,
      configVersion: 'default',
      modified: new Date().toISOString()
    };

    const globalNav: IGlobalNavItem[] = [];
    const divisionNav: IDivisionNavItem[] = [];
    const footerLinks: IFooterLinkItem[] = [];
    const hubDivisionMapping: IHubDivisionMappingItem[] = [];

    const errors: string[] = [];
    this._assertRequiredFields(LISTS.BrandingConfig, errors);
    this._assertRequiredFields(LISTS.GlobalNav, errors);
    this._assertRequiredFields(LISTS.DivisionNav, errors);
    this._assertRequiredFields(LISTS.FooterLinks, errors);
    this._assertRequiredFields(LISTS.HubDivisionMapping, errors);

    await this._validateListAndFields(LISTS.BrandingConfig, errors);
    await this._validateListAndFields(LISTS.GlobalNav, errors);
    await this._validateListAndFields(LISTS.DivisionNav, errors);
    await this._validateListAndFields(LISTS.FooterLinks, errors);
    await this._validateListAndFields(LISTS.HubDivisionMapping, errors);

    const brandingConfig = (await this._getBrandingConfig(errors)) || defaultBranding;
    globalNav.push(...await this._getGlobalNav(errors));
    divisionNav.push(...await this._getDivisionNav(errors));
    footerLinks.push(...await this._getFooterLinks(errors));
    hubDivisionMapping.push(...await this._getHubDivisionMappings(errors));

    return {
      brandingConfig,
      globalNav,
      divisionNav,
      footerLinks,
      hubDivisionMapping,
      errors
    };
  }

  private _assertRequiredFields(listTitle: string, errors: string[]): void {
    const required = REQUIRED_FIELDS_BY_LIST[listTitle];
    if (!required || required.length === 0) {
      const message = `[CorpChrome] Required field map not found for list '${listTitle}'.`;
      // eslint-disable-next-line no-console
      console.error(message);
      errors.push(message);
      return;
    }

    const missing = required.filter((name) => !name || !name.trim());
    if (missing.length > 0) {
      missing.forEach((name) => {
        const message = `[CorpChrome] Missing internal field name for list '${listTitle}': '${name}'.`;
        // eslint-disable-next-line no-console
        console.error(message);
        errors.push(message);
      });
    }
  }

  private async _validateListAndFields(listTitle: string, errors: string[]): Promise<void> {
    const encodedListTitle = listTitle.replace(/'/g, "''");
    const listEndpoint = `${this.configSiteUrl}/_api/web/lists/getByTitle('${encodedListTitle}')?$select=Id,Title`;

    try {
      const listResponse = await this.context.spHttpClient.get(
        listEndpoint,
        SPHttpClient.configurations.v1,
        this._jsonRequestOptions
      );

      if (listResponse.status === 401 || listResponse.status === 403) {
        errors.push(`Unable to access list '${listTitle}' (HTTP ${listResponse.status}) on ${this.configSiteUrl}. Please verify permissions.`);
        return;
      }

      if (!listResponse.ok) {
        errors.push(`List '${listTitle}' is missing or inaccessible (HTTP ${listResponse.status}) on ${this.configSiteUrl}.`);
        return;
      }

      const fieldsEndpoint =
        `${this.configSiteUrl}/_api/web/lists/getByTitle('${encodedListTitle}')/fields?` +
        `$select=InternalName&$filter=Hidden eq false`;

      const fieldsResponse = await this.context.spHttpClient.get(
        fieldsEndpoint,
        SPHttpClient.configurations.v1,
        this._jsonRequestOptions
      );

      if (!fieldsResponse.ok) {
        errors.push(`Unable to read fields for list '${listTitle}' (HTTP ${fieldsResponse.status}) on ${this.configSiteUrl}.`);
        return;
      }

      const fieldsJson: {
        value?: Array<{ InternalName?: string }>;
      } = await fieldsResponse.json();

      const existingFields = new Set(
        (fieldsJson.value || [])
          .map((f) => f.InternalName)
          .filter((name): name is string => !!name)
      );

      const requiredFields = REQUIRED_FIELDS_BY_LIST[listTitle] || [];
      requiredFields.forEach((fieldName) => {
        if (!existingFields.has(fieldName)) {
          const message = `Missing field '${fieldName}' in list '${listTitle}' on ${this.configSiteUrl}.`;
          // eslint-disable-next-line no-console
          console.error(`[CorpChrome] ${message}`);
          errors.push(message);
        }
      });

      // validate at least one item read so field-level query failures are surfaced early
      await this._probeListRead(listTitle, errors);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`Failed schema validation for list '${listTitle}' on ${this.configSiteUrl}: ${message}`);
    }
  }

  private async _probeListRead(listTitle: string, errors: string[]): Promise<void> {
    const encodedListTitle = listTitle.replace(/'/g, "''");
    const endpoint =
      `${this.configSiteUrl}/_api/web/lists/getByTitle('${encodedListTitle}')/items?` +
      `$select=${FIELDS.Common.Id}&$top=1`;

    const response = await this.context.spHttpClient.get(
      endpoint,
      SPHttpClient.configurations.v1,
      this._jsonRequestOptions
    );

    if (!response.ok) {
      errors.push(
        `Failed to read an item from list '${listTitle}' (HTTP ${response.status}) on ${this.configSiteUrl}.`
      );
    }
  }

  private async _getBrandingConfig(errors: string[]): Promise<IBrandingConfigItem | undefined> {
    const items = await this._getItems(LISTS.BrandingConfig, [
      FIELDS.Common.Id,
      FIELDS.Common.Title,
      FIELDS.BrandingConfig.Enabled,
      FIELDS.BrandingConfig.LogoUrl,
      FIELDS.BrandingConfig.HeaderRow1Bg,
      FIELDS.BrandingConfig.HeaderRow2Bg,
      FIELDS.BrandingConfig.MiddleRowBg,
      FIELDS.BrandingConfig.HoverColor,
      FIELDS.BrandingConfig.SearchPlaceholder,
      FIELDS.BrandingConfig.FooterBg,
      FIELDS.BrandingConfig.FooterTextColor,
      FIELDS.BrandingConfig.CopyrightText,
      FIELDS.BrandingConfig.UseUnsupportedHideNativeHeader,
      FIELDS.BrandingConfig.CacheTtlMinutes,
      FIELDS.BrandingConfig.ConfigVersion,
      'Modified'
    ], errors);

    const enabledRows = items
      .filter((item) => Boolean(item[FIELDS.BrandingConfig.Enabled]))
      .sort((a, b) => String(b.Modified || '').localeCompare(String(a.Modified || '')));

    const row = enabledRows[0] || items[0];
    if (!row) {
      return undefined;
    }

    return {
      id: Number(row[FIELDS.Common.Id] || 0),
      title: String(row[FIELDS.Common.Title] || ''),
      enabled: Boolean(row[FIELDS.BrandingConfig.Enabled]),
      logoUrl: this._normalizeUrlValue(row[FIELDS.BrandingConfig.LogoUrl]),
      headerRow1Bg: this._stringOrUndefined(row[FIELDS.BrandingConfig.HeaderRow1Bg]),
      headerRow2Bg: this._stringOrUndefined(row[FIELDS.BrandingConfig.HeaderRow2Bg]),
      middleRowBg: this._stringOrUndefined(row[FIELDS.BrandingConfig.MiddleRowBg]),
      hoverColor: this._stringOrUndefined(row[FIELDS.BrandingConfig.HoverColor]),
      searchPlaceholder: this._stringOrUndefined(row[FIELDS.BrandingConfig.SearchPlaceholder]),
      footerBg: this._stringOrUndefined(row[FIELDS.BrandingConfig.FooterBg]),
      footerTextColor: this._stringOrUndefined(row[FIELDS.BrandingConfig.FooterTextColor]),
      copyrightText: this._stringOrUndefined(row[FIELDS.BrandingConfig.CopyrightText]),
      useUnsupportedHideNativeHeader: Boolean(row[FIELDS.BrandingConfig.UseUnsupportedHideNativeHeader]),
      cacheTtlMinutes: Number(row[FIELDS.BrandingConfig.CacheTtlMinutes] || 0),
      configVersion: this._stringOrUndefined(row[FIELDS.BrandingConfig.ConfigVersion]),
      modified: this._stringOrUndefined(row.Modified)
    };
  }

  private async _getGlobalNav(errors: string[]): Promise<IGlobalNavItem[]> {
    const items = await this._getItems(LISTS.GlobalNav, [
      FIELDS.Common.Id,
      FIELDS.Common.Title,
      FIELDS.GlobalNav.Url,
      FIELDS.GlobalNav.Order0,
      FIELDS.GlobalNav.MenuType,
      FIELDS.GlobalNav.ParentId,
      FIELDS.GlobalNav.MegaColumn,
      FIELDS.GlobalNav.Enabled,
      FIELDS.GlobalNav.AudienceGroups,
      FIELDS.GlobalNav.OpenInNewTab,
      FIELDS.GlobalNav.IconName
    ], errors);

    return items
      .filter((item) => item[FIELDS.GlobalNav.Enabled] !== false)
      .sort((a, b) => Number(a[FIELDS.GlobalNav.Order0] || 0) - Number(b[FIELDS.GlobalNav.Order0] || 0))
      .map((item) => ({
        id: Number(item[FIELDS.Common.Id] || 0),
        title: String(item[FIELDS.Common.Title] || ''),
        url: this._normalizeUrlValue(item[FIELDS.GlobalNav.Url]),
        order0: Number(item[FIELDS.GlobalNav.Order0] || 0),
        menuType: this._stringOrUndefined(item[FIELDS.GlobalNav.MenuType]),
        parentId: Number(item[FIELDS.GlobalNav.ParentId] || 0) || undefined,
        megaColumn: Number(item[FIELDS.GlobalNav.MegaColumn] || 0) || undefined,
        enabled: Boolean(item[FIELDS.GlobalNav.Enabled]),
        audienceGroups: this._stringOrUndefined(item[FIELDS.GlobalNav.AudienceGroups]),
        openInNewTab: Boolean(item[FIELDS.GlobalNav.OpenInNewTab]),
        iconName: this._stringOrUndefined(item[FIELDS.GlobalNav.IconName])
      }));
  }

  private async _getDivisionNav(errors: string[]): Promise<IDivisionNavItem[]> {
    const items = await this._getItems(LISTS.DivisionNav, [
      FIELDS.Common.Id,
      FIELDS.Common.Title,
      FIELDS.DivisionNav.Url,
      FIELDS.DivisionNav.Order0,
      FIELDS.DivisionNav.MenuType,
      FIELDS.DivisionNav.ParentId,
      FIELDS.DivisionNav.MegaColumn,
      FIELDS.DivisionNav.Enabled,
      FIELDS.DivisionNav.AudienceGroups,
      FIELDS.DivisionNav.OpenInNewTab,
      FIELDS.DivisionNav.IconName,
      FIELDS.DivisionNav.HubSiteId,
      FIELDS.DivisionNav.DivisionKey
    ], errors);

    return items
      .filter((item) => item[FIELDS.DivisionNav.Enabled] !== false)
      .sort((a, b) => Number(a[FIELDS.DivisionNav.Order0] || 0) - Number(b[FIELDS.DivisionNav.Order0] || 0))
      .map((item) => ({
        id: Number(item[FIELDS.Common.Id] || 0),
        title: String(item[FIELDS.Common.Title] || ''),
        url: this._normalizeUrlValue(item[FIELDS.DivisionNav.Url]),
        order0: Number(item[FIELDS.DivisionNav.Order0] || 0),
        menuType: this._stringOrUndefined(item[FIELDS.DivisionNav.MenuType]),
        parentId: Number(item[FIELDS.DivisionNav.ParentId] || 0) || undefined,
        megaColumn: Number(item[FIELDS.DivisionNav.MegaColumn] || 0) || undefined,
        enabled: Boolean(item[FIELDS.DivisionNav.Enabled]),
        audienceGroups: this._stringOrUndefined(item[FIELDS.DivisionNav.AudienceGroups]),
        openInNewTab: Boolean(item[FIELDS.DivisionNav.OpenInNewTab]),
        iconName: this._stringOrUndefined(item[FIELDS.DivisionNav.IconName]),
        hubSiteId: this._stringOrUndefined(item[FIELDS.DivisionNav.HubSiteId]),
        divisionKey: this._stringOrUndefined(item[FIELDS.DivisionNav.DivisionKey])
      }));
  }

  private async _getFooterLinks(errors: string[]): Promise<IFooterLinkItem[]> {
    const items = await this._getItems(LISTS.FooterLinks, [
      FIELDS.Common.Id,
      FIELDS.Common.Title,
      FIELDS.FooterLinks.Url,
      FIELDS.FooterLinks.Order0,
      FIELDS.FooterLinks.Enabled
    ], errors);

    return items
      .filter((item) => item[FIELDS.FooterLinks.Enabled] !== false)
      .sort((a, b) => Number(a[FIELDS.FooterLinks.Order0] || 0) - Number(b[FIELDS.FooterLinks.Order0] || 0))
      .map((item) => ({
        id: Number(item[FIELDS.Common.Id] || 0),
        title: String(item[FIELDS.Common.Title] || ''),
        url: this._normalizeUrlValue(item[FIELDS.FooterLinks.Url]),
        order0: Number(item[FIELDS.FooterLinks.Order0] || 0),
        enabled: Boolean(item[FIELDS.FooterLinks.Enabled])
      }));
  }

  private async _getHubDivisionMappings(errors: string[]): Promise<IHubDivisionMappingItem[]> {
    const items = await this._getItems(LISTS.HubDivisionMapping, [
      FIELDS.Common.Id,
      FIELDS.Common.Title,
      FIELDS.HubDivisionMapping.HubSiteId,
      FIELDS.HubDivisionMapping.DivisionKey,
      FIELDS.HubDivisionMapping.DivisionName
    ], errors);

    return items.map((item) => ({
      id: Number(item[FIELDS.Common.Id] || 0),
      title: String(item[FIELDS.Common.Title] || ''),
      hubSiteId: this._stringOrUndefined(item[FIELDS.HubDivisionMapping.HubSiteId]),
      divisionKey: this._stringOrUndefined(item[FIELDS.HubDivisionMapping.DivisionKey]),
      divisionName: this._stringOrUndefined(item[FIELDS.HubDivisionMapping.DivisionName])
    }));
  }

  private async _getItems(listTitle: string, selectFields: string[], errors: string[]): Promise<Array<Record<string, unknown>>> {
    const encodedListTitle = listTitle.replace(/'/g, "''");
    const seen: Record<string, boolean> = {};
    const uniqueSelectFields: string[] = [];
    selectFields.forEach((field) => {
      if (!seen[field]) {
        seen[field] = true;
        uniqueSelectFields.push(field);
      }
    });
    const select = uniqueSelectFields.join(',');
    const endpoint =
      `${this.configSiteUrl}/_api/web/lists/getByTitle('${encodedListTitle}')/items?` +
      `$top=5000&$select=${select}`;

    try {
      const response = await this.context.spHttpClient.get(
        endpoint,
        SPHttpClient.configurations.v1,
        this._jsonRequestOptions
      );

      if (!response.ok) {
        errors.push(`Failed to read items for list '${listTitle}' (HTTP ${response.status}) from ${this.configSiteUrl}.`);
        return [];
      }

      const json: { value?: Array<Record<string, unknown>> } = await response.json();
      return json.value || [];
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`Failed to parse items for list '${listTitle}' on ${this.configSiteUrl}: ${message}`);
      return [];
    }
  }

  private _normalizeUrlValue(value: unknown): ISharePointUrlValue | undefined {
    if (!value) {
      return undefined;
    }
    if (typeof value === 'string') {
      return { Url: value };
    }

    const maybeObj = value as { Url?: string; Description?: string };
    if (typeof maybeObj.Url === 'string') {
      return {
        Url: maybeObj.Url,
        Description: maybeObj.Description
      };
    }

    return undefined;
  }

  private _stringOrUndefined(value: unknown): string | undefined {
    if (value === null || value === undefined) {
      return undefined;
    }
    const normalized = String(value).trim();
    return normalized.length > 0 ? normalized : undefined;
  }
}
