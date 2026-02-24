import type { Plugin } from 'payload';
import { translateOperation } from './translate/operation';
import type { TranslatorConfig } from './types';
export { copyResolver } from './resolvers/copy';
export { googleResolver } from './resolvers/google';
export { libreResolver } from './resolvers/libreTranslate';
export { openAIResolver } from './resolvers/openAI';
export * from './resolvers/types';
export { translateOperation };
export declare const translator: (pluginConfig: TranslatorConfig) => Plugin;
//# sourceMappingURL=index.d.ts.map