import flatCache from "flat-cache";
const cache = flatCache.create("githon");
module.exports.getCache = () => {
    return cache;
};
module.exports.clearCache = () => {
    return flatCache.clearAll();
};
