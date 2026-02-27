import { CONFIG_SITE_URL, FIELDS, LISTS } from '../../../common/spSchema';

export const DEFAULT_CONFIG_SITE_URL = CONFIG_SITE_URL;

export const CONFIG_LISTS = {
  brandingConfig: LISTS.BrandingConfig,
  globalNav: LISTS.GlobalNav,
  divisionNav: LISTS.DivisionNav,
  footerLinks: LISTS.FooterLinks,
  hubDivisionMapping: LISTS.HubDivisionMapping,
} as const;

export const CONFIG_FIELDS = {
  id: FIELDS.Common.Id,
  title: FIELDS.Common.Title,

  enabled: FIELDS.BrandingConfig.Enabled,
  logoUrl: FIELDS.BrandingConfig.LogoUrl,
  headerRow1Bg: FIELDS.BrandingConfig.HeaderRow1Bg,
  headerRow2Bg: FIELDS.BrandingConfig.HeaderRow2Bg,
  middleRowBg: FIELDS.BrandingConfig.MiddleRowBg,
  hoverColor: FIELDS.BrandingConfig.HoverColor,
  searchPlaceholder: FIELDS.BrandingConfig.SearchPlaceholder,
  footerBg: FIELDS.BrandingConfig.FooterBg,
  footerTextColor: FIELDS.BrandingConfig.FooterTextColor,
  copyrightText: FIELDS.BrandingConfig.CopyrightText,
  useUnsupportedHideNativeHeader: FIELDS.BrandingConfig.UseUnsupportedHideNativeHeader,
  cacheTtlMinutes: FIELDS.BrandingConfig.CacheTtlMinutes,
  configVersion: FIELDS.BrandingConfig.ConfigVersion,

  url: FIELDS.GlobalNav.Url,
  order0: FIELDS.GlobalNav.Order0,
  menuType: FIELDS.GlobalNav.MenuType,
  parentId: FIELDS.GlobalNav.ParentId,
  megaColumn: FIELDS.GlobalNav.MegaColumn,
  audienceGroups: FIELDS.GlobalNav.AudienceGroups,
  openInNewTab: FIELDS.GlobalNav.OpenInNewTab,
  iconName: FIELDS.GlobalNav.IconName,

  hubSiteId: FIELDS.DivisionNav.HubSiteId,
  divisionKey: FIELDS.DivisionNav.DivisionKey,
  divisionName: FIELDS.HubDivisionMapping.DivisionName
} as const;
