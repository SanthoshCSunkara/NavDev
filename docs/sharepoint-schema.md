# SharePoint Schema (Authoritative)

Source: user-provided authoritative schema / REST-derived internal names.

## Lists used by this solution

| List Title | GUID |
|---|---|
| BrandingConfig | d6999551-c7d8-49ef-97c2-caa34e74d339 |
| GlobalNav | be6e1250-a9a5-4d95-87e6-eb50366615d7 |
| DivisionNav | 1fb6e969-24ee-4e2c-84ae-6b990d33e744 |
| FooterLinks | 556f9354-f580-499f-831d-6407cd3136a6 |
| HubDivisionMapping | d7b2e2ac-4c11-4fc3-b2a5-47f21fc6a130 |

## BrandingConfig – Fields

| Display Title | InternalName | TypeAsString |
|---|---|---|
| Title | Title | Text |
| Enabled | Enabled | Boolean |
| LogoUrl | LogoUrl | URL |
| HeaderRow1Bg | HeaderRow1Bg | Text |
| HeaderRow2Bg | HeaderRow2Bg | Text |
| MiddleRowBg | MiddleRowBg | Text |
| HoverColor | HoverColor | Text |
| SearchPlaceholder | SearchPlaceholder | Text |
| FooterBg | FooterBg | Text |
| FooterTextColor | FooterTextColor | Text |
| CopyrightText | CopyrightText | Note |
| UseUnsupportedHideNativeHeader | UseUnsupportedHideNativeHeader | Boolean |
| CacheTtlMinutes | CacheTtlMinutes | Number |
| ConfigVersion | ConfigVersion | Text |

## GlobalNav – Fields

| Display Title | InternalName | TypeAsString |
|---|---|---|
| Title | Title | Text |
| Url | Url | URL |
| Order | Order0 | Number |
| MenuType | MenuType | Choice |
| ParentId | ParentId | Lookup |
| MegaColumn | MegaColumn | Number |
| Enabled | Enabled | Boolean |
| AudienceGroups | AudienceGroups | Note |
| OpenInNewTab | OpenInNewTab | Boolean |
| IconName | IconName | Text |

## DivisionNav – Fields

| Display Title | InternalName | TypeAsString |
|---|---|---|
| Title | Title | Text |
| Url | Url | URL |
| Order | Order0 | Number |
| MenuType | MenuType | Choice |
| ParentId | ParentId | Lookup |
| MegaColumn | MegaColumn | Number |
| Enabled | Enabled | Boolean |
| AudienceGroups | AudienceGroups | Note |
| OpenInNewTab | OpenInNewTab | Boolean |
| IconName | IconName | Text |
| HubSiteId | HubSiteId | Text |
| DivisionKey | DivisionKey | Choice |

## FooterLinks – Fields

| Display Title | InternalName | TypeAsString |
|---|---|---|
| Title | Title | Text |
| Url | Url | URL |
| Order | Order0 | Number |
| Enabled | Enabled | Boolean |

## HubDivisionMapping – Fields

| Display Title | InternalName | TypeAsString |
|---|---|---|
| Title | Title | Text |
| HubSiteId | HubSiteId | Text |
| DivisionKey | DivisionKey | Choice |
| DivisionName | DivisionName | Text |
