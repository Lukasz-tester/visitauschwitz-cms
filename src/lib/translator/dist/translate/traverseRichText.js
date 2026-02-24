export const traverseRichText = ({ onText, root, siblingData })=>{
    siblingData = siblingData ?? root;
    if (siblingData.text) {
        onText(siblingData);
    }
    if (Array.isArray(siblingData?.children)) {
        for (const child of siblingData.children){
            traverseRichText({
                onText,
                root,
                siblingData: child
            });
        }
    }
};

//# sourceMappingURL=traverseRichText.js.map