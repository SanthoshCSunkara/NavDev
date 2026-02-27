export const CONFIG_SITE_URL = 'https://7sklww.sharepoint.com/sites/IntranetConfig';

export const LISTS = {
  BrandingConfig: 'BrandingConfig',
  GlobalNav: 'GlobalNav',
  DivisionNav: 'DivisionNav',
  FooterLinks: 'FooterLinks',
  HubDivisionMapping: 'HubDivisionMapping'
} as const;

export const LIST_GUIDS = {
  BrandingConfig: 'd6999551-c7d8-49ef-97c2-caa34e74d339',
  GlobalNav: 'be6e1250-a9a5-4d95-87e6-eb50366615d7',
  DivisionNav: '1fb6e969-24ee-4e2c-84ae-6b990d33e744',
  FooterLinks: '556f9354-f580-499f-831d-6407cd3136a6',
  HubDivisionMapping: 'd7b2e2ac-4c11-4fc3-b2a5-47f21fc6a130'
} as const;

export const FIELDS = {
  Common: {
    Id: 'Id',
    Title: 'Title'
  },
  BrandingConfig: {
    Enabled: 'Enabled',
    LogoUrl: 'LogoUrl',
    HeaderRow1Bg: 'HeaderRow1Bg',
    HeaderRow2Bg: 'HeaderRow2Bg',
    MiddleRowBg: 'MiddleRowBg',
    HoverColor: 'HoverColor',
    SearchPlaceholder: 'SearchPlaceholder',
    FooterBg: 'FooterBg',
    FooterTextColor: 'FooterTextColor',
    CopyrightText: 'CopyrightText',
    UseUnsupportedHideNativeHeader: 'UseUnsupportedHideNativeHeader',
    CacheTtlMinutes: 'CacheTtlMinutes',
    ConfigVersion: 'ConfigVersion'
  },
  GlobalNav: {
    Url: 'Url',
    Order0: 'Order0',
    MenuType: 'MenuType',
    ParentId: 'ParentId',
    MegaColumn: 'MegaColumn',
    Enabled: 'Enabled',
    AudienceGroups: 'AudienceGroups',
    OpenInNewTab: 'OpenInNewTab',
    IconName: 'IconName'
  },
  DivisionNav: {
    Url: 'Url',
    Order0: 'Order0',
    MenuType: 'MenuType',
    ParentId: 'ParentId',
    MegaColumn: 'MegaColumn',
    Enabled: 'Enabled',
    AudienceGroups: 'AudienceGroups',
    OpenInNewTab: 'OpenInNewTab',
    IconName: 'IconName',
    HubSiteId: 'HubSiteId',
    DivisionKey: 'DivisionKey'
  },
  FooterLinks: {
    Url: 'Url',
    Order0: 'Order0',
    Enabled: 'Enabled'
  },
  HubDivisionMapping: {
    HubSiteId: 'HubSiteId',
    DivisionKey: 'DivisionKey',
    DivisionName: 'DivisionName'
  }
} as const;

export const REQUIRED_FIELDS_BY_LIST: Record<string, string[]> = {
  [LISTS.BrandingConfig]: [
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
    FIELDS.BrandingConfig.ConfigVersion
  ],
  [LISTS.GlobalNav]: [
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
  ],
  [LISTS.DivisionNav]: [
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
  ],
  [LISTS.FooterLinks]: [
    FIELDS.Common.Title,
    FIELDS.FooterLinks.Url,
    FIELDS.FooterLinks.Order0,
    FIELDS.FooterLinks.Enabled
  ],
  [LISTS.HubDivisionMapping]: [
    FIELDS.Common.Title,
    FIELDS.HubDivisionMapping.HubSiteId,
    FIELDS.HubDivisionMapping.DivisionKey,
    FIELDS.HubDivisionMapping.DivisionName
  ]
};
