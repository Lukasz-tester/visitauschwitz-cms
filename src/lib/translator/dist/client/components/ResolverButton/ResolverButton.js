import { jsx as _jsx } from "react/jsx-runtime";
import { Button, useTranslation } from '@payloadcms/ui';
import { useTranslator } from '../../providers/Translator/context';
export const ResolverButton = ({ resolver: { key: resolverKey } })=>{
    const { openTranslator } = useTranslator();
    const { t } = useTranslation();
    const handleClick = ()=>openTranslator({
            resolverKey
        });
    return /*#__PURE__*/ _jsx(Button, {
        onClick: handleClick,
        children: t(`plugin-translator:resolver_${resolverKey}_buttonLabel`)
    });
};

//# sourceMappingURL=ResolverButton.js.map