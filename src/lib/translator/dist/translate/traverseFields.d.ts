import type { Field } from 'payload';
import type { ValueToTranslate } from './types';
export declare const traverseFields: ({ dataFrom, emptyOnly, fields, localizedParent, siblingDataFrom, siblingDataTranslated, translatedData, valuesToTranslate, }: {
    dataFrom: Record<string, unknown>;
    emptyOnly?: boolean;
    fields: Field[];
    localizedParent?: boolean;
    siblingDataFrom?: Record<string, unknown>;
    siblingDataTranslated?: Record<string, unknown>;
    translatedData: Record<string, unknown>;
    valuesToTranslate: ValueToTranslate[];
}) => void;
//# sourceMappingURL=traverseFields.d.ts.map