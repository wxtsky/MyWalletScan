const ClearAllCache = () => {
    // 将localStorage中的数据全部清除
    window.localStorage.clear();
    // 将sessionStorage中的数据全部清除
    window.sessionStorage.clear();
    // 将indexedDB中的数据全部清除
    window.indexedDB.deleteDatabase("BitBoxTools");
}
export default ClearAllCache;
