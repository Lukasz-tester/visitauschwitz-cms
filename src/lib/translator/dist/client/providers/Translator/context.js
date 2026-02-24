import { createContext, useContext } from 'react';
export const TranslatorContext = createContext(null);
export const useTranslator = ()=>{
    const context = useContext(TranslatorContext);
    if (context === null) throw new Error('useTranslator must be used within TranslatorProvider');
    return context;
};

//# sourceMappingURL=context.js.map