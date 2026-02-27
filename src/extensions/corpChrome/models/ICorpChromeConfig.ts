export interface ISharePointUrlValue {
  Url: string;
  Description?: string;
}

export interface IBrandingConfigItem {
  id: number;
  title: string;
  enabled: boolean;
  logoUrl?: ISharePointUrlValue;
  headerRow1Bg?: string;
  headerRow2Bg?: string;
  middleRowBg?: string;
  hoverColor?: string;
  searchPlaceholder?: string;
  footerBg?: string;
  footerTextColor?: string;
  copyrightText?: string;
  useUnsupportedHideNativeHeader: boolean;
  cacheTtlMinutes?: number;
  configVersion?: string;
  modified?: string;
}

export interface IGlobalNavItem {
  id: number;
  title: string;
  url?: ISharePointUrlValue;
  order0?: number;
  menuType?: string;
  parentId?: number;
  megaColumn?: number;
  enabled?: boolean;
  audienceGroups?: string;
  openInNewTab?: boolean;
  iconName?: string;
}

export interface IDivisionNavItem {
  id: number;
  title: string;
  url?: ISharePointUrlValue;
  order0?: number;
  menuType?: string;
  parentId?: number;
  megaColumn?: number;
  enabled?: boolean;
  audienceGroups?: string;
  openInNewTab?: boolean;
  iconName?: string;
  hubSiteId?: string;
  divisionKey?: string;
}

export interface IFooterLinkItem {
  id: number;
  title: string;
  url?: ISharePointUrlValue;
  order0?: number;
  enabled?: boolean;
}

export interface IHubDivisionMappingItem {
  id: number;
  title: string;
  hubSiteId?: string;
  divisionKey?: string;
  divisionName?: string;
}

export interface ICorpChromeConfig {
  brandingConfig?: IBrandingConfigItem;
  globalNav: IGlobalNavItem[];
  divisionNav: IDivisionNavItem[];
  footerLinks: IFooterLinkItem[];
  hubDivisionMapping: IHubDivisionMappingItem[];
  errors: string[];
}
