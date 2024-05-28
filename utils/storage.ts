/**
 * 封装Storage
 */
class KStorage {
  get(key: any) {
    if (!key) return null;
    if (typeof key === "object") {
      key = JSON.stringify(key);
    }
    const getData = localStorage.getItem(key);
    if (!getData) {
      console.warn("key不存在");
      return;
    }
    return JSON.parse(getData);
  }

  set(key: any, value: any) {
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }
    if (typeof key === "object") {
      key = JSON.stringify(key);
    }
    localStorage.setItem(key, value);
  }

  remove(key: any) {
    if (typeof key === "object") {
      key = JSON.stringify(key);
    }
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}

export const storage = new KStorage();
