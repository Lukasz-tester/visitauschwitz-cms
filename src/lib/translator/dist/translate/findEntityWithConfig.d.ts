import type { PayloadRequest, SanitizedCollectionConfig, SanitizedGlobalConfig, TypeWithID } from 'payload';
type Args = {
    collectionSlug?: string;
    globalSlug?: string;
    id?: number | string;
    locale: string;
    overrideAccess?: boolean;
    req: PayloadRequest;
};
export declare const findEntityWithConfig: (args: Args) => Promise<{
    config: SanitizedCollectionConfig | SanitizedGlobalConfig;
    doc: Record<string, unknown> & TypeWithID;
}>;
export {};
//# sourceMappingURL=findEntityWithConfig.d.ts.map