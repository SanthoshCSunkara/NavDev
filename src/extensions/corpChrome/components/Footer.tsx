import * as React from 'react';

import { ICorpChromeConfig } from '../models/ICorpChromeConfig';
import styles from '../styles/Footer.module.scss';

export interface IFooterProps {
  config: ICorpChromeConfig;
}

export const Footer: React.FC<IFooterProps> = ({ config }) => {
  const copyright =
    config.brandingConfig?.copyrightText ||
    `© ${new Date().getFullYear()} Corp Chrome`;

  return (
    <div className={styles.footerRoot} role='contentinfo' aria-label='Corporate footer'>
      <div className={styles.inner}>
        {config.footerLinks.map((item) => (
          <a key={item.id} className={styles.link} href={item.url?.Url || '#'}>
            {item.title}
          </a>
        ))}
        <div className={styles.spacer} />
        <span>{copyright}</span>
      </div>
    </div>
  );
};