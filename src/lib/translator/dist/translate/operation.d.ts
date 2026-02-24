import { type Payload, type PayloadRequest } from 'payload';
import type { TranslateArgs, TranslateResult } from './types';
export type TranslateOperationArgs = ({
    payload: Payload;
} | {
    req: PayloadRequest;
}) & TranslateArgs;
export declare const translateOperation: (args: TranslateOperationArgs) => Promise<TranslateResult>;
//# sourceMappingURL=operation.d.ts.map