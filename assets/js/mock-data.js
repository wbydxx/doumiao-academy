/* ============================================================
   豆苗学堂 · Mock 数据层（mock 优先）
   - DM_MOCK.demoProgress: 满进度演示数据（一键体验"通关后"的样子）
   - DM_MOCK.catalog:      全量内容目录（来自 assets/data/catalog.json 生成的 catalog.js）
   说明：本站为纯静态零依赖站点，内容目录的单一数据源是 catalog.json，
         通过 build-catalog.ps1 生成 catalog.js 注入 window.DM_CATALOG。
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 满进度演示进度（结构与 storage.js 的 progress bucket 完全一致） ---------- */
  var demoProgress = {
    version: 1,
    stones: 86,
    modules: {
      binary: { lessons: [3, 3, 3], game: 3, quiz: 3 },
      ai:     { lessons: [2, 3, 3, 2], game: 3, quiz: 3 },
      coding: { lessons: [3, 3, 3], game: 3, quiz: 3 },
      safety: { lessons: [2, 3, 2, 3], game: 3, quiz: 3 },
      terms:  { lessons: [3, 3, 3], game: 3, quiz: 3 },
      lab:    { lessons: [3, 3, 3, 3, 3, 3, 3], game: 8, quiz: 3 }
    },
    updatedAt: "2026-10-18T09:00:00.000Z"
  };

  /* ---------- 全量内容目录（优先取 catalog.js 注入的 window.DM_CATALOG，否则回退空壳） ---------- */
  var catalog = (window.DM_CATALOG && window.DM_CATALOG.modules) ? window.DM_CATALOG : {
    site: { name: "豆苗学堂", full: "豆苗逐智 · 童享科技", intro: "少儿 AI 与计算机公益科普",
      org: "河海大学计算机与软件学院 · 南京", ages: "6-12 岁", privacy: "无需注册 · 不联网收集信息" },
    modules: {},
    badges: [],
    certificate: { title: "结业证书", subtitle: "「豆苗逐智 · 童享科技」少儿科普课程",
      text: "小朋友已完成豆苗学堂全部课程学习，授予“科技小苗”称号！", signer: "豆苗学堂 · 豆豆老师", date: "2026 年" }
  };

  window.DM_MOCK = {
    demoProgress: demoProgress,
    catalog: catalog
  };
})();
