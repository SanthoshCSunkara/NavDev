import { override } from '@microsoft/decorators';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import { Log } from '@microsoft/sp-core-library';
import * as React from 'react';
import * as ReactDom from 'react-dom';

import { Header } from './components/Header';
import { Footer } from './components/Footer';

import { CorpChromeConfigService } from './services/CorpChromeConfigService';
import { ICorpChromeConfig } from './models/ICorpChromeConfig';
import { CONFIG_SITE_URL } from '../../common/spSchema';

const LOG_SOURCE = 'CorpChromeApplicationCustomizer';

export interface ICorpChromeApplicationCustomizerProperties {
  configSiteUrl?: string;
}

export default class CorpChromeApplicationCustomizer
  extends BaseApplicationCustomizer<ICorpChromeApplicationCustomizerProperties> {

  private _topPlaceholder?: PlaceholderContent;
  private _bottomPlaceholder?: PlaceholderContent;

  private _configService?: CorpChromeConfigService;
  private _config?: ICorpChromeConfig;

  private readonly _onWindowError = (event: ErrorEvent): void => {
    // eslint-disable-next-line no-console
    console.error('[CorpChrome] window error', event.error || event.message, event);
  };

  private readonly _onUnhandledRejection = (event: PromiseRejectionEvent): void => {
    // eslint-disable-next-line no-console
    console.error('[CorpChrome] unhandledrejection', event.reason, event);
  };

  @override
  public async onInit(): Promise<void> {
    // eslint-disable-next-line no-console
    console.info('[CorpChrome] onInit fired', {
      url: window.location.href,
      time: new Date().toISOString()
    });

    window.addEventListener('error', this._onWindowError);
    window.addEventListener('unhandledrejection', this._onUnhandledRejection);

    Log.info(LOG_SOURCE, 'Initialized');

    const configSiteUrl = this.properties?.configSiteUrl || CONFIG_SITE_URL;
    this._configService = new CorpChromeConfigService(this.context, configSiteUrl);

    // SPA navigation support (re-render when placeholders change)
    this.context.placeholderProvider.changedEvent.add(this, this._renderChrome);

    // Initial render
    await this._renderChrome();

    return;
  }

  @override
  public onDispose(): void {
    this.context.placeholderProvider.changedEvent.remove(this, this._renderChrome);
    window.removeEventListener('error', this._onWindowError);
    window.removeEventListener('unhandledrejection', this._onUnhandledRejection);

    // Unmount React + dispose placeholders
    this._disposeTop();
    this._disposeBottom();

    Log.info(LOG_SOURCE, 'Disposed');
  }

  private _disposeTop(): void {
    if (this._topPlaceholder) {
      ReactDom.unmountComponentAtNode(this._topPlaceholder.domElement);
      this._topPlaceholder.dispose();
      this._topPlaceholder = undefined;
    }
  }

  private _disposeBottom(): void {
    if (this._bottomPlaceholder) {
      ReactDom.unmountComponentAtNode(this._bottomPlaceholder.domElement);
      this._bottomPlaceholder.dispose();
      this._bottomPlaceholder = undefined;
    }
  }

  private _renderChrome = async (): Promise<void> => {
    try {
      if (!this._configService) return;

      // Load config once; refresh only if needed later (you can add invalidation rules)
      if (!this._config) {
        this._config = await this._configService.getConfig();
      }
      const config = this._config;
      if (!config) {
        return;
      }

      // TOP placeholder
      if (!this._topPlaceholder) {
        this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
          PlaceholderName.Top,
          { onDispose: this._disposeTop }
        );
      }
      if (this._topPlaceholder) {
        const headerEl = React.createElement(Header, { config });
        ReactDom.render(headerEl, this._topPlaceholder.domElement);
      } else {
        Log.warn(LOG_SOURCE, 'Top placeholder not found');
      }

      // BOTTOM placeholder
      if (!this._bottomPlaceholder) {
        this._bottomPlaceholder = this.context.placeholderProvider.tryCreateContent(
          PlaceholderName.Bottom,
          { onDispose: this._disposeBottom }
        );
      }
      if (this._bottomPlaceholder) {
        const footerEl = React.createElement(Footer, { config });
        ReactDom.render(footerEl, this._bottomPlaceholder.domElement);
      } else {
        Log.warn(LOG_SOURCE, 'Bottom placeholder not found');
      }

    } catch (err) {
      // No empty catch. This keeps lint happy and gives you signal.
      Log.error(LOG_SOURCE, err as Error);
    }
  };
}