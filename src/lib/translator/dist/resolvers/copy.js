export const copyResolver = ()=>{
    return {
        key: 'copy',
        resolve: (args)=>{
            const { texts } = args;
            return {
                success: true,
                translatedTexts: texts
            };
        }
    };
};

//# sourceMappingURL=copy.js.map