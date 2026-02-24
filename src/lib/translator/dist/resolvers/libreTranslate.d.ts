import type { TranslateResolver } from './types';
export type LibreResolverConfig = {
    apiKey: string;
    /**
     * How many texts to include into 1 request
     * @default 100
     */
    chunkLength?: number;
    /**
     * Custom url for the libre translate instance
     * @default "https://libretranslate.com/translate"
     */
    url?: string;
};
export declare const libreResolver: ({ apiKey, chunkLength, url, }: LibreResolverConfig) => TranslateResolver;
//# sourceMappingURL=libreTranslate.d.ts.map