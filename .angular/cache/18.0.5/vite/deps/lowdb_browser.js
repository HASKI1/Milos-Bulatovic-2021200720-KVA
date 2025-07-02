import "./chunk-J4B6MK7R.js";

// node_modules/lowdb/lib/adapters/browser/WebStorage.js
var WebStorage = class {
  #key;
  #storage;
  constructor(key, storage) {
    this.#key = key;
    this.#storage = storage;
  }
  read() {
    const value = this.#storage.getItem(this.#key);
    if (value === null) {
      return null;
    }
    return JSON.parse(value);
  }
  write(obj) {
    this.#storage.setItem(this.#key, JSON.stringify(obj));
  }
};

// node_modules/lowdb/lib/adapters/browser/LocalStorage.js
var LocalStorage = class extends WebStorage {
  constructor(key) {
    super(key, localStorage);
  }
};

// node_modules/lowdb/lib/adapters/browser/SessionStorage.js
var SessionStorage = class extends WebStorage {
  constructor(key) {
    super(key, sessionStorage);
  }
};

// node_modules/lowdb/lib/core/Low.js
function checkArgs(adapter, defaultData) {
  if (adapter === void 0)
    throw new Error("lowdb: missing adapter");
  if (defaultData === void 0)
    throw new Error("lowdb: missing default data");
}
var LowSync = class {
  adapter;
  data;
  constructor(adapter, defaultData) {
    checkArgs(adapter, defaultData);
    this.adapter = adapter;
    this.data = defaultData;
  }
  read() {
    const data = this.adapter.read();
    if (data)
      this.data = data;
  }
  write() {
    if (this.data)
      this.adapter.write(this.data);
  }
  update(fn) {
    fn(this.data);
    this.write();
  }
};

// node_modules/lowdb/lib/presets/browser.js
function LocalStoragePreset(key, defaultData) {
  const adapter = new LocalStorage(key);
  const db = new LowSync(adapter, defaultData);
  db.read();
  return db;
}
function SessionStoragePreset(key, defaultData) {
  const adapter = new SessionStorage(key);
  const db = new LowSync(adapter, defaultData);
  db.read();
  return db;
}
export {
  LocalStorage,
  LocalStoragePreset,
  SessionStorage,
  SessionStoragePreset
};
//# sourceMappingURL=lowdb_browser.js.map
