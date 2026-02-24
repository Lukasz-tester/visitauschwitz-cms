import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getTranslation } from '@payloadcms/translations';
import { Button, Popup, PopupList, useTranslation } from '@payloadcms/ui';
import { useTranslator } from '../../providers/Translator/context';
import { LocaleLabel } from '../LocaleLabel';
export const Content = ()=>{
    const { localeToTranslateFrom: localeCodeToTranslateFrom, localesOptions, resolverT, setLocaleToTranslateFrom, submit } = useTranslator();
    const { i18n } = useTranslation();
    const localeToTranslateFrom = localesOptions.find((each)=>each.code === localeCodeToTranslateFrom);
    return /*#__PURE__*/ _jsxs("div", {
        className: 'translator__content',
        children: [
            /*#__PURE__*/ _jsx("h2", {
                children: resolverT('modalTitle')
            }),
            localeToTranslateFrom && /*#__PURE__*/ _jsx(Popup, {
                button: /*#__PURE__*/ _jsx(LocaleLabel, {
                    locale: localeToTranslateFrom
                }),
                horizontalAlign: "center",
                render: ({ close })=>/*#__PURE__*/ _jsx(PopupList.ButtonGroup, {
                        children: localesOptions.map((option)=>{
                            const label = getTranslation(option.label, i18n);
                            return /*#__PURE__*/ _jsxs(PopupList.Button, {
                                active: option.code === localeCodeToTranslateFrom,
                                onClick: ()=>{
                                    setLocaleToTranslateFrom(option.code);
                                    close();
                                },
                                children: [
                                    label,
                                    label !== option.code && ` (${option.code})`
                                ]
                            }, option.code);
                        })
                    }),
                verticalAlign: "bottom"
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: 'translator__buttons',
                children: [
                    /*#__PURE__*/ _jsx(Button, {
                        onClick: ()=>submit({
                                emptyOnly: false
                            }),
                        children: resolverT('submitButtonLabelFull')
                    }),
                    /*#__PURE__*/ _jsx(Button, {
                        onClick: ()=>submit({
                                emptyOnly: true
                            }),
                        children: resolverT('submitButtonLabelEmpty')
                    })
                ]
            })
        ]
    });
};

//# sourceMappingURL=Content.js.map