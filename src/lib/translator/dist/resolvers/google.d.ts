import type { TranslateResolver } from './types';
export type GoogleResolverConfig = {
    apiKey: string;
    /**
     * How many texts to include into 1 request
     * @default 100
     */
    chunkLength?: number;
};
export declare const googleResolver: ({ apiKey, chunkLength, }: GoogleResolverConfig) => TranslateResolver;
//# sourceMappingURL=google.d.ts.map