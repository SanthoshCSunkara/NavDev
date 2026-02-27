import { ICorpChromeConfig } from '../models/ICorpChromeConfig';

export interface ICorpChromeConfigService {
  getConfig(): Promise<ICorpChromeConfig>;
}