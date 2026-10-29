/* ============================================================
   豆苗学堂 · 公共脚本（零依赖）
   - DM.icon: 统一 SVG 线性图标库（stroke=currentColor）
   - DM.store: 进度（雨花石 / 徽章），读写委托 storage.js 的对象存储层
   - DM.sfx:   Web Audio 合成音效（零音频文件）
   - DM.speak: Web Speech 朗读（可选增强）
   - DM.boot:  注入导航 / 页脚 / 护眼提醒
   - DM.quiz:  挑战测验引擎
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- SVG 线性图标库 ---------------- */
  var P = {
    home: '<path d="M4 11.5 12 4l8 7.5"/><path d="M6.5 10.5V20h11v-9.5"/><path d="M10.5 20v-5h3v5"/>',
    lantern: '<path d="M9 4.5h6"/><path d="M12 2.5v2"/><path d="M12 6.5c3.6 0 6 2.9 6 6.5s-2.4 6.5-6 6.5-6-2.9-6-6.5 2.4-6.5 6-6.5z"/><path d="M9 10.5h6M9 13h6M9 15.5h6"/><path d="M10.5 19.5 9.5 22M13.5 19.5l1 2.5"/>',
    robot: '<rect x="5" y="8.5" width="14" height="9.5" rx="3"/><path d="M12 5v3.5"/><circle cx="12" cy="4" r="1.2"/><circle cx="9.3" cy="12.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="14.7" cy="12.5" r="1.1" fill="currentColor" stroke="none"/><path d="M9.5 15.4h5"/><path d="M5 12H2.8M21.2 12H19"/>',
    boat: '<path d="M3 14.5c1.8 3 5.4 4.5 9 4.5s7.2-1.5 9-4.5H3z"/><path d="M6.5 14.5v-2h11v2"/><path d="M8.5 12.5v-1.6c0-1.1.9-2 2-2h3c1.1 0 2 .9 2 2v1.6"/><path d="M12 8.9V7.4"/><circle cx="12" cy="6.2" r="1.2"/>',
    wall: '<path d="M12 3l7.5 2.8v5.4c0 5.2-3.6 8.4-7.5 10-3.9-1.6-7.5-4.8-7.5-10V5.8L12 3z"/><path d="M9.3 12.2h5.4M12 9.5v5.4"/>',
    droplet: '<path d="M12 3.2c3.4 4.4 5.8 7.6 5.8 10.7a5.8 5.8 0 1 1-11.6 0c0-3.1 2.4-6.3 5.8-10.7z"/><circle cx="9.6" cy="14" r=".9" fill="currentColor" stroke="none"/><circle cx="14.4" cy="14" r=".9" fill="currentColor" stroke="none"/><path d="M10.4 16.6c.9.8 2.3.8 3.2 0"/>',
    doudou: '<circle cx="12" cy="11" r="7.5"/><path d="M4.8 8.6C3.6 7.8 3.2 6.4 4 5.6c.8-.8 2.2-.4 3 .8M19.2 8.6c1.2-.8 1.6-2.2.8-3-.8-.8-2.2-.4-3 .8"/><circle cx="9.4" cy="10.6" r=".95" fill="currentColor" stroke="none"/><circle cx="14.6" cy="10.6" r=".95" fill="currentColor" stroke="none"/><path d="M10.2 13.6c1 .9 2.6.9 3.6 0"/><path d="M8.6 18.9 6.8 21.4M15.4 18.9l1.8 2.5"/><path d="M12 16.5v2.4"/>',
    plum: '<circle cx="12" cy="7.6" r="2.7"/><circle cx="7.4" cy="10.9" r="2.7"/><circle cx="16.6" cy="10.9" r="2.7"/><circle cx="9.1" cy="15.9" r="2.7"/><circle cx="14.9" cy="15.9" r="2.7"/><circle cx="12" cy="11.8" r="1.2" fill="currentColor" stroke="none"/>',
    stone: '<path d="M12 4c4.2 0 7.2 3.7 7.2 8.1S16 20.4 12 20.4 4.8 16.5 4.8 12.1 7.8 4 12 4z"/><path d="M8.6 10.4c1.8-1.7 5-1.7 6.8 0"/><path d="M9.2 14.2c1.6 1.2 4 1.2 5.6 0"/>',
    leaf: '<path d="M12 21c-4.8-3-7.8-6.8-7.8-10.6C4.2 6.6 7.4 3.6 12 3.6s7.8 3 7.8 6.8C19.8 14.2 16.8 18 12 21z"/><path d="M12 7v12"/><path d="M12 11.5 9 9.8M12 14.5l3-1.7"/>',
    trophy: '<path d="M8 4h8v6a4 4 0 0 1-8 0V4z"/><path d="M8 5.5H5a3 3 0 0 0 3 4.4M16 5.5h3a3 3 0 0 1-3 4.4"/><path d="M12 14v3.5"/><path d="M8.5 20.5h7M9.5 17.5h5v3h-5z"/>',
    speaker: '<path d="M4 9.5v5h3.5L12 19V5L7.5 9.5H4z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.7a7.6 7.6 0 0 1 0 10.6"/>',
    speakerOff: '<path d="M4 9.5v5h3.5L12 19V5L7.5 9.5H4z"/><path d="M16 9.8l5 4.4M21 9.8l-5 4.4"/>',
    arrowLeft: '<path d="M14.5 5.5 8 12l6.5 6.5"/><path d="M8 12h12"/>',
    arrowRight: '<path d="M9.5 5.5 16 12l-6.5 6.5"/><path d="M4 12h12"/>',
    play: '<path d="M8 5.5v13l10-6.5-10-6.5z"/>',
    reset: '<path d="M4.6 10a7.6 7.6 0 1 1 1 6.6"/><path d="M4 5v5h5"/>',
    check: '<path d="M4.5 12.5 10 18 19.5 7"/>',
    book: '<path d="M12 6.5C10.5 5 8.4 4.5 4 4.5v13c4.4 0 6.5.5 8 2 1.5-1.5 3.6-2 8-2v-13c-4.4 0-6.5.5-8 2z"/><path d="M12 6.5v13"/>',
    gamepad: '<rect x="3" y="8" width="18" height="10.5" rx="5"/><path d="M8 11v4.5M5.8 13.2h4.4"/><circle cx="15.8" cy="11.8" r="1" fill="currentColor" stroke="none"/><circle cx="18" cy="14.2" r="1" fill="currentColor" stroke="none"/>',
    quiz: '<rect x="5" y="3.5" width="14" height="17" rx="3"/><path d="M9.6 9.4a2.4 2.4 0 1 1 3.4 2.3c-.8.4-1 .9-1 1.8"/><circle cx="12" cy="16.4" r="1" fill="currentColor" stroke="none"/>',
    award: '<circle cx="12" cy="9" r="5.5"/><path d="M8.8 13.6 7.5 21l4.5-2.6L16.5 21l-1.3-7.4"/>',
    bulb: '<path d="M12 3.5a6 6 0 0 1 3.6 10.8c-.8.6-1.1 1.2-1.1 2.2h-5c0-1-.3-1.6-1.1-2.2A6 6 0 0 1 12 3.5z"/><path d="M9.8 19.5h4.4M10.6 21.5h2.8"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.6 2.3 3.9 5.1 3.9 8.5s-1.3 6.2-3.9 8.5c-2.6-2.3-3.9-5.1-3.9-8.5s1.3-6.2 3.9-8.5z"/>',
    lock: '<rect x="5.5" y="10.5" width="13" height="9.5" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/><circle cx="12" cy="15.2" r="1.1" fill="currentColor" stroke="none"/>',
    alert: '<path d="M12 4 21 19.5H3L12 4z"/><path d="M12 10v4.2"/><circle cx="12" cy="16.8" r=".95" fill="currentColor" stroke="none"/>',
    eye: '<path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
    moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"/>',
    forward: '<path d="M5 12h13"/><path d="M12.5 5.5 19 12l-6.5 6.5"/>',
    turnL: '<path d="M9.5 4.5 4 10l5.5 5.5"/><path d="M4 10h9a7 7 0 0 1 7 7v2.5"/>',
    turnR: '<path d="M14.5 4.5 20 10l-5.5 5.5"/><path d="M20 10h-9a7 7 0 0 0-7 7v2.5"/>',
    loop: '<path d="M4 12a8 8 0 0 1 8-8c2.9 0 5.4 1.5 6.9 3.8"/><path d="M20 12a8 8 0 0 1-8 8c-2.9 0-5.4-1.5-6.9-3.8"/><path d="M18.9 3.5v4.3h-4.3M5.1 20.5v-4.3h4.3"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/>',
    shieldCheck: '<path d="M12 3l7.5 2.8v5.4c0 5.2-3.6 8.4-7.5 10-3.9-1.6-7.5-4.8-7.5-10V5.8L12 3z"/><path d="M8.8 12.2l2.2 2.2 4.2-4.4"/>',
    brain: '<path d="M9.5 4.5A2.8 2.8 0 0 0 6.7 7.3 3 3 0 0 0 4.5 10c0 1 .5 2 1.3 2.5A3 3 0 0 0 5 15c0 1.7 1.4 3 3.1 3 .3 1 1.2 1.8 2.4 1.8 1 0 1.5-.5 1.5-1.4V5.9c0-.8-.6-1.4-1.4-1.4z"/><path d="M14.5 4.5a2.8 2.8 0 0 1 2.8 2.8A3 3 0 0 1 19.5 10c0 1-.5 2-1.3 2.5a3 3 0 0 1 .8 2.5c0 1.7-1.4 3-3.1 3-.3 1-1.2 1.8-2.4 1.8-1 0-1.5-.5-1.5-1.4V5.9c0-.8.6-1.4 1.4-1.4z"/><path d="M9 9.5h2.6M12.4 13H15"/>',
    code: '<path d="M8.5 7 4 12l4.5 5"/><path d="M15.5 7 20 12l-4.5 5"/><path d="M13.2 4.5l-2.4 15"/>',
    terminal: '<rect x="3" y="4.5" width="18" height="15" rx="3"/><path d="M6.5 9.5l3.5 3-3.5 3"/><path d="M12.5 15.5H18"/>',
    flask: '<path d="M10 3.5h4"/><path d="M10.5 3.5v5L5 18a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18L13.5 8.5v-5"/><path d="M7.5 14.5h9"/><circle cx="11" cy="17.6" r="1" fill="currentColor" stroke="none"/><circle cx="14.2" cy="16.6" r=".8" fill="currentColor" stroke="none"/>',
    pinyin: '<circle cx="12" cy="12" r="8.6"/><path d="M8.2 15.8 12 7.4l3.8 8.4"/><path d="M9.7 12.6h4.6"/>',
    box: '<rect x="4" y="8.5" width="16" height="11.5" rx="2.5"/><path d="M4 12.5h16"/><path d="M12 8.5v11.5"/><path d="M8.2 8.5 10 4.5h4l1.8 4"/>',
  };

  function icon(name, cls) {
    var body = P[name] || P.spark;
    return '<svg class="ic ' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + "</svg>";
  }

  /* ---------------- 进度存储（委托 storage.js 的 DMStorage 对象存储层） ---------------- */
  // 优先从 catalog.json 生成的 window.DM_CATALOG 读取内容目录；缺失时回退到内置默认值
  var _CAT = (window.DM_CATALOG && window.DM_CATALOG.modules) ? window.DM_CATALOG.modules : null;
  var MODULES = _CAT ? Object.keys(_CAT) : ["binary", "ai", "coding", "safety", "terms", "lab"];
  var LESSON_COUNT = _CAT
    ? (function () { var o = {}; MODULES.forEach(function (k) { o[k] = (_CAT[k].lessons || []).length; }); return o; })()
    : { binary: 3, ai: 4, coding: 3, safety: 4, terms: 3, lab: 7 };
  var LEVELS = _CAT
    ? {
        entry: MODULES.filter(function (k) { return (_CAT[k].level || "entry") === "entry"; }),
        advanced: MODULES.filter(function (k) { return (_CAT[k].level || "entry") === "advanced"; })
      }
    : { entry: ["binary", "ai", "coding", "safety"], advanced: ["terms", "lab"] };

  function load() { return window.DMStorage.progress.get(); }
  function save(p) { window.DMStorage.progress.save(p); }

  var store = {
    get: function () { return load(); },
    addStones: function (n) { var p = load(); p.stones += n; save(p); refreshChips(); },
    /** 关卡通关：stones 1–3（取历史最高） */
    completeLesson: function (m, idx, stones) {
      var p = load(), slot = p.modules[m].lessons[idx] || 0;
      if (stones > slot) { p.stones += stones - slot; slot = stones; }
      p.modules[m].lessons[idx] = slot; save(p); refreshChips();
    },
    completeGame: function (m, stones) {
      var p = load(), slot = p.modules[m].game || 0;
      if (stones > slot) { p.stones += stones - slot; p.modules[m].game = stones; }
      save(p); refreshChips();
    },
    completeQuiz: function (m, stones) {
      var p = load(), slot = p.modules[m].quiz || 0;
      if (stones > slot) { p.stones += stones - slot; p.modules[m].quiz = stones; }
      save(p); refreshChips();
    },
    moduleDone: function (m) {
      var p = load(), d = p.modules[m];
      var lessonsOk = d.lessons.every(function (s) { return s > 0; });
      return lessonsOk && d.game > 0 && d.quiz > 0;
    },
    badgeCount: function () { return MODULES.filter(store.moduleDone).length; },
    modulePercent: function (m) {
      var p = load(), d = p.modules[m], total = LESSON_COUNT[m] + 2, got = 0;
      d.lessons.forEach(function (s) { if (s > 0) got++; });
      if (d.game > 0) got++; if (d.quiz > 0) got++;
      return Math.round((got / total) * 100);
    }
  };

  /** 入门航线是否已全部通关（4 个模块的课程、游戏、测验全部完成） */
  function entryCleared() {
    return LEVELS.entry.every(function (m) { return store.moduleDone(m); });
  }

  /* ---------------- 音效（WebAudio 合成） ---------------- */
  var actx = null, muted = !!(window.DMStorage.settings.get() && window.DMStorage.settings.get().muted);
  function ctx() {
    if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
    return actx;
  }
  function tone(freq, t0, dur, type, vol) {
    var c = ctx(); if (!c) return;
    var o = c.createOscillator(), g = c.createGain();
    o.type = type || "sine"; o.frequency.value = freq;
    g.gain.setValueAtTime(vol || 0.12, c.currentTime + t0);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + t0 + dur);
    o.connect(g); g.connect(c.destination);
    o.start(c.currentTime + t0); o.stop(c.currentTime + t0 + dur);
  }
  function sfx(kind) {
    if (muted) return;
    if (kind === "click") tone(620, 0, 0.08, "triangle");
    else if (kind === "right") { tone(660, 0, 0.12); tone(880, 0.1, 0.16); tone(1100, 0.22, 0.2); }
    else if (kind === "wow") { tone(520, 0, 0.12, "triangle"); tone(660, 0.1, 0.12, "triangle"); tone(780, 0.2, 0.12, "triangle"); tone(1040, 0.3, 0.28, "triangle"); }
    else if (kind === "retry") tone(320, 0, 0.18, "sine", 0.09);
    else if (kind === "toggle") tone(440, 0, 0.06, "square", 0.05);
  }

  /* ---------------- 朗读 ---------------- */
  function speak(text, btn) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN"; u.rate = 0.95;
    if (btn) {
      u.onend = function () { btn.classList.remove("active"); };
      btn.classList.add("active");
    }
    window.speechSynthesis.speak(u);
  }
  function speakPage(btn) {
    var el = document.querySelector(".learn-text") || document.querySelector("main");
    if (!el) return;
    var clone = el.cloneNode(true);           // 朗读前剔除拼音 rt，避免读出字母
    clone.querySelectorAll("rt").forEach(function (r) { r.remove(); });
    speak(clone.innerText.slice(0, 400), btn);
  }

  /* ---------------- 静音切换 ---------------- */
  function toggleMute(btn) {
    muted = !muted;
    var st = window.DMStorage.settings.get(); // 读改写，保留拼音等其它设置
    st.muted = muted;
    window.DMStorage.settings.save(st);
    if (btn) btn.innerHTML = icon(muted ? "speakerOff" : "speaker");
    if (!muted) sfx("click");
  }

  /* ---------------- 拼音点读模式（点击汉字弹出读音气泡，零 DOM 侵入） ---------------- */
  var pyMap = null, pyOn = false, pyPop = null, pyHl = null, pyHoverBound = false;
  /** 由 pinyin-data.js 的原始记录构建 汉字→拼音 映射（惰性，仅一次） */
  function buildPyMap() {
    if (pyMap || !window.DM_PY_RAW) return pyMap;
    pyMap = {};
    window.DM_PY_RAW.forEach(function (rec) {
      var i = rec.indexOf("|");
      if (i < 0) return;
      var zs = rec.slice(0, i), ys = rec.slice(i + 1).trim().split(/\s+/);
      for (var k = 0; k < zs.length && k < ys.length; k++) pyMap[zs[k]] = ys[k];
    });
    return pyMap;
  }
  /** 排除区域：代码块/输入区/SVG/页头页脚/气泡自身不参与点读 */
  function pySkipped(el) {
    return !el || el.closest("script,style,textarea,pre,code,svg,.cr-out,.code-box,.pz-code,#site-header,#site-footer,.py-pop");
  }
  /** 惰性创建气泡与高亮浮层（单例，绝对定位，不改动正文任何 DOM） */
  function pyLayers() {
    if (pyPop) return;
    pyPop = document.createElement("div");
    pyPop.className = "py-pop";
    pyPop.setAttribute("role", "status");
    pyPop.style.display = "none";
    document.body.appendChild(pyPop);
    pyHl = document.createElement("div");
    pyHl.className = "py-hl";
    pyHl.style.display = "none";
    document.body.appendChild(pyHl);
  }
  /** 按视口坐标定位文本节点内偏移（caretRangeFromPoint / caretPositionFromPoint 双兼容） */
  function pyCaret(x, y) {
    var node = null, offset = 0;
    if (document.caretRangeFromPoint) {
      var r = document.caretRangeFromPoint(x, y);
      if (r) { node = r.startContainer; offset = r.startOffset; }
    } else if (document.caretPositionFromPoint) {
      var p = document.caretPositionFromPoint(x, y);
      if (p) { node = p.offsetNode; offset = p.offset; }
    }
    if (!node || node.nodeType !== 3) return null;
    return { node: node, offset: offset };
  }
  /** 命中检测：坐标处若是字典内汉字（且不在排除区），返回 {ch,py,node,offset} */
  function pyCharAt(x, y) {
    var hit = pyCaret(x, y);
    if (!hit) return null;
    var s = hit.node.nodeValue, i = hit.offset, ch = null, at = -1;
    if (i > 0 && /[\u4e00-\u9fa5]/.test(s[i - 1])) { ch = s[i - 1]; at = i - 1; }
    else if (i < s.length && /[\u4e00-\u9fa5]/.test(s[i])) { ch = s[i]; at = i; }
    if (!ch) return null;
    var map = buildPyMap();
    if (!map || !map[ch]) return null;
    if (pySkipped(hit.node.parentElement)) return null;
    return { ch: ch, py: map[ch], node: hit.node, offset: at };
  }
  /** 字符的视口矩形 */
  function pyRectOf(ch) {
    var rng = document.createRange();
    rng.setStart(ch.node, ch.offset);
    rng.setEnd(ch.node, ch.offset + 1);
    return rng.getBoundingClientRect();
  }
  /** 只显示高亮框（hover 提示） */
  function pyHlShow(ch) {
    pyLayers();
    var r = pyRectOf(ch);
    pyHl.style.left = r.left - 3 + "px";
    pyHl.style.top = r.top - 2 + "px";
    pyHl.style.width = r.width + 6 + "px";
    pyHl.style.height = r.height + 4 + "px";
    pyHl.style.display = "block";
  }
  function pyHlHide() { if (pyHl) pyHl.style.display = "none"; }
  /** 显示读音气泡（贴纸风，自动上下翻转避顶） */
  function pyPopShow(ch) {
    pyLayers();
    pyHlShow(ch);
    var r = pyRectOf(ch);
    pyPop.innerHTML = "<b>" + ch.ch + "</b><i>" + ch.py + "</i>";
    pyPop.style.visibility = "hidden";
    pyPop.style.display = "flex"; // flex 布局才能让 gap 生效，字与拼音留出间距
    var w = pyPop.offsetWidth, h = pyPop.offsetHeight;
    var top = r.top - h - 8, below = false;
    if (top < 60) { top = r.bottom + 10; below = true; }
    var left = r.left + r.width / 2 - w / 2;
    if (left < 8) left = 8;
    if (left + w > window.innerWidth - 8) left = window.innerWidth - 8 - w;
    pyPop.style.left = left + "px";
    pyPop.style.top = top + "px";
    pyPop.style.visibility = "";
    var ax = r.left + r.width / 2 - left; // 箭头对准被点的那个字
    if (ax < 16) ax = 16;
    if (ax > w - 16) ax = w - 16;
    pyPop.style.setProperty("--ax", ax + "px");
    pyPop.classList.toggle("down", below);
  }
  function pyHide() { pyHlHide(); if (pyPop) pyPop.style.display = "none"; }
  /** 桌面精确指针：跟随鼠标的高亮提示（40ms 节流） */
  function pyBindHover() {
    if (pyHoverBound) return;
    pyHoverBound = true;
    var tid = null;
    document.addEventListener("mousemove", function (e) {
      if (!pyOn) return;
      clearTimeout(tid);
      tid = setTimeout(function () {
        var ch = pyCharAt(e.clientX, e.clientY);
        if (ch) pyHlShow(ch); else pyHlHide();
      }, 40);
    }, { passive: true });
  }
  /** 开关入口：切换点读模式并写入设置桶 */
  function pyToggle(btn) {
    pyOn = !pyOn;
    var st = window.DMStorage.settings.get();
    st.pinyinOn = pyOn;
    window.DMStorage.settings.save(st);
    if (!pyOn) pyHide();
    else if (window.matchMedia && matchMedia("(pointer:fine)").matches) pyBindHover();
    sfx("toggle");
    if (btn) btn.classList.toggle("on", pyOn);
  }
  /** 页面级事件：点击出气泡并朗读，滚动/缩放收起（boot 内调用一次） */
  function pyBindDoc() {
    document.addEventListener("click", function (e) {
      if (!pyOn) return;
      var ch = pyCharAt(e.clientX, e.clientY);
      if (ch) {
        pyPopShow(ch);
        var mutedNow = !!(window.DMStorage.settings.get() && window.DMStorage.settings.get().muted);
        if (!mutedNow) speak(ch.ch);
      } else pyHide();
    });
    window.addEventListener("scroll", pyHide, { passive: true });
    window.addEventListener("resize", pyHide);
  }

  /* ---------------- Python 子集转译运行器 ----------------
     零依赖迷你实现：把教学用 Python 子集翻译成等价 JS，
     在 new Function 沙盒里执行；print → _p 行缓冲收集输出（支持 sep/end）。
     支持：赋值（含 += 等与下标赋值）/ print(sep=,end=) / f-string（含 :.Nf）/
     if-elif-else / for-in-range / for-in 容器 / while（死循环护栏）/
     def-return / break-continue-pass / 列表与字典 / 常用方法链 /
     len-sum-max-min-sorted-round-abs-int-float / random（固定种子可复现） */
  function pyStripComment(s) {
    // 去掉行尾 # 注释（引号内的 # 不算）
    var q = null, i, out = "";
    for (i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      if (q) { if (c === q) q = null; out += c; continue; }
      if (c === '"' || c === "'") { q = c; out += c; continue; }
      if (c === "#") break;
      out += c;
    }
    return out;
  }
  /* 扫描小工具：字符串跳过 / 括号配对 / 操作数抓取（都认得哨兵段） */
  var SN_O = "\x04", SN_C = "\x05"; // 已重写片段的包裹哨兵，避免二次扫描
  var OP_NOTIN = "\x02", OP_IN = "\x03", OP_FDIV = "\x06", OP_POW = "\x07";
  /** 从开引号位置 i 跳过字符串字面量，返回闭引号位置（找不到 -1） */
  function strEnd(s, i) {
    var q = s.charAt(i);
    for (var j = i + 1; j < s.length; j++) {
      var c = s.charAt(j);
      if (c === "\\") { j++; continue; }
      if (c === q) return j;
    }
    return -1;
  }
  /** 从闭引号位置 i 反向找开引号位置 */
  function strBegin(s, i) {
    var q = s.charAt(i);
    for (var j = i - 1; j >= 0; j--) if (s.charAt(j) === q) return j;
    return 0;
  }
  /** 哨兵段端点：i 在 SN_O → 配对 SN_C；i 在 SN_C → 配对 SN_O */
  function sentEnd(s, i) {
    var d = 0;
    for (var j = i; j < s.length; j++) {
      if (s.charAt(j) === SN_O) d++;
      else if (s.charAt(j) === SN_C) { d--; if (!d) return j; }
    }
    return s.length - 1;
  }
  function sentStart(s, i) {
    var d = 0;
    for (var j = i; j >= 0; j--) {
      if (s.charAt(j) === SN_C) d++;
      else if (s.charAt(j) === SN_O) { d--; if (!d) return j; }
    }
    return 0;
  }
  /** 与 i（开括号）配对的闭括号位置；字符串与哨兵段跳过 */
  function matchFwd(s, i) {
    var op = s.charAt(i), cl = op === "(" ? ")" : op === "[" ? "]" : "}", depth = 0;
    for (var j = i; j < s.length; j++) {
      var c = s.charAt(j);
      if (c === '"' || c === "'") { var e = strEnd(s, j); if (e < 0) return -1; j = e; continue; }
      if (c === SN_O) { j = sentEnd(s, j); continue; }
      if (c === op) depth++;
      else if (c === cl) { depth--; if (!depth) return j; }
    }
    return -1;
  }
  /** 与 i（闭括号）配对的开括号位置 */
  function matchBack(s, i) {
    var cl = s.charAt(i), op = cl === ")" ? "(" : cl === "]" ? "[" : "{", depth = 0;
    for (var j = i; j >= 0; j--) {
      var c = s.charAt(j);
      if (c === cl) depth++;
      else if (c === '"' || c === "'") { j = strBegin(s, j); continue; }
      else if (c === SN_C) { j = sentStart(s, j); continue; }
      else if (c === op) { depth--; if (!depth) return j; }
    }
    return 0;
  }
  /** 从 i 起向右取一个操作数（字面量/变量/调用/下标/点链/哨兵段），返回 {a,b} */
  function grabFwd(s, i) {
    while (i < s.length && /\s/.test(s.charAt(i))) i++;
    var start = i;
    for (;;) {
      var c = s.charAt(i);
      if (c === "(" || c === "[") { var e = matchFwd(s, i); i = e < 0 ? s.length : e + 1; continue; }
      if (c === '"' || c === "'") { var e2 = strEnd(s, i); i = e2 < 0 ? s.length : e2 + 1; continue; }
      if (c === SN_O) { i = sentEnd(s, i) + 1; continue; }
      if (/[A-Za-z0-9_$]/.test(c || "")) { while (i < s.length && /[A-Za-z0-9_$]/.test(s.charAt(i))) i++; continue; }
      if (c === ".") { i++; continue; }
      break;
    }
    return { a: start, b: i };
  }
  /** 从 i（不含）起向左取一个操作数，返回 {a,b}（b 为右边界） */
  function grabBack(s, i) {
    while (i > 0 && /\s/.test(s.charAt(i - 1))) i--;
    var end = i;
    for (;;) {
      var c = s.charAt(i - 1);
      if (c === ")" || c === "]") { i = matchBack(s, i - 1); continue; }
      if (c === '"' || c === "'") { i = strBegin(s, i - 1); continue; }
      if (c === SN_C) { i = sentStart(s, i - 1); continue; }
      if (/[A-Za-z0-9_$]/.test(c || "")) { while (i > 0 && /[A-Za-z0-9_$]/.test(s.charAt(i - 1))) i--; continue; }
      if (c === ".") { i--; continue; }
      break;
    }
    return { a: i, b: end };
  }
  /** 顶层逗号切分（括号深度与字符串感知） */
  function splitTop(s) {
    var parts = [], depth = 0, cur = "", i = 0;
    while (i < s.length) {
      var c = s.charAt(i);
      if (c === '"' || c === "'") { var j = strEnd(s, i); if (j < 0) { cur += s.slice(i); break; } cur += s.slice(i, j + 1); i = j + 1; continue; }
      if (c === "(" || c === "[") depth++;
      if (c === ")" || c === "]") depth--;
      if (c === "," && depth === 0) { parts.push(cur); cur = ""; i++; continue; }
      cur += c; i++;
    }
    parts.push(cur);
    return parts;
  }
  /** 引号外打中缀标记：not in / in / // / **（避开 pyKw 的 not→! 替换） */
  function pyMarkOps(e) {
    var out = "", i = 0, n = e.length;
    while (i < n) {
      var c = e.charAt(i);
      if (c === '"' || c === "'") {
        var j = strEnd(e, i);
        if (j < 0) return e; // 引号不成对，交给 pyExpr 报错
        out += e.slice(i, j + 1); i = j + 1; continue;
      }
      if (e.indexOf(" not in ", i) === i) { out += " " + OP_NOTIN + " "; i += 8; continue; }
      if (e.indexOf(" in ", i) === i) { out += " " + OP_IN + " "; i += 4; continue; }
      if (e.indexOf("//", i) === i) { out += OP_FDIV; i += 2; continue; }
      if (e.indexOf("**", i) === i) { out += OP_POW; i += 2; continue; }
      out += c; i++;
    }
    return out;
  }
  function pyKw(s) {
    // Python 关键字 / 内置函数 → JS 等价（只用于非字符串片段）
    return s.replace(/\bTrue\b/g, "true").replace(/\bFalse\b/g, "false")
      .replace(/\bNone\b/g, "null").replace(/\band\b/g, "&&")
      .replace(/\bor\b/g, "||").replace(/\bnot\b/g, "!")
      .replace(/\brandom\s*\.\s*randint\b/g, "_rand").replace(/\brandom\s*\.\s*seed\b/g, "_seed")
      .replace(/\brandom\s*\.\s*choice\b/g, "_choice").replace(/\brandom\s*\.\s*shuffle\b/g, "_shuffle")
      .replace(/\brandint\s*\(/g, "_rand(").replace(/\bseed\s*\(/g, "_seed(").replace(/\bchoice\s*\(/g, "_choice(")
      .replace(/\blen\s*\(/g, "_len(").replace(/\bsum\s*\(/g, "_sum(")
      .replace(/\bmax\s*\(/g, "_max(").replace(/\bmin\s*\(/g, "_min(")
      .replace(/\bsorted\s*\(/g, "_sorted(").replace(/\babs\s*\(/g, "_abs(")
      .replace(/\bround\s*\(/g, "_round(").replace(/\bint\s*\(/g, "_int(")
      .replace(/\bfloat\s*\(/g, "_float(").replace(/\bstr\s*\(/g, "_s(")
      .replace(/\btype\s*\(/g, "_type(");
  }
  /** 中缀标记 → _in / _fdiv / _pow 调用（结果用哨兵包裹避免二次扫描） */
  function pyResolveOps(js) {
    for (var g = 0; g < 80; g++) {
      var a = js.indexOf(OP_NOTIN), b = js.indexOf(OP_IN), f = js.indexOf(OP_FDIV), w = js.indexOf(OP_POW);
      if (a < 0 && b < 0 && f < 0 && w < 0) return js;
      var p = Math.min.apply(null, [a, b, f, w].filter(function (x) { return x >= 0; }));
      var k = js.charAt(p);
      var L = grabBack(js, p), R = grabFwd(js, p + 1);
      // 一元正负号并入操作数：-7 // 2 是 (-7)//2，不能拆成 -(7//2)
      while (L.a > 0 && (js.charAt(L.a - 1) === "-" || js.charAt(L.a - 1) === "+")) {
        var pv = L.a >= 2 ? js.charAt(L.a - 2) : "";
        if (/[\w)\]$]/.test(pv)) break; // 前面是操作数结尾 → 这是二元加减号，不并入
        L.a--;
      }
      if ((js.charAt(R.a) === "-" || js.charAt(R.a) === "+") && /[\w(\["]/.test(js.charAt(R.a + 1) || "")) {
        R = { a: R.a, b: grabFwd(js, R.a + 1).b };
      }
      var rep;
      if (k === OP_FDIV || k === OP_POW) {
        rep = SN_O + (k === OP_FDIV ? "_fdiv(" : "_pow(") + js.slice(L.a, L.b) + ", " + js.slice(R.a, R.b) + ")" + SN_C;
      } else {
        rep = "(" + (k === OP_NOTIN ? "!" : "") + SN_O + "_in(" + js.slice(L.a, L.b) + ", " + js.slice(R.a, R.b) + ")" + SN_C + ")";
      }
      js = js.slice(0, L.a) + rep + js.slice(R.b);
    }
    return js;
  }
  function mRn(name) {
    return function (r, a) { return SN_O + r + "." + name + "(" + a + ")" + SN_C; };
  }
  /* Python 方法 → JS 重写表（r=接收者，a=参数原文） */
  var PY_METHODS = {
    append: function (r, a) { return SN_O + r + ".push(" + a + ")" + SN_C; },
    upper: function (r) { return SN_O + r + ".toUpperCase()" + SN_C; },
    lower: function (r) { return SN_O + r + ".toLowerCase()" + SN_C; },
    strip: function (r) { return SN_O + "_trim(" + r + ")" + SN_C; },
    capitalize: function (r) { return SN_O + "_cap(" + r + ")" + SN_C; },
    replace: function (r, a) { return SN_O + "_rep(" + r + ", " + a + ")" + SN_C; },
    split: function (r, a) { return SN_O + "_split(" + r + (a ? ", " + a : "") + ")" + SN_C; },
    join: function (r, a) { return SN_O + "(" + a + ").join(" + r + ")" + SN_C; },
    index: function (r, a) { return SN_O + r + ".indexOf(" + a + ")" + SN_C; },
    count: function (r, a) { return SN_O + "_count(" + r + ", " + a + ")" + SN_C; },
    sort: function (r) { return SN_O + "_pysort(" + r + ")" + SN_C; },
    reverse: mRn("reverse"),
    pop: function (r, a) { return SN_O + r + ".pop(" + a + ")" + SN_C; },
    insert: function (r, a) { return SN_O + r + ".splice(" + String(a).replace(",", ", 0,") + ")" + SN_C; },
    remove: function (r, a) { return SN_O + "_remove(" + r + ", " + a + ")" + SN_C; },
    startswith: mRn("startsWith"),
    endswith: mRn("endsWith"),
    keys: function (r) { return SN_O + "Object.keys(" + r + ")" + SN_C; },
    values: function (r) { return SN_O + "_dvals(" + r + ")" + SN_C; },
    get: function (r, a) { return SN_O + "_dget(" + r + ", " + a + ")" + SN_C; }
  };
  function stripSent(s) { return s.split(SN_O).join("").split(SN_C).join(""); }
  /** 负数字面量下标重写：X[-N] → _ix(X, -N)（读取） */
  function pyNegIx(js) {
    for (var g = 0; g < 40; g++) {
      var out = "", i = 0, n = js.length, changed = false;
      while (i < n) {
        var c = js.charAt(i);
        if (c === '"' || c === "'") {
          var e = strEnd(js, i);
          if (e < 0) { out += js.slice(i); break; }
          out += js.slice(i, e + 1); i = e + 1; continue;
        }
        if (c === SN_O) { var e5 = sentEnd(js, i); out += js.slice(i, e5 + 1); i = e5 + 1; continue; }
        if (c === "[") {
          var cb = matchFwd(js, i);
          if (cb > 0) {
            var inner = js.slice(i + 1, cb).trim();
            var nix = /^-(\d+)$/.exec(inner);
            if (nix) {
              var rb = grabBack(out, out.length);
              var recv = out.slice(rb.a, rb.b);
              out = out.slice(0, rb.a) + SN_O + "_ix(" + recv + ", -" + nix[1] + ")" + SN_C;
              i = cb + 1; changed = true; continue;
            }
          }
        }
        out += c; i++;
      }
      js = out;
      if (!changed) break;
    }
    return js;
  }
  /** 方法链重写：append→push、upper→toUpperCase、X.replace(a,b)→_rep(X,a,b)… */
  function pyMethods(js) {
    for (var pass = 0; pass < 15; pass++) {
      var out = "", i = 0, n = js.length, changed = false;
      while (i < n) {
        var c = js.charAt(i);
        if (c === '"' || c === "'") {
          var e = strEnd(js, i);
          if (e < 0) { out += js.slice(i); break; }
          out += js.slice(i, e + 1); i = e + 1; continue;
        }
        if (c === SN_O) { var e5 = sentEnd(js, i); out += js.slice(i, e5 + 1); i = e5 + 1; continue; }
        if (c === ".") {
          var mm = /^\.([A-Za-z_]\w*)\s*\(/.exec(js.slice(i));
          if (mm) {
            var fn = PY_METHODS[mm[1]];
            if (!fn) throw new Error("「" + mm[1] + "()」这个方法我还不会用。检查一下拼写，或看看本课教过的方法～");
            var ob = i + mm[0].length - 1;
            var cb = matchFwd(js, ob);
            if (cb < 0) throw new Error("「" + mm[1] + "(…)」的括号好像没有配对");
            var rb = grabBack(out, out.length);
            var recv = out.slice(rb.a, rb.b);
            out = out.slice(0, rb.a) + fn(recv, js.slice(ob + 1, cb));
            i = cb + 1; changed = true; continue;
          }
        }
        out += c; i++;
      }
      js = out;
      if (!changed) break;
    }
    return stripSent(js);
  }
  function pyExpr(e) {
    // 表达式翻译：f"..." 拆成字符串拼接；关键字替换只作用于引号外
    e = pyMarkOps(e);
    e = e.replace(/([fF])(["'])/g, function (m, f, q, off) {
      return (off === 0 || !/[A-Za-z0-9_]/.test(e.charAt(off - 1)) ? "\x01" + q : m);
    });
    var js = "", i = 0;
    while (i < e.length) {
      var c = e.charAt(i);
      if (c === '"' || c === "'") {
        var j = e.indexOf(c, i + 1);
        if (j < 0) throw new Error("引号好像没有成对：" + e);
        var body = e.slice(i + 1, j);
        if (e.charAt(i - 1) === "\x01") { // f-string：{ } 是填空位
          js = js.replace(/\x01$/, "");
          var segs = body.split(/(\{[^{}]*\})/), pieces = [], k;
          for (k = 0; k < segs.length; k++) {
            var sg = segs[k];
            if (!sg) continue;
            var bm = /^\{([^{}]*)\}$/.exec(sg);
            if (bm) {
              var fm = /^([\s\S]+):\.(\d+)f$/.exec(bm[1]);
              pieces.push(fm
                ? SN_O + "_s(_round(" + pyExpr(fm[1]) + ", " + fm[2] + ").toFixed(" + fm[2] + "))" + SN_C
                : "_s(" + pyExpr(bm[1]) + ")");
            }
            else pieces.push(c + sg + c); // _s=Python str()：True/False 大写
          }
          js += pieces.join(" + ");
        } else js += c + body + c;
        i = j + 1;
      } else {
        var k = i; // 整段非字符串文本一起做关键字替换（逐字替换会失配 \b）
        while (k < e.length && e.charAt(k) !== '"' && e.charAt(k) !== "'") k++;
        js += pyKw(e.slice(i, k));
        i = k;
      }
    }
    return pyMethods(pyNegIx(pyResolveOps(js)));
  }
  function pyTrans(src) {
    var lines = src.split(/\r?\n/), js = [], stack = [], decl = {};
    function pad(n) { var s = "", k; for (k = 0; k < n; k++) s += "  "; return s; }
    for (var li = 0; li < lines.length; li++) {
      var line = pyStripComment(lines[li]).replace(/\s+$/, "");
      if (!line.trim()) continue;
      if (line.indexOf("____") >= 0) throw new Error("第 " + (li + 1) + " 行还留着占位符 ____：先把它换成正确的关键字，再点运行");
      var indent = line.replace(/\t/g, "    ").match(/^\s*/)[0].length;
      var t = line.trim(), m;
      var ex = function (e) { // 带行号的表达式翻译
        try { return pyExpr(e); }
        catch (err) {
          throw new Error(/^第 \d+ 行/.test(err && err.message || "") ? err.message : "第 " + (li + 1) + " 行：" + (err && err.message || err));
        }
      };
      var isEl = /^(elif|else)\b/.test(t);
      // 收起已经结束的块（elif/else 要接管同级块，只收更深的）
      while (stack.length && (isEl ? stack[stack.length - 1] > indent : stack[stack.length - 1] >= indent)) {
        js.push(pad(stack.length - 1) + "}");
        stack.pop();
      }
      if (isEl) {
        if (!/:$/.test(t)) throw new Error("第 " + (li + 1) + " 行结尾少了冒号 :");
        if (!stack.length) throw new Error("第 " + (li + 1) + " 行的 " + (t.slice(0, 4) === "elif" ? "elif" : "else") + " 上面没有配对的 if");
        stack.pop();
        var mm = /^(elif|else)\s*(.*)$/.exec(t);
        js.push(pad(stack.length) + (mm[1] === "else" ? "} else {" : "} else if (" + ex(mm[2].replace(/:$/, "")) + ") {"));
        stack.push(indent);
        continue;
      }
      if ((m = /^if\s+(.+)\s*:$/.exec(t))) {
        js.push(pad(stack.length) + "if (" + ex(m[1]) + ") {");
        stack.push(indent);
        continue;
      }
      if ((m = /^while\s+(.+)\s*:$/.exec(t))) {
        js.push(pad(stack.length) + "while (" + ex(m[1]) + ") { _gl();");
        stack.push(indent);
        continue;
      }
      if ((m = /^for\s+([A-Za-z_]\w*)\s+in\s+range\s*\((.+)\)\s*:$/.exec(t))) {
        // range 单参/双参/三参（支持负步长倒数）；步长为 0 直接拦下
        var args = splitTop(m[2]).map(function (s) { return s.trim(); }), v = m[1];
        if (args.length >= 3) {
          if (/^-?\d+(\.\d+)?$/.test(args[2]) && parseFloat(args[2]) === 0) throw new Error("第 " + (li + 1) + " 行：range 的步长不能是 0，不然永远走不完哦～");
          var a3 = ex(args[0]), b3 = ex(args[1]), s3 = ex(args[2]);
          js.push(pad(stack.length) + "for (var " + v + " = " + a3 + "; " + s3 + " > 0 ? " + v + " < " + b3 + " : " + v + " > " + b3 + "; " + v + " += " + s3 + ") {");
        } else {
          var a = args[0], b = args.length > 1 ? args[1] : null;
          js.push(pad(stack.length) + "for (var " + v + " = " + (b ? ex(a) : "0") + "; " + v + " < " + ex(b || a) + "; " + v + "++) {");
        }
        stack.push(indent);
        continue;
      }
      if ((m = /^for\s+([A-Za-z_]\w*)\s+in\s+(.+)\s*:$/.exec(t))) {
        // for-in 容器：列表/字符串/字典（_iter 统一转数组）
        var itn = "it" + li, ixn = "ix" + li;
        js.push(pad(stack.length) + "var " + itn + " = _iter(" + ex(m[2]) + "); for (var " + ixn + " = 0; " + ixn + " < " + itn + ".length; " + ixn + "++) { var " + m[1] + " = " + itn + "[" + ixn + "];");
        stack.push(indent);
        continue;
      }
      if ((m = /^def\s+([A-Za-z_]\w*)\s*\((.*)\)\s*:$/.exec(t))) {
        js.push(pad(stack.length) + "function " + m[1] + "(" + m[2] + ") {");
        stack.push(indent);
        continue;
      }
      if ((m = /^return\b\s*(.*)$/.exec(t))) {
        js.push(pad(stack.length) + "return" + (m[1] ? " " + ex(m[1]) : "") + ";");
        continue;
      }
      if (t === "break" || t === "continue") { js.push(pad(stack.length) + t + ";"); continue; }
      if (t === "pass") { js.push(pad(stack.length) + ";"); continue; }
      if (/^(import|from)\b/.test(t)) continue; // 导入忽略：内置与随机数已就位
      if ((m = /^print\s*\((.*)\)$/.exec(t))) {
        var parts = splitTop(m[1]), pos = [], kwS = "null", kwE = "null";
        for (var pi = 0; pi < parts.length; pi++) {
          var sg = parts[pi].trim();
          if (!sg) continue;
          var km = /^(sep|end)\s*=\s*([\s\S]+)$/.exec(sg);
          if (km) { if (km[1] === "sep") kwS = ex(km[2]); else kwE = ex(km[2]); }
          else pos.push(ex(sg));
        }
        js.push(pad(stack.length) + "_p([" + pos.join(", ") + "], " + kwS + ", " + kwE + ");");
        continue;
      }
      if ((m = /^([A-Za-z_]\w*\s*(?:\[[^\]]*\]\s*)*)(\+=|-=|\*=|\/\/=|\/=|=)(?!=)\s*([\s\S]+)$/.exec(t))) {
        // 赋值：普通变量 / 下标与键 / 复合赋值（一行一个目标；//= 需排在 /= 之前）
        var lhsRaw = m[1].trim(), op = m[2], nm = lhsRaw.replace(/\s+/g, "");
        var isPlain = /^[A-Za-z_]\w*$/.test(lhsRaw);
        if (op !== "=" && isPlain && !decl[nm]) throw new Error("第 " + (li + 1) + " 行：变量「" + nm + "」还没赋值，不能直接用 " + op + " 哦");
        var lhs = ex(lhsRaw);
        if (lhsRaw.indexOf("[") >= 0 && lhs.indexOf("_ix(") >= 0) throw new Error("第 " + (li + 1) + " 行：给负数下标赋值我还不会，试试用 len(列表) - 1 定位最后一个～");
        var rhs = ex(m[3]);
        var calc = op === "=" ? rhs
          : op === "+=" ? lhs + " + " + rhs
          : op === "-=" ? lhs + " - " + rhs
          : op === "*=" ? lhs + " * " + rhs
          : "_fdiv(" + lhs + ", " + rhs + ")"; // /= 与 //= 都走整除
        var pre = "";
        if (op === "=" && isPlain) { pre = decl[nm] ? "" : "var "; decl[nm] = true; }
        js.push(pad(stack.length) + pre + lhs + " = " + calc + ";");
        continue;
      }
      // 表达式语句兜底（方法调用、random.seed 等）
      js.push(pad(stack.length) + ex(t) + ";");
    }
    while (stack.length) { js.push(pad(stack.length - 1) + "}"); stack.pop(); }
    return js.join("\n");
  }
  /* ---------------- RT 运行时（每次运行独立：种子 / 行缓冲 / 循环护栏） ---------------- */
  var PY_FN_NAMES = ["_p", "_s", "_len", "_sum", "_max", "_min", "_sorted", "_in", "_round", "_int", "_float", "_fdiv", "_pow", "_abs", "_rep", "_split", "_trim", "_cap", "_count", "_remove", "_pysort", "_dget", "_dvals", "_iter", "_ix", "_type", "_rand", "_seed", "_choice", "_shuffle", "_gl"];
  function makeRT(out) {
    var seed = 20261019, buf = "", guard = 0;
    function rnd() { // mulberry32 固定种子伪随机：任务输出可复现
      seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    function numStr(v) { return Number.isInteger(v) ? String(v) : String(Math.round(v * 1e9) / 1e9); }
    function repr(v) { // Python 风味打印：True/False/None、'字符串'、[1, 2]、{'键': 值}
      if (v === true) return "True";
      if (v === false) return "False";
      if (v === null || v === undefined) return "None";
      if (typeof v === "number") return numStr(v);
      if (typeof v === "string") return v;
      if (Array.isArray(v)) return "[" + v.map(function (x) { return typeof x === "string" ? "'" + x + "'" : repr(x); }).join(", ") + "]";
      if (typeof v === "object") return "{" + Object.keys(v).map(function (k) {
        return "'" + k + "': " + (typeof v[k] === "string" ? "'" + v[k] + "'" : repr(v[k]));
      }).join(", ") + "}";
      return String(v);
    }
    function byNum(a, b) { return a - b; }
    return {
      _p: function (vals, sep, end) { // print：sep 连接 + end 结尾，行缓冲冲刷
        buf += (vals || []).map(repr).join(sep === null || sep === undefined ? " " : sep) + (end === null || end === undefined ? "\n" : end);
        var ix;
        while ((ix = buf.indexOf("\n")) >= 0) { out.push(buf.slice(0, ix)); buf = buf.slice(ix + 1); }
      },
      flush: function () { if (buf) { out.push(buf); buf = ""; } },
      _s: repr,
      _len: function (x) {
        if (typeof x === "string" || Array.isArray(x)) return x.length;
        if (x && typeof x === "object") return Object.keys(x).length;
        throw new Error("len() 数不了这个东西，它需要一个字符串、列表或字典");
      },
      _sum: function (a) {
        if (!Array.isArray(a)) throw new Error("sum() 需要一个列表，比如 sum([1, 2, 3])");
        return a.reduce(function (s, x) { return s + x; }, 0);
      },
      _max: function (a) {
        var arr = Array.isArray(a) && arguments.length === 1 ? a : Array.prototype.slice.call(arguments);
        if (!arr.length) throw new Error("max() 不能对空的东西取最大值");
        return Math.max.apply(null, arr);
      },
      _min: function (a) {
        var arr = Array.isArray(a) && arguments.length === 1 ? a : Array.prototype.slice.call(arguments);
        if (!arr.length) throw new Error("min() 不能对空的东西取最小值");
        return Math.min.apply(null, arr);
      },
      _sorted: function (a) {
        if (!Array.isArray(a)) throw new Error("sorted() 需要一个列表");
        var c = a.slice();
        return c.sort(c.every(function (v) { return typeof v === "number"; }) ? byNum : undefined);
      },
      _pysort: function (a) { return a.sort(a.every(function (v) { return typeof v === "number"; }) ? byNum : undefined); },
      _in: function (x, c) {
        if (typeof c === "string") return c.indexOf(String(x)) >= 0;
        if (Array.isArray(c)) return c.indexOf(x) >= 0;
        if (c && typeof c === "object") return Object.prototype.hasOwnProperty.call(c, String(x));
        throw new Error("in 只能用在字符串、列表或字典里哦");
      },
      _round: function (x, n) {
        if (n === undefined || n === null) return Math.round(x);
        var f = Math.pow(10, n);
        return Math.round(x * f) / f;
      },
      _int: function (v) {
        var n = parseInt(String(v).trim(), 10);
        if (isNaN(n)) throw new Error("「" + String(v) + "」没法变成整数（int），检查一下它的内容～");
        return n;
      },
      _float: function (v) {
        var n = parseFloat(String(v).trim());
        if (isNaN(n)) throw new Error("「" + String(v) + "」没法变成小数（float），检查一下它的内容～");
        return n;
      },
      _fdiv: function (a, b) { if (!b) throw new Error("除数不能是 0 哦"); return Math.floor(a / b); },
      _pow: function (a, b) { return Math.pow(a, b); },
      _abs: function (x) { return Math.abs(x); },
      _rep: function (s, a, b) { return String(s).split(a).join(b); },
      _split: function (s, sep) { return sep === undefined || sep === null ? String(s).trim().split(/\s+/) : String(s).split(sep); },
      _trim: function (s) { return String(s).trim(); },
      _cap: function (s) { s = String(s); return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(); },
      _count: function (c, x) { return Array.isArray(c) ? c.filter(function (v) { return v === x; }).length : String(c).split(x).length - 1; },
      _remove: function (arr, v) { var i = arr.indexOf(v); if (i >= 0) arr.splice(i, 1); return arr; },
      _dget: function (d, k, dv) {
        return Object.prototype.hasOwnProperty.call(d, String(k)) ? d[String(k)] : (arguments.length >= 3 ? dv : null);
      },
      _dvals: function (d) { return Object.keys(d).map(function (k) { return d[k]; }); },
      _iter: function (x) {
        if (Array.isArray(x)) return x;
        if (typeof x === "string") return x.split("");
        if (x && typeof x === "object") return Object.keys(x);
        throw new Error("for 现在只能遍历列表、字符串和字典哦");
      },
      _ix: function (arr, i) { return arr[i < 0 ? arr.length + i : i]; },
      _type: function (v) {
        if (typeof v === "boolean") return "bool";
        if (typeof v === "number") return Number.isInteger(v) ? "int" : "float";
        if (typeof v === "string") return "str";
        if (Array.isArray(v)) return "list";
        if (v && typeof v === "object") return "dict";
        return "NoneType";
      },
      _rand: function (a, b) { return a + Math.floor(rnd() * (b - a + 1)); },
      _seed: function (n) { seed = (n | 0) || 1; },
      _choice: function (a) { return a[Math.floor(rnd() * a.length)]; },
      _shuffle: function (a) {
        for (var i = a.length - 1; i > 0; i--) {
          var j = Math.floor(rnd() * (i + 1)), tmp = a[i]; a[i] = a[j]; a[j] = tmp;
        }
        return a;
      },
      _gl: function () { // while 死循环护栏：10 万圈强制刹车
        if (++guard > 100000) throw new Error("循环好像停不下来了！检查 while 的条件会不会变成 False（循环里要记得改变条件里的变量）");
      }
    };
  }
  /** 运行期错误翻译成白话 */
  function pyFriendly(e) {
    var msg = e && e.message ? e.message : String(e);
    var nf = /(\w+) is not defined/.exec(msg);
    if (nf) return "运行出错了：变量「" + nf[1] + "」还没赋值就先用啦。先给它一个值，再点运行试试～";
    var fn = /([\w$.]+) is not a function/.exec(msg);
    if (fn) return "运行出错了：「" + fn[1] + "」不能这样调用。检查拼写，或看看本课教过的写法～";
    if (/^第 \d+ 行/.test(msg) || msg.indexOf("循环好像停不下来") === 0) return msg;
    return "运行出错了：" + msg;
  }
  /** 运行入口：返回 {ok:true, out:[行]} 或 {ok:false, err:友好报错} */
  function pyRun(src) {
    var out = [], rt = makeRT(out);
    try {
      var js = pyTrans(src);
      var head = "var " + PY_FN_NAMES.map(function (n) { return n + " = RT." + n; }).join(", ") + ";\n";
      new Function("RT", head + js)(rt);
      rt.flush();
      return { ok: true, out: out };
    } catch (e) {
      rt.flush(); // 报错前把缓冲里那半行也吐出来，方便对照
      return { ok: false, err: pyFriendly(e) };
    }
  }

  /* ---------------- Python 语法高亮（零依赖，供 IDE 运行器叠层使用） ---------------- */
  var PY_KW = { if: 1, elif: 1, else: 1, while: 1, for: 1, in: 1, def: 1, return: 1, and: 1, or: 1, not: 1, True: 1, False: 1, None: 1, import: 1, from: 1, as: 1, pass: 1, break: 1, continue: 1 };
  var PY_FN = { print: 1, range: 1, type: 1, len: 1, str: 1, int: 1, float: 1, sum: 1, max: 1, min: 1, sorted: 1, abs: 1, round: 1, seed: 1, randint: 1, choice: 1 };
  var PY_MTH = { append: 1, pop: 1, upper: 1, lower: 1, strip: 1, capitalize: 1, replace: 1, split: 1, join: 1, index: 1, count: 1, sort: 1, reverse: 1, insert: 1, remove: 1, startswith: 1, endswith: 1, keys: 1, values: 1, get: 1 };
  function hEsc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function pyHighlight(src) {
    var out = "", i = 0, n = src.length, prev = "";
    while (i < n) {
      var c = src.charAt(i);
      if (c === "#") { // 注释到行尾
        var j = src.indexOf("\n", i); if (j < 0) j = n;
        out += '<i class="cm">' + hEsc(src.slice(i, j)) + "</i>"; i = j; prev = ""; continue;
      }
      var isF = (c === "f" || c === "F") && (src.charAt(i + 1) === '"' || src.charAt(i + 1) === "'") && (i === 0 || !/[A-Za-z0-9_]/.test(src.charAt(i - 1)));
      var q = isF ? src.charAt(i + 1) : (c === '"' || c === "'") ? c : null;
      if (q) {
        var s0 = isF ? i + 2 : i + 1, e0 = s0;
        while (e0 < n && src.charAt(e0) !== q) { if (src.charAt(e0) === "\\") e0++; e0++; }
        if (e0 < n) {
          var body = src.slice(s0, e0);
          if (isF) { // f-string：{ } 填空位单独提亮
            var fx = hEsc(body).replace(/\{[^{}\n]*\}/g, function (m) { return '<i class="fx">' + m + "</i>"; });
            out += '<i class="str">f' + q + fx + q + "</i>";
          } else out += '<i class="str">' + q + hEsc(body) + q + "</i>";
          i = e0 + 1; prev = q; continue;
        }
      }
      var idm = /^[A-Za-z_]\w*/.exec(src.slice(i, i + 40));
      if (idm) {
        var w = idm[0], nx = src.charAt(i + w.length);
        if (PY_KW[w]) out += '<i class="kw">' + w + "</i>";
        else if (PY_MTH[w] && prev === "." && nx === "(") out += '<i class="mth">' + w + "</i>";
        else if (PY_FN[w] && nx === "(") out += '<i class="fn">' + w + "</i>";
        else out += hEsc(w);
        i += w.length; prev = w; continue;
      }
      var nm = /^\d+(?:\.\d+)?/.exec(src.slice(i, i + 24));
      if (nm) { out += '<i class="num">' + nm[0] + "</i>"; i += nm[0].length; prev = "0"; continue; }
      out += hEsc(c); i++; prev = c;
    }
    return out;
  }

  /* ---------------- IDE 运行器增强：行号 + 叠层高亮 + Tab 缩进 + Ctrl+Enter 运行 + TODO 自动选中 ---------------- */
  function ideEnhance() {
    document.querySelectorAll(".code-run").forEach(function (box) {
      if (box.dataset.ide) return;
      var ta = box.querySelector("textarea"), bar = box.querySelector(".cr-bar");
      if (!ta || !bar) return;
      if (!bar.querySelector(".cr-lang")) {
        var lang = document.createElement("span");
        lang.className = "cr-lang";
        lang.textContent = "Python 3";
        bar.appendChild(lang);
      }
      box.dataset.ide = "1";
      var stage = document.createElement("div"); stage.className = "cr-stage";
      var gut = document.createElement("div"); gut.className = "cr-gutter"; gut.setAttribute("aria-hidden", "true");
      var canvas = document.createElement("div"); canvas.className = "cr-canvas";
      var hl = document.createElement("pre"); hl.className = "cr-hl"; hl.setAttribute("aria-hidden", "true");
      canvas.appendChild(hl); canvas.appendChild(ta);
      stage.appendChild(gut); stage.appendChild(canvas);
      bar.after(stage);
      function sync() {
        var v = ta.value;
        hl.innerHTML = pyHighlight(v) + "\n";
        hl.style.transform = "translate(" + -ta.scrollLeft + "px," + -ta.scrollTop + "px)";
        var g = "", k, lines = v.split("\n").length;
        for (k = 1; k <= lines; k++) g += k + "\n";
        gut.textContent = g;
        gut.scrollTop = ta.scrollTop;
      }
      ta.addEventListener("input", sync);
      ta.addEventListener("scroll", sync);
      ta.addEventListener("keydown", function (e) {
        if (e.key === "Tab" && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          var s = ta.selectionStart, t = ta.selectionEnd, v = ta.value;
          if (s !== t && v.slice(s, t).indexOf("\n") >= 0) {
            var ls = v.lastIndexOf("\n", s - 1) + 1;
            var block = v.slice(ls, t);
            var mod = e.shiftKey ? block.replace(/^ {1,2}/gm, "") : block.replace(/^/gm, "  ");
            ta.setSelectionRange(ls, t);
            ta.setRangeText(mod, ls, t, "end");
          } else if (e.shiftKey) {
            var ls2 = v.lastIndexOf("\n", s - 1) + 1;
            var lead = /^[ \t]*/.exec(v.slice(ls2))[0].slice(0, 2);
            if (lead) { ta.setSelectionRange(ls2, ls2 + lead.length); ta.setRangeText("", ls2, ls2 + lead.length, "end"); }
          } else ta.setRangeText("  ", ta.selectionStart, ta.selectionEnd, "end");
          sync();
        } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
          e.preventDefault();
          var rb = box.querySelector('[data-act="run"]');
          if (rb) rb.click();
        }
      });
      ta.addEventListener("focus", function () {
        var at = ta.value.indexOf("____");
        if (at >= 0) setTimeout(function () { ta.setSelectionRange(at, at + 4); }, 0);
        sync();
      });
      // reset 按钮会整块重写 value，点击后补一次同步
      box.addEventListener("click", function (e) {
        if (e.target.closest("[data-act]")) setTimeout(sync, 0);
      });
      setTimeout(sync, 0); // 页面脚本在 boot 之后才灌入初始代码
    });
  }

  /* ---------------- 任务运行器 / 练习运行器（公共组件，页面零重复） ---------------- */
  function outEsc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function noOutHint(out) {
    out.innerHTML = '<span style="color:#A99E85">（没有输出。检查一下是不是漏了 print()？）</span>';
  }
  /**
   * 任务运行器：改代码命中目标输出（与 lesson-01..03 原内联 runner 行为一致）
   * cfg: { initial, goal:[行…], name, onPass }
   */
  function taskRunner(boxId, cfg) {
    var root = document.getElementById(boxId);
    if (!root) return;
    var ta = root.querySelector("textarea");
    var out = root.querySelector(".cr-out");
    var flag = root.querySelector(".cr-flag");
    ta.value = cfg.initial;
    ta.addEventListener("input", function () { flag.style.display = "none"; });
    function act(name) {
      if (name === "reset") {
        ta.value = cfg.initial;
        flag.style.display = "none";
        out.textContent = "点「运行代码」查看输出";
        return;
      }
      out.innerHTML = "";
      var res = pyRun(ta.value);
      if (!res.ok) {
        out.innerHTML = '<div class="cr-err">' + outEsc(res.err) + "</div>";
        sfx("retry");
        return;
      }
      if (!res.out.length) { noOutHint(out); return; }
      res.out.forEach(function (l) { out.insertAdjacentHTML("beforeend", "<div>" + outEsc(l) + "</div>"); });
      var norm = res.out.map(function (l) { return l.trim(); });
      if (JSON.stringify(norm) === JSON.stringify(cfg.goal)) {
        sfx("right");
        flag.textContent = "✓ 目标达成";
        flag.style.display = "inline";
        if (cfg.onPass) cfg.onPass(cfg.name || boxId);
      } else {
        sfx("retry");
        flag.textContent = "输出和目标还不一致";
        flag.style.color = "var(--accent-2)";
        flag.style.display = "inline";
        setTimeout(function () { flag.style.color = "var(--green)"; }, 900);
      }
    }
    root.addEventListener("click", function (e) {
      var b = e.target.closest("[data-act]");
      if (b) act(b.getAttribute("data-act"));
    });
  }
  /**
   * 自由编码练习运行器：运行 / 还原 / 填入参考答案（无通关目标）
   * cfg: { initial, ref, file }
   */
  function practiceRunner(boxId, cfg) {
    var root = document.getElementById(boxId);
    if (!root) return;
    var ta = root.querySelector("textarea");
    var out = root.querySelector(".cr-out");
    var flag = root.querySelector(".cr-flag");
    ta.value = cfg.initial || "";
    function setCode(v, say) {
      ta.value = v;
      ta.dispatchEvent(new Event("input")); // 触发叠层高亮同步
      if (flag) {
        flag.textContent = say;
        flag.classList.add("ref");
        flag.style.display = "inline";
      }
    }
    root.addEventListener("click", function (e) {
      var b = e.target.closest("[data-act]");
      if (!b) return;
      var name = b.getAttribute("data-act");
      if (name === "ref") { sfx("toggle"); setCode(cfg.ref, "已填入参考答案，点「运行代码」看看效果"); return; }
      if (name === "reset") {
        ta.value = cfg.initial || "";
        ta.dispatchEvent(new Event("input"));
        if (flag) flag.style.display = "none";
        out.textContent = "点「运行代码」查看输出";
        return;
      }
      out.innerHTML = "";
      if (flag) flag.style.display = "none";
      var res = pyRun(ta.value);
      if (!res.ok) { out.innerHTML = '<div class="cr-err">' + outEsc(res.err) + "</div>"; sfx("retry"); return; }
      if (!res.out.length) { noOutHint(out); return; }
      res.out.forEach(function (l) { out.insertAdjacentHTML("beforeend", "<div>" + outEsc(l) + "</div>"); });
      sfx("click");
    });
  }

  /* ---------------- 页面框架注入 ---------------- */
  var NAVS = [
    { key: "binary", href: "binary/lesson-01.html", ic: "lantern", t: "花灯密码" },
    { key: "ai", href: "ai/lesson-01.html", ic: "robot", t: "AI 课堂" },
    { key: "coding", href: "coding/lesson-01.html", ic: "boat", t: "编程航线" },
    { key: "safety", href: "safety/lesson-01.html", ic: "wall", t: "城墙卫士" },
    { key: "terms", href: "ai-terms/lesson-01.html", ic: "brain", t: "术语解码" },
    { key: "lab", href: "code-lab/lesson-01.html", ic: "code", t: "代码实验" }
  ];
  function chipHtml(stones) {
    return '<span class="stone-chip" data-stone-chip title="我的雨花石">' + icon("stone") + "<b>" + stones + "</b></span>";
  }
  function refreshChips() {
    var n = store.get().stones;
    document.querySelectorAll("[data-stone-chip] b").forEach(function (b) { b.textContent = n; });
  }

  var MODULE_META = _CAT
    ? (function () {
        var o = {};
        MODULES.forEach(function (k) {
          var m = _CAT[k];
          o[k] = {
            name: m.name, scene: m.scene, ic: m.ic, color: m.color,
            level: m.level || "entry", dir: m.dir || k,
            game: (m.game && m.game.file) ? m.game.file.replace(/^game-/, "").replace(/\.html$/, "") : k
          };
        });
        return o;
      })()
    : {
        binary: { name: "二进制的秘密", scene: "秦淮花灯", ic: "lantern", color: "var(--gold)", level: "entry", dir: "binary", game: "lightbulb" },
        ai: { name: "AI 小课堂", scene: "红山动物园", ic: "robot", color: "var(--accent)", level: "entry", dir: "ai", game: "trainer" },
        coding: { name: "编程初体验", scene: "秦淮画舫", ic: "boat", color: "var(--green)", level: "entry", dir: "coding", game: "maze" },
        safety: { name: "城墙小卫士", scene: "南京明城墙", ic: "wall", color: "var(--cyan)", level: "entry", dir: "safety", game: "shield" },
        terms: { name: "AI 术语解码", scene: "金陵图书馆", ic: "brain", color: "var(--purple)", level: "advanced", dir: "ai-terms", game: "match" },
        lab: { name: "代码实验室", scene: "紫峰实验室", ic: "code", color: "var(--cyan)", level: "advanced", dir: "code-lab", game: "puzzle" }
      };

  /* ---------------- 课程侧栏（文档站式双栏骨架，boot 注入，页面零手写） ---------------- */
  function railItem(href, file, label, ic, done, cur) {
    return '<a class="rail-item' + (cur ? " cur" : "") + (done ? " done" : "") + '" href="' + href + '">' +
      '<span class="ri-dot">' + (done ? icon("check") : "") + "</span>" + icon(ic) +
      '<span class="ri-t">' + label + "</span></a>";
  }
  function mountShell(module, root) {
    if (MODULES.indexOf(module) < 0) return;
    var meta = MODULE_META[module], p = load();
    var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    var items = "";
    if (module === "lab") items += railItem(root + "/code-lab/pre.html", "pre.html", "第 0 课 · 准备", "book", false, page === "pre.html");
    for (var i = 0; i < LESSON_COUNT[module]; i++) {
      var f = "lesson-0" + (i + 1) + ".html";
      items += railItem(root + "/" + meta.dir + "/" + f, f, "第 " + (i + 1) + " 课", "book", p.modules[module].lessons[i] > 0, page === f);
    }
    var gf = "game-" + meta.game + ".html";
    items += railItem(root + "/" + meta.dir + "/" + gf, gf, "闯关游戏", "gamepad", p.modules[module].game > 0, page === gf);
    items += railItem(root + "/" + meta.dir + "/quiz.html", "quiz.html", "挑战测验", "quiz", p.modules[module].quiz > 0, page === "quiz.html");
    var shell = document.createElement("div");
    shell.className = "shell";
    shell.innerHTML =
      '<aside class="rail' + (meta.level === "advanced" ? " rail-adv" : "") + '" aria-label="' + meta.name + ' 课程导航">' +
      '<div class="rail-head"><span class="rail-ic" style="color:' + meta.color + '">' + icon(meta.ic) + "</span>" +
      '<div class="rail-tt"><div class="rail-name">' + meta.name + '</div><div class="rail-scene">场景 · ' + meta.scene + "</div></div></div>" +
      '<nav class="rail-nav">' + items + "</nav></aside>" +
      '<div class="shell-main"></div>';
    var header = document.getElementById("site-header");
    document.body.insertBefore(shell, header ? header.nextSibling : document.body.firstChild);
    var main = document.querySelector("main.wrap");
    if (main) shell.querySelector(".shell-main").appendChild(main);
  }

  /** 进阶航道门禁：入门航线未全部通关时，在进阶页面显示解锁说明 */
  function mountLockGate(root) {
    var missing = LEVELS.entry.filter(function (m) { return !store.moduleDone(m); })
      .map(function (m) { return MODULE_META[m].name; });
    var gate = document.createElement("div");
    gate.className = "lock-gate";
    gate.innerHTML = '<div class="lg-card" role="dialog" aria-modal="true" aria-labelledby="lg-title">' +
      '<div class="lg-ic">' + icon("lock") + "</div>" +
      '<h2 id="lg-title">进阶航道尚未开启</h2>' +
      "<p>先通关入门航线的全部关卡（含闯关游戏与挑战测验），进阶航道就会为你打开。还差：" + missing.join("、") + "。</p>" +
      '<a class="btn" href="' + root + '/index.html">' + icon("arrowLeft") + "回到首页继续闯关</a>" +
      "</div>";
    document.body.appendChild(gate);
    document.body.classList.add("gated");
  }

  function boot(opts) {
    opts = opts || {};
    var root = opts.root || ".";
    var module = opts.module || null;
    var header = document.getElementById("site-header");
    if (header) {
      var nav = '<a href="' + root + '/index.html" class="' + (!module ? "active" : "") + '">' + icon("home") + "首页</a>";
      NAVS.forEach(function (n) {
        nav += '<a href="' + root + "/" + n.href + '" class="' + (module === n.key ? "active" : "") + '">' + icon(n.ic) + n.t + "</a>";
      });
      nav += '<a href="' + root + '/achievements/index.html" class="' + (module === "achv" ? "active" : "") + '">' + icon("trophy") + "成就墙</a>";
      header.innerHTML =
        '<div class="bar">' +
        '<a class="logo" href="' + root + '/index.html"><span class="logo-ic">' + icon("doudou") + '</span>豆苗学堂</a>' +
        '<div class="bar-tools">' +
        chipHtml(store.get().stones) +
        '<button class="icon-btn" id="pinyin-btn" title="拼音点读：点汉字显示读音">' + icon("pinyin") + "</button>" +
        '<button class="icon-btn" id="mute-btn" title="音效开关">' + icon(muted ? "speakerOff" : "speaker") + "</button>" +
        "</div>" +
        '<nav class="nav">' + nav + "</nav>" +
        "</div>";
      var pb = document.getElementById("pinyin-btn");
      pb.addEventListener("click", function () { pyToggle(pb); });
      pyOn = !!(window.DMStorage.settings.get() && window.DMStorage.settings.get().pinyinOn);
      pb.classList.toggle("on", pyOn);
      pyBindDoc(); // 点读模式：全局点击出气泡（仅 pyOn 时生效）
      if (pyOn && window.matchMedia && matchMedia("(pointer:fine)").matches) pyBindHover();
      var mb = document.getElementById("mute-btn");
      mb.addEventListener("click", function () { toggleMute(mb); });
    }
    var footer = document.getElementById("site-footer");
    if (footer) {
      footer.innerHTML =
        '<div class="site-footer">' +
        wallSvg() +
        '<div class="foot-inner">' +
        '<div class="foot-links">' +
        '<a href="' + root + '/index.html">首页</a>' +
        '<a href="' + root + '/achievements/index.html">我的成就</a>' +
        "</div>" +
        "豆苗逐智 · 童享科技 — 少儿 AI 与计算机公益科普 · 公益免费 · 家长指引：本页无需注册、不联网收集信息</div></div>";
    }
    injectEyecare();
    startEyecareTimer();
    refreshChips();
    if (module === "terms" || module === "lab") document.body.classList.add("adv");
    mountShell(module, root);
    if (module && MODULE_META[module] && MODULE_META[module].level === "advanced" && !entryCleared()) mountLockGate(root);
    ideEnhance();
    rvAll(); // 入场动效：静态内容页零改动受益；动态渲染页在渲染完成后补调 DM.rvAll()
  }

  /* ---------------- 入场动效系统（rv / count / ring） ---------------- */
  var RM = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);

  /** 环形进度 SVG：ring-fg 从空环过渡到 p%；中心数字随 data-count 滚动 */
  function ring(p, size, stroke, cls) {
    p = Math.max(0, Math.min(100, +p || 0));
    size = size || 46; stroke = stroke || 4.5;
    var r = (size - stroke) / 2, c = size / 2;
    return '<svg class="dm-ring' + (cls ? " " + cls : "") + '" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + " " + size + '" data-p="' + p + '" role="img" aria-label="进度 ' + p + '%">' +
      '<circle class="ring-bg" cx="' + c + '" cy="' + c + '" r="' + r + '" fill="none" stroke-width="' + stroke + '"/>' +
      '<circle class="ring-fg" cx="' + c + '" cy="' + c + '" r="' + r + '" fill="none" stroke-width="' + stroke + '" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" stroke-linecap="round" transform="rotate(-90 ' + c + " " + c + ')"/>' +
      '<text class="ring-num" x="' + c + '" y="' + (c + 4) + '" text-anchor="middle" data-count="' + p + '">0</text></svg>';
  }

  /** 数字滚动：对 [data-count] 元素做 rAF easeOut 计数 */
  function count(el) {
    if (!el || el.__counted) return;
    el.__counted = true;
    var target = +el.getAttribute("data-count") || 0;
    if (RM || !window.requestAnimationFrame) { el.textContent = target; return; }
    var t0 = null, dur = 1100;
    (function step(ts) {
      if (t0 === null) t0 = ts;
      var k = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(target * e);
      if (k < 1) requestAnimationFrame(step);
    })(performance.now());
  }

  /** 激活容器内未触发的 ring / count */
  function activate(box) {
    if (box.matches && box.matches("[data-count]")) count(box);
    if (box.querySelectorAll) {
      box.querySelectorAll("[data-count]").forEach(count);
      box.querySelectorAll(".dm-ring .ring-fg").forEach(function (c) {
        var svg = c.closest ? c.closest(".dm-ring") : null;
        if (!svg) return;
        var p = Math.max(0, Math.min(100, +svg.getAttribute("data-p") || 0));
        requestAnimationFrame(function () { c.style.strokeDashoffset = 100 - p; });
      });
    }
  }

  /**
   * 全站入场动效扫描（幂等，可重复调用）：
   * ① 手动 [data-rv]；② section 级容器自动入场；③ 网格子项 stagger（上限 8/12）
   * 无 IntersectionObserver 或 prefers-reduced-motion 时全部直接显示
   */
  var rvPrepared = typeof window.WeakSet === "function" ? new WeakSet() : null;
  function rvMark(el, variant, i) {
    if (rvPrepared && rvPrepared.has(el)) return;
    if (rvPrepared) rvPrepared.add(el); else if (el.__rv) return; else el.__rv = true;
    el.setAttribute("data-rv", variant || "up");
    if (i != null) el.style.setProperty("--i", i);
  }
  var rvIO = null;
  function rvAll() {
    document.documentElement.classList.add("rv-ready");
    // section 级容器：内含自动 stagger 网格的除外（避免双重动画）
    var secs = document.querySelectorAll("main .panel, .game-stage, .path-sec, .resume-banner");
    for (var i = 0; i < secs.length; i++) {
      if (secs[i].querySelector(".path-grid, .badge-grid, .stone-wall")) continue;
      if (!secs[i].closest("[data-rv]")) rvMark(secs[i], "up", null);
    }
    // 网格子项 stagger（rvMark 幂等，动态重渲染后补调 rvAll 会只标记新节点）
    var grids = document.querySelectorAll(".path-grid .path-card, .badge-grid .badge-card, .stone-wall svg");
    var gcap = {};
    for (var j = 0; j < grids.length; j++) {
      var el = grids[j];
      var fam = el.closest(".stone-wall") ? "stone" : (el.closest(".badge-grid") ? "badge" : "path");
      if (gcap[fam] == null) gcap[fam] = 0;
      rvMark(el, fam === "stone" ? "pop" : "up", Math.min(gcap[fam], fam === "stone" ? 11 : 7));
      gcap[fam]++;
    }
    var all = document.querySelectorAll("[data-rv]");
    if (RM || !("IntersectionObserver" in window)) {
      for (var k = 0; k < all.length; k++) { all[k].classList.add("rv-on"); activate(all[k]); }
      return;
    }
    if (!rvIO) {
      rvIO = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add("rv-on");
          activate(en.target);
          rvIO.unobserve(en.target);
        });
      }, { threshold: 0.12 });
    }
    for (var m = 0; m < all.length; m++) if (!all[m].classList.contains("rv-on")) rvIO.observe(all[m]);
  }

  function wallSvg() {
    // 明城墙剪影（线性风格）
    var b = "", x = 0, unit = 56;
    for (var i = 0; i < 22; i++) {
      b += '<rect x="' + x + '" y="' + (i % 2 ? 14 : 6) + '" width="34" height="10" rx="3" fill="none" stroke="currentColor" stroke-width="2.5"/>';
      x += unit - (i % 2 ? 14 : 4);
    }
    return '<svg class="wall-line" viewBox="0 0 1200 42" preserveAspectRatio="none" aria-hidden="true">' + b + '<line x1="0" y1="30" x2="1200" y2="30" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>';
  }

  /* ---------------- 护眼提醒 ---------------- */
  var EYE_MS = 15 * 60 * 1000;
  function injectEyecare() {
    if (document.getElementById("eyecare")) return;
    var d = document.createElement("div");
    d.className = "eyecare"; d.id = "eyecare";
    d.innerHTML = '<div class="card"><div class="e-ic">' + icon("doudou") + '</div><h3>休息一下眼睛吧</h3><p style="color:var(--muted);margin:8px 0 14px">豆豆说：看看窗外远处，让眼睛喝口水～</p><button class="btn blue sm" id="eye-ok">' + icon("check") + "好，我休息 20 秒</button></div>";
    document.body.appendChild(d);
    d.querySelector("#eye-ok").addEventListener("click", function () {
      d.classList.remove("show");
      setTimeout(function () { document.getElementById("eyecare").classList.add("show"); }, EYE_MS + 20000);
    });
  }
  function startEyecareTimer() {
    setTimeout(function () {
      var e = document.getElementById("eyecare");
      if (e) e.classList.add("show");
      sfx("pop");
    }, EYE_MS);
  }

  /* ---------------- 梅花瓣动效 ---------------- */
  function petals(x, y) {
    var wrap = document.createElement("div");
    wrap.className = "petals";
    wrap.style.cssText = "position:fixed;left:" + (x - 10) + "px;top:" + (y - 10) + "px;z-index:300;pointer-events:none;";
    for (var i = 0; i < 5; i++) {
      var s = document.createElement("span");
      s.style.left = (i * 9 - 14) + "px";
      s.style.animationDelay = i * 0.06 + "s";
      s.innerHTML = icon("plum");
      wrap.appendChild(s);
    }
    document.body.appendChild(wrap);
    setTimeout(function () { wrap.remove(); }, 1300);
  }

  /* ---------------- 测验引擎 ----------------
     data: [{ q, opts:[...], a: 正确下标, why: 解析 }]
     完成后按失误次数给 1–3 颗雨花石 */
  function quiz(cfg) {
    var el = document.querySelector(cfg.el || "#quiz");
    if (!el) return;
    var data = cfg.data, idx = 0, miss = 0;
    function render() {
      var d = data[idx];
      var opts = d.opts.map(function (t, i) {
        return '<button class="opt" data-i="' + i + '"><span class="opt-k">' + "ABCDEF"[i] + "</span><span>" + t + "</span></button>";
      }).join("");
      el.innerHTML = '<div class="panel quiz-card">' +
        '<span class="panel-tag">' + icon("quiz") + "挑战测验 " + (idx + 1) + " / " + data.length + "</span>" +
        '<div class="quiz-q">' + d.q + "</div>" + opts +
        '<div class="quiz-why" id="quiz-why"></div></div>';
      el.querySelectorAll(".opt").forEach(function (btn) {
        btn.addEventListener("click", function (ev) {
          var i = +btn.dataset.i;
          if (i === d.a) {
            btn.classList.add("right", "pop-ok"); sfx("right");
            petals(ev.clientX || window.innerWidth / 2, ev.clientY || 200);
            el.querySelectorAll(".opt").forEach(function (b) { b.disabled = true; });
            var why = document.getElementById("quiz-why");
            why.innerHTML = "<b>豆豆说：</b>" + (d.why || "") + ' <div style="margin-top:10px"><button class="btn sm" id="quiz-next">' + icon("arrowRight") + (idx === data.length - 1 ? "领取雨花石" : "下一题") + "</button></div>";
            why.classList.add("show");
            document.getElementById("quiz-next").addEventListener("click", next);
          } else {
            miss++; btn.classList.add("retry", "shake"); sfx("retry");
            btn.disabled = true;
            var why2 = document.getElementById("quiz-why");
            why2.textContent = "再想想看，豆豆相信你！提示：" + (d.hint || "回顾刚才学的内容");
            why2.classList.add("show");
          }
        });
      });
    }
    function next() {
      idx++;
      if (idx < data.length) { render(); return; }
      var stones = miss === 0 ? 3 : miss <= 2 ? 2 : 1;
      store.completeQuiz(cfg.module, stones);
      var row = "";
      for (var i = 0; i < 3; i++) row += icon("stone");
      el.innerHTML = '<div class="panel quiz-done">' +
        '<div class="e-ic" style="width:80px;margin:0 auto 8px;color:var(--accent)">' + icon("doudou") + "</div>" +
        '<div class="big">挑战完成！</div><p style="color:var(--muted)">你答对了所有题目，这是你的雨花石奖励</p>' +
        '<div class="stone-row">' + row + "</div>" +
        '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">' +
        '<a class="btn sm" href="../index.html">' + icon("arrowLeft") + "回到首页</a>" +
        '<a class="btn blue sm" href="' + (cfg.nextHref || "../achievements/index.html") + '">' + icon("trophy") + "看看成就墙</a></div></div>";
      sfx("wow");
    }
    render();
  }

  /* ---------------- 导出 ---------------- */
  window.DM = {
    icon: icon, sfx: sfx, speak: speak, speakPage: speakPage, petals: petals,
    pinyin: { toggle: pyToggle },
    pyRun: pyRun, pyHighlight: pyHighlight, taskRunner: taskRunner, practiceRunner: practiceRunner,
    rvAll: rvAll, count: count, ring: ring,
    store: store, quiz: quiz, boot: boot, storage: window.DMStorage, entryCleared: entryCleared,
    MODULES: MODULES, LESSON_COUNT: LESSON_COUNT, LEVELS: LEVELS, MODULE_META: MODULE_META
  };
})();
