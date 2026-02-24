import type { TranslateEndpointArgs, TranslateResult } from '../../translate/types';
export declare const createClient: ({ api, serverURL }: {
    api: string;
    serverURL: string;
}) => {
    translate: (args: TranslateEndpointArgs) => Promise<TranslateResult>;
};
//# sourceMappingURL=index.d.ts.map