/* ============================================================
   豆苗学堂 · 对象存储层（系统性三层设计 / mock 优先）
   ------------------------------------------------------------
   第 1 层 Driver 驱动层（统一读写接口）
     - MockDriver : 内存对象存储（mock 优先实现，隐私模式/异常兜底）
     - LocalDriver: localStorage 持久化驱动
     - probe()    : 启动时写入探测，自动选择可用驱动
   第 2 层 ObjectStore 对象存储层（桶 bucket 模型）
     - get / put(带 updatedAt) / update / reset
     - 键规则：doumiao:<bucket>:v1
   第 3 层 Repository 领域仓库层
     - progress 进度桶 / settings 设置桶 / profile 档案桶
     - 旧 key 一次性迁移 + 导出/导入/重置/演示数据
   全局导出：window.DMStorage
   ============================================================ */
(function () {
  "use strict";

  /* ================= 第 1 层：Driver 驱动层 ================= */
  function MockDriver() { this.data = {}; this.name = "mock-memory"; }
  MockDriver.prototype.get = function (k) {
    return Object.prototype.hasOwnProperty.call(this.data, k) ? this.data[k] : null;
  };
  MockDriver.prototype.set = function (k, v) { this.data[k] = String(v); };
  MockDriver.prototype.remove = function (k) { delete this.data[k]; };

  function LocalDriver() { this.name = "local-storage"; }
  LocalDriver.prototype.get = function (k) {
    try { return window.localStorage.getItem(k); } catch (e) { return null; }
  };
  LocalDriver.prototype.set = function (k, v) {
    try { window.localStorage.setItem(k, String(v)); } catch (e) { /* 写满/被禁则静默 */ }
  };
  LocalDriver.prototype.remove = function (k) {
    try { window.localStorage.removeItem(k); } catch (e) {}
  };

  /* 启动探测：能写入 localStorage 就用持久驱动，否则回退内存 mock */
  function probe() {
    try {
      var k = "doumiao:probe:v1";
      window.localStorage.setItem(k, "1");
      var ok = window.localStorage.getItem(k) === "1";
      window.localStorage.removeItem(k);
      if (ok) return new LocalDriver();
    } catch (e) { /* 隐私模式或禁用存储 */ }
    return new MockDriver();
  }
  var driver = probe();

  /* ================= 第 2 层：ObjectStore 对象存储层 ================= */
  var PREFIX = "doumiao:", VER = "v1";
  var BUCKETS = ["progress", "settings", "profile"];
  function key(bucket) { return PREFIX + bucket + ":" + VER; }
  function clone(o) { return o == null ? o : JSON.parse(JSON.stringify(o)); }

  var ObjectStore = {
    /** 读取桶内对象；为空或损坏时返回默认值副本 */
    get: function (bucket, def) {
      var raw = driver.get(key(bucket));
      if (raw == null) return clone(def || null);
      try { return JSON.parse(raw); } catch (e) { return clone(def || null); }
    },
    /** 写入桶内对象，自动盖上 updatedAt 时间戳 */
    put: function (bucket, obj) {
      var o = clone(obj);
      if (o && typeof o === "object") o.updatedAt = new Date().toISOString();
      driver.set(key(bucket), JSON.stringify(o));
      return o;
    },
    /** 读改写一体：fn(旧对象) 返回新对象 */
    update: function (bucket, fn, def) {
      var next = fn(this.get(bucket, def));
      return this.put(bucket, next);
    },
    /** 清空单个桶 */
    reset: function (bucket) { driver.remove(key(bucket)); }
  };

  /* ================= 第 3 层：领域仓库层 ================= */
  var MODULES = ["binary", "ai", "coding", "safety", "terms", "lab"];
  var LESSON_COUNT = { binary: 3, ai: 4, coding: 3, safety: 4, terms: 3, lab: 7 };

  function blankProgress() {
    var p = { version: 1, stones: 0, modules: {} };
    MODULES.forEach(function (m) {
      p.modules[m] = { lessons: [], game: 0, quiz: 0 };
      for (var i = 0; i < LESSON_COUNT[m]; i++) p.modules[m].lessons.push(0);
    });
    return p;
  }
  /** 把任意来源的进度对象规范化为最新结构（取历史最高，只增不减） */
  function normalizeProgress(src) {
    var b = blankProgress();
    if (!src || typeof src !== "object") return b;
    b.stones = Math.max(b.stones, +src.stones || 0);
    MODULES.forEach(function (m) {
      var s = src.modules && src.modules[m];
      if (!s) return;
      for (var i = 0; i < LESSON_COUNT[m]; i++) {
        b.modules[m].lessons[i] = Math.max(b.modules[m].lessons[i], (s.lessons && s.lessons[i]) || 0);
      }
      b.modules[m].game = Math.max(b.modules[m].game, s.game || 0);
      b.modules[m].quiz = Math.max(b.modules[m].quiz, s.quiz || 0);
    });
    return b;
  }

  var DEFAULTS = {
    settings: { muted: false },
    profile: { name: "" }
  };

  var repos = {
    progress: {
      /* 读路径同样规范化：旧版数据（如只有 4 个模块）读到时自动补全新模块键 */
      get: function () { return normalizeProgress(ObjectStore.get("progress", blankProgress())); },
      save: function (p) { return ObjectStore.put("progress", normalizeProgress(p)); },
      update: function (fn) {
        return ObjectStore.update("progress", function (p) { return fn(normalizeProgress(p)); }, blankProgress());
      },
      reset: function () { ObjectStore.reset("progress"); }
    },
    settings: {
      get: function () { return ObjectStore.get("settings", DEFAULTS.settings); },
      save: function (s) { return ObjectStore.put("settings", s); }
    },
    profile: {
      get: function () { return ObjectStore.get("profile", DEFAULTS.profile); },
      save: function (p) { return ObjectStore.put("profile", p); }
    }
  };

  /* ---------- 旧版本 key 一次性迁移（doumiao_progress_v1 / doumiao_muted） ---------- */
  function migrateLegacy() {
    try {
      var legacy = window.localStorage.getItem("doumiao_progress_v1");
      if (legacy != null) {
        if (driver.get(key("progress")) == null) {
          repos.progress.save(JSON.parse(legacy)); // save 内部已做 normalize
        }
        window.localStorage.removeItem("doumiao_progress_v1");
      }
      var oldMute = window.localStorage.getItem("doumiao_muted");
      if (oldMute != null) {
        var st = repos.settings.get();
        if (st && st.muted === undefined) { st.muted = oldMute === "1"; repos.settings.save(st); }
        window.localStorage.removeItem("doumiao_muted");
      }
    } catch (e) { /* 迁移失败不阻塞主流程 */ }
  }
  migrateLegacy();

  /* ---------- 导出 / 导入 / 重置 / 演示数据 ---------- */
  function exportAll() {
    var data = {};
    BUCKETS.forEach(function (b) {
      data[b] = ObjectStore.get(b, b === "progress" ? blankProgress() : DEFAULTS[b] || null);
    });
    return JSON.stringify({ site: "doumiao", version: 1, exportedAt: new Date().toISOString(), data: data }, null, 2);
  }
  function importAll(json) {
    try {
      var pack = typeof json === "string" ? JSON.parse(json) : json;
      if (!pack || !pack.data) return false;
      BUCKETS.forEach(function (b) {
        if (pack.data[b] != null) ObjectStore.put(b, pack.data[b]);
      });
      return true;
    } catch (e) { return false; }
  }
  function resetAll() { BUCKETS.forEach(function (b) { ObjectStore.reset(b); }); }
  /** 一键灌入满进度演示数据（mock 数据源见 mock-data.js） */
  function seedDemo() {
    var demo = window.DM_MOCK && window.DM_MOCK.demoProgress;
    if (!demo) return false;
    repos.progress.save(demo);
    return true;
  }

  /* ================= 全局导出 ================= */
  window.DMStorage = {
    driverName: driver.name,           // "local-storage" | "mock-memory"
    progress: repos.progress,          // 进度桶
    settings: repos.settings,          // 设置桶（静音等）
    profile: repos.profile,            // 档案桶（证书姓名等）
    exportAll: exportAll,              // 导出全部桶为 JSON 字符串
    importAll: importAll,              // 从 JSON 恢复
    resetAll: resetAll,                // 清空所有桶
    seedDemo: seedDemo,                // 灌入演示进度
    store: ObjectStore                 // 暴露第 2 层，便于二次开发扩展桶
  };
  console.log("[豆苗学堂] 对象存储驱动: " + driver.name);
})();
