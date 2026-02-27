import * as React from 'react';

import { ICorpChromeConfig } from '../models/ICorpChromeConfig';
import styles from '../styles/Header.module.scss';

export interface IHeaderProps {
  config: ICorpChromeConfig;
}

export const Header: React.FC<IHeaderProps> = ({ config }) => {
  const appTitle = config.brandingConfig?.title || 'Intranet';
  const searchPlaceholder = config.brandingConfig?.searchPlaceholder || 'Search';
  const hasSchemaErrors = config.errors.length > 0;
  const queryParams = new URLSearchParams(window.location.search);
  const showDiagnosticBanner =
    queryParams.get('debug') === 'true' ||
    queryParams.has('debugManifestsFile') ||
    queryParams.get('corpChromeDiag') === '1';

  return (
    <div className={styles.headerRoot} role='banner' aria-label='Corporate header'>
      {showDiagnosticBanner && (
        <div className={styles.diagnosticBanner} role='status'>
          CorpChrome extension active (diagnostic mode)
        </div>
      )}
      {hasSchemaErrors && (
        <div role='alert'>
          Configuration issue detected. Please contact support and check browser console logs.
        </div>
      )}
      <div className={styles.row}>
        <div className={styles.logo}>{appTitle}</div>
        <nav className={styles.nav} aria-label='Global navigation'>
          {config.globalNav.map((item) => (
            <a
              key={item.id}
              className={styles.navLink}
              href={item.url?.Url || '#'}
              target={item.openInNewTab ? '_blank' : '_self'}
              rel={item.openInNewTab ? 'noreferrer noopener' : undefined}
            >
              {item.title}
            </a>
          ))}
        </nav>
        <div className={styles.spacer} />
        <div className={styles.search}>
          <input
            type='search'
            placeholder={searchPlaceholder}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const term = (e.currentTarget.value || '').trim();
                if (!term) return;
                window.location.href = `${window.location.origin}/_layouts/15/search.aspx?q=${encodeURIComponent(
                  term
                )}`;
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};