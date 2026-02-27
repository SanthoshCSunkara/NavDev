param(
  [Parameter(Mandatory = $true)]
  [string]$SiteUrl,

  [string[]]$MenuTypeChoices,
  [string[]]$DivisionKeyChoices,

  [switch]$SkipHubDivisionMapping
)

$ErrorActionPreference = 'Stop'

if (-not (Get-Module -ListAvailable -Name PnP.PowerShell)) {
  throw "PnP.PowerShell module is required. Install-Module PnP.PowerShell -Scope CurrentUser"
}

Connect-PnPOnline -Url $SiteUrl -Interactive

function Ensure-List {
  param(
    [Parameter(Mandatory = $true)][string]$Title,
    [Parameter(Mandatory = $true)][string]$Template
  )

  $list = Get-PnPList -Identity $Title -ErrorAction SilentlyContinue
  if (-not $list) {
    Write-Host "Creating list: $Title"
    New-PnPList -Title $Title -Template $Template -OnQuickLaunch:$false | Out-Null
  }
  else {
    Write-Host "List already exists: $Title"
  }
}

function Ensure-Field {
  param(
    [Parameter(Mandatory = $true)][string]$List,
    [Parameter(Mandatory = $true)][string]$DisplayName,
    [Parameter(Mandatory = $true)][string]$InternalName,
    [Parameter(Mandatory = $true)][string]$Type,
    [string[]]$Choices,
    [string]$LookupList,
    [string]$LookupField
  )

  $field = Get-PnPField -List $List -Identity $InternalName -ErrorAction SilentlyContinue
  if ($field) {
    return
  }

  if ($Type -eq 'Choice') {
    if (-not $Choices -or $Choices.Count -eq 0) {
      throw "Choice values are required for $List.$InternalName"
    }
    Add-PnPField -List $List -DisplayName $DisplayName -InternalName $InternalName -Type Choice -Choices $Choices | Out-Null
    return
  }

  if ($Type -eq 'Lookup') {
    Add-PnPField -List $List -DisplayName $DisplayName -InternalName $InternalName -Type Lookup -LookupList $LookupList -LookupField $LookupField | Out-Null
    return
  }

  Add-PnPField -List $List -DisplayName $DisplayName -InternalName $InternalName -Type $Type | Out-Null
}

# Lists
Ensure-List -Title 'BrandingConfig' -Template 'GenericList'
Ensure-List -Title 'GlobalNav' -Template 'GenericList'
Ensure-List -Title 'DivisionNav' -Template 'GenericList'
Ensure-List -Title 'FooterLinks' -Template 'GenericList'
if (-not $SkipHubDivisionMapping) {
  Ensure-List -Title 'HubDivisionMapping' -Template 'GenericList'
}

# BrandingConfig
Ensure-Field -List 'BrandingConfig' -DisplayName 'Enabled' -InternalName 'Enabled' -Type 'Boolean'
Ensure-Field -List 'BrandingConfig' -DisplayName 'LogoUrl' -InternalName 'LogoUrl' -Type 'URL'
Ensure-Field -List 'BrandingConfig' -DisplayName 'HeaderRow1Bg' -InternalName 'HeaderRow1Bg' -Type 'Text'
Ensure-Field -List 'BrandingConfig' -DisplayName 'HeaderRow2Bg' -InternalName 'HeaderRow2Bg' -Type 'Text'
Ensure-Field -List 'BrandingConfig' -DisplayName 'MiddleRowBg' -InternalName 'MiddleRowBg' -Type 'Text'
Ensure-Field -List 'BrandingConfig' -DisplayName 'HoverColor' -InternalName 'HoverColor' -Type 'Text'
Ensure-Field -List 'BrandingConfig' -DisplayName 'SearchPlaceholder' -InternalName 'SearchPlaceholder' -Type 'Text'
Ensure-Field -List 'BrandingConfig' -DisplayName 'FooterBg' -InternalName 'FooterBg' -Type 'Text'
Ensure-Field -List 'BrandingConfig' -DisplayName 'FooterTextColor' -InternalName 'FooterTextColor' -Type 'Text'
Ensure-Field -List 'BrandingConfig' -DisplayName 'CopyrightText' -InternalName 'CopyrightText' -Type 'Note'
Ensure-Field -List 'BrandingConfig' -DisplayName 'UseUnsupportedHideNativeHeader' -InternalName 'UseUnsupportedHideNativeHeader' -Type 'Boolean'
Ensure-Field -List 'BrandingConfig' -DisplayName 'CacheTtlMinutes' -InternalName 'CacheTtlMinutes' -Type 'Number'
Ensure-Field -List 'BrandingConfig' -DisplayName 'ConfigVersion' -InternalName 'ConfigVersion' -Type 'Text'

# GlobalNav
Ensure-Field -List 'GlobalNav' -DisplayName 'Url' -InternalName 'Url' -Type 'URL'
Ensure-Field -List 'GlobalNav' -DisplayName 'Order' -InternalName 'Order0' -Type 'Number'
Ensure-Field -List 'GlobalNav' -DisplayName 'MenuType' -InternalName 'MenuType' -Type 'Choice' -Choices $MenuTypeChoices
Ensure-Field -List 'GlobalNav' -DisplayName 'ParentId' -InternalName 'ParentId' -Type 'Lookup' -LookupList 'GlobalNav' -LookupField 'ID'
Ensure-Field -List 'GlobalNav' -DisplayName 'MegaColumn' -InternalName 'MegaColumn' -Type 'Number'
Ensure-Field -List 'GlobalNav' -DisplayName 'Enabled' -InternalName 'Enabled' -Type 'Boolean'
Ensure-Field -List 'GlobalNav' -DisplayName 'AudienceGroups' -InternalName 'AudienceGroups' -Type 'Note'
Ensure-Field -List 'GlobalNav' -DisplayName 'OpenInNewTab' -InternalName 'OpenInNewTab' -Type 'Boolean'
Ensure-Field -List 'GlobalNav' -DisplayName 'IconName' -InternalName 'IconName' -Type 'Text'

# DivisionNav
Ensure-Field -List 'DivisionNav' -DisplayName 'Url' -InternalName 'Url' -Type 'URL'
Ensure-Field -List 'DivisionNav' -DisplayName 'Order' -InternalName 'Order0' -Type 'Number'
Ensure-Field -List 'DivisionNav' -DisplayName 'MenuType' -InternalName 'MenuType' -Type 'Choice' -Choices $MenuTypeChoices
Ensure-Field -List 'DivisionNav' -DisplayName 'ParentId' -InternalName 'ParentId' -Type 'Lookup' -LookupList 'DivisionNav' -LookupField 'ID'
Ensure-Field -List 'DivisionNav' -DisplayName 'MegaColumn' -InternalName 'MegaColumn' -Type 'Number'
Ensure-Field -List 'DivisionNav' -DisplayName 'Enabled' -InternalName 'Enabled' -Type 'Boolean'
Ensure-Field -List 'DivisionNav' -DisplayName 'AudienceGroups' -InternalName 'AudienceGroups' -Type 'Note'
Ensure-Field -List 'DivisionNav' -DisplayName 'OpenInNewTab' -InternalName 'OpenInNewTab' -Type 'Boolean'
Ensure-Field -List 'DivisionNav' -DisplayName 'IconName' -InternalName 'IconName' -Type 'Text'
Ensure-Field -List 'DivisionNav' -DisplayName 'HubSiteId' -InternalName 'HubSiteId' -Type 'Text'
Ensure-Field -List 'DivisionNav' -DisplayName 'DivisionKey' -InternalName 'DivisionKey' -Type 'Choice' -Choices $DivisionKeyChoices

# FooterLinks
Ensure-Field -List 'FooterLinks' -DisplayName 'Url' -InternalName 'Url' -Type 'URL'
Ensure-Field -List 'FooterLinks' -DisplayName 'Order' -InternalName 'Order0' -Type 'Number'
Ensure-Field -List 'FooterLinks' -DisplayName 'Enabled' -InternalName 'Enabled' -Type 'Boolean'

# HubDivisionMapping
if (-not $SkipHubDivisionMapping) {
  Ensure-Field -List 'HubDivisionMapping' -DisplayName 'HubSiteId' -InternalName 'HubSiteId' -Type 'Text'
  Ensure-Field -List 'HubDivisionMapping' -DisplayName 'DivisionKey' -InternalName 'DivisionKey' -Type 'Choice' -Choices $DivisionKeyChoices
  Ensure-Field -List 'HubDivisionMapping' -DisplayName 'DivisionName' -InternalName 'DivisionName' -Type 'Text'
}

Write-Host 'Provisioning complete.'
