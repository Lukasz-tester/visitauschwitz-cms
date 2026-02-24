import type { Locale } from 'payload';
import type { TranslateResolver } from '../../../resolvers/types';
type TranslatorContextData = {
    closeTranslator: () => void;
    localeToTranslateFrom: string;
    localesOptions: Locale[];
    modalSlug: string;
    openTranslator: (args: {
        resolverKey: string;
    }) => void;
    resolver: TranslateResolver | null;
    resolverT: (key: 'buttonLabel' | 'errorMessage' | 'modalTitle' | 'submitButtonLabelEmpty' | 'submitButtonLabelFull' | 'successMessage') => string;
    setLocaleToTranslateFrom: (code: string) => void;
    submit: (args: {
        emptyOnly: boolean;
    }) => Promise<void>;
};
export declare const TranslatorContext: import("react").Context<TranslatorContextData | null>;
export declare const useTranslator: () => TranslatorContextData;
export {};
//# sourceMappingURL=context.d.ts.map