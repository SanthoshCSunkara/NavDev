# corp-chrome

## Summary

Short summary on functionality and used technologies.

[picture of the solution in action, if possible]

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.19.0-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Prerequisites

> Any special pre-requisites?

## Solution

| Solution    | Author(s)                                               |
| ----------- | ------------------------------------------------------- |
| folder name | Author details (name, company, twitter alias with link) |

## Version history

| Version | Date             | Comments        |
| ------- | ---------------- | --------------- |
| 1.1     | March 10, 2021   | Update comment  |
| 1.0     | January 29, 2021 | Initial release |

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder
- in the command-line run:
  - **npm install**
  - **gulp serve**

> Include any additional steps as needed.

## Local debug workflow (SPFx Application Customizer)

### Why "Error loading debug manifests" happens

When you open a SharePoint page with debug query params, the page tries to load:

- `https://localhost:4321/temp/manifests.js`

This only works while the local SPFx dev server is running. In this repo, the port comes from `config/serve.json`:

- `"port": 4321`
- `"https": true`

If `gulp serve --nobrowser` is stopped, localhost manifests are unavailable and SharePoint shows the debug manifest error.

### Debug URL (requires gulp running)

1. Trust local cert once:
   - `gulp trust-dev-cert`
2. Start local server:
   - `gulp serve --nobrowser`
3. Open a debug URL that includes localhost manifests, for example:
   - `https://7sklww.sharepoint.com/sites/IntranetConfig/SitePages/Home.aspx?debug=true&noredir=true&loadSPFX=true&debugManifestsFile=https://localhost:4321/temp/manifests.js`

4. Verify extension startup logs in browser console:
   - `[CorpChrome] onInit fired`
   - Optional diagnostics banner appears when query has `debug=true`, `debugManifestsFile=...`, or `corpChromeDiag=1`

### Normal URL (no localhost dependency)

For normal browsing, open the page without these query params:

- `debug=true`
- `loadSPFX=true`
- `debugManifestsFile=`
- `customActions=`

Example clean URL:

- `https://7sklww.sharepoint.com/sites/IntranetConfig/SitePages/Home.aspx`

## Extension registration checklist (IntranetConfig)

- Manifest component id: `57c486f0-2b42-4a16-a122-4f1e0aee8b41`
- Custom Action location: `ClientSideExtension.ApplicationCustomizer`
- Required properties:
  - `{"configSiteUrl":"https://7sklww.sharepoint.com/sites/IntranetConfig"}`

PnP validation:

```powershell
Connect-PnPOnline -Url "https://7sklww.sharepoint.com/sites/IntranetConfig" -Interactive
Get-PnPCustomAction -Scope Web |
  ? { $_.Location -eq "ClientSideExtension.ApplicationCustomizer" } |
  Select Title,Name,Location,ClientSideComponentId,ClientSideComponentProperties,Sequence
```

If missing, add it:

```powershell
Add-PnPCustomAction -Scope Web \
  -Title "CorpChrome" \
  -Name "CorpChrome" \
  -Location "ClientSideExtension.ApplicationCustomizer" \
  -ClientSideComponentId "57c486f0-2b42-4a16-a122-4f1e0aee8b41" \
  -ClientSideComponentProperties '{"configSiteUrl":"https://7sklww.sharepoint.com/sites/IntranetConfig"}' \
  -Sequence 1000
```

## Features

Description of the extension that expands upon high-level summary above.

This extension illustrates the following concepts:

- topic 1
- topic 2
- topic 3

> Notice that better pictures and documentation will increase the sample usage and the value you are providing for others. Thanks for your submissions advance.

> Share your web part with others through Microsoft 365 Patterns and Practices program to get visibility and exposure. More details on the community, open-source projects and other activities from http://aka.ms/m365pnp.

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development
