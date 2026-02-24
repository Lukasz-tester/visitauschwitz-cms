import type { PayloadRequest, TypeWithID } from 'payload';
type Args = {
    collectionSlug?: string;
    data: Record<string, any>;
    depth?: number;
    globalSlug?: string;
    id?: number | string;
    locale: string;
    overrideAccess?: boolean;
    req: PayloadRequest;
};
export declare const updateEntity: ({ collectionSlug, data, depth: incomingDepth, globalSlug, id, locale, overrideAccess, req, }: Args) => Promise<Record<string, unknown> & TypeWithID>;
export {};
//# sourceMappingURL=updateEntity.d.ts.map