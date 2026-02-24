import type { TranslateResolver } from './types';
export type OpenAIPrompt = (args: {
    localeFrom: string;
    localeTo: string;
    texts: string[];
}) => string;
export type OpenAIResolverConfig = {
    apiKey: string;
    baseUrl?: string;
    /**
     * How many texts to include into 1 request
     * @default 100
     */
    chunkLength?: number;
    /**
     * @default "gpt-3.5-turbo"
     */
    model?: string;
    prompt?: OpenAIPrompt;
};
export declare const openAIResolver: ({ apiKey, baseUrl, chunkLength, model, prompt, }: OpenAIResolverConfig) => TranslateResolver;
//# sourceMappingURL=openAI.d.ts.map