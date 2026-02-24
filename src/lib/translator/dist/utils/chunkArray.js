export const chunkArray = (array, length)=>{
    return Array.from({
        length: Math.ceil(array.length / length)
    }, (_, i)=>array.slice(i * length, i * length + length));
};

//# sourceMappingURL=chunkArray.js.map