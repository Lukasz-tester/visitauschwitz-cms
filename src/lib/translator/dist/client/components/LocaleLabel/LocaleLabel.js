import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getTranslation } from '@payloadcms/translations';
import { ChevronIcon, useTranslation } from '@payloadcms/ui';
const baseClass = 'localizer-button';
export const LocaleLabel = ({ locale })=>{
    const { i18n, t } = useTranslation();
    return /*#__PURE__*/ _jsxs("div", {
        "aria-label": t('general:locale'),
        className: baseClass,
        children: [
            /*#__PURE__*/ _jsx("div", {
                className: `${baseClass}__label`,
                children: `${t('general:locale')}:`
            }),
            "  ",
            /*#__PURE__*/ _jsx("span", {
                className: `${baseClass}__current-label`,
                children: `${getTranslation(locale.label, i18n)}`
            }),
            " ",
            /*#__PURE__*/ _jsx(ChevronIcon, {
                className: `${baseClass}__chevron`
            })
        ]
    });
};

//# sourceMappingURL=LocaleLabel.js.map