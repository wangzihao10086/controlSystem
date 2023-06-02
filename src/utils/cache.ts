class LocalCache {
  // 写入 localStorage
  setCache(key: string, value: any) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(err);
    }
  }
  // 读取 localStorage
  getCache(key: string) {
    const value = window.localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
  }
  // 删除 localStorage
  deleteCache(key: string) {
    window.localStorage.removeItem(key);
  }
  // 清空 localStorage
  clearCache() {
    window.localStorage.clear();
  }
}

export default new LocalCache();
