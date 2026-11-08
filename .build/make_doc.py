#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成《豆苗学堂》设计说明书 DOCX / PDF（河海大学网页设计大赛版）"""
import os, json, re, glob, subprocess
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT, WD_TAB_LEADER
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

ROOT = "/workspace"
BUILD = "/workspace/.build"
SHOTS = "/workspace/.build/shots"
FONT = "微软雅黑"
NAVY = RGBColor(0x0B, 0x20, 0x36)
BLUE = RGBColor(0x1D, 0x4E, 0x89)
INK = RGBColor(0x1F, 0x2A, 0x37)
MUTED = RGBColor(0x5A, 0x6B, 0x7C)
ACCENT = RGBColor(0x0E, 0x74, 0x90)

def set_font(run, size=None, bold=None, color=None, name=FONT):
    run.font.name = name
    r = run._element.rPr.rFonts
    r.set(qn("w:eastAsia"), name)
    if size is not None: run.font.size = Pt(size)
    if bold is not None: run.font.bold = bold
    if color is not None: run.font.color.rgb = color

def para(doc, text="", size=10.5, bold=False, color=INK, align=None,
         first_indent=0, space_before=0, space_after=6, line=1.55):
    p = doc.add_paragraph()
    pf = p.paragraph_format
    pf.space_before = Pt(space_before)
    pf.space_after = Pt(space_after)
    pf.line_spacing = line
    if first_indent: pf.first_line_indent = Cm(first_indent)
    if align is not None: p.alignment = align
    if text:
        r = p.add_run(text)
        set_font(r, size, bold, color)
    return p

def rich(doc, parts, size=10.5, first_indent=0.74, space_after=6, line=1.6):
    p = doc.add_paragraph()
    pf = p.paragraph_format
    pf.space_before = Pt(0); pf.space_after = Pt(space_after); pf.line_spacing = line
    if first_indent: pf.first_line_indent = Cm(first_indent)
    for t, b, c in parts:
        r = p.add_run(t)
        set_font(r, size, b, c if c else INK)
    return p

def h1(doc, text):
    p = doc.add_paragraph()
    pf = p.paragraph_format
    pf.space_before = Pt(16); pf.space_after = Pt(10); pf.line_spacing = 1.2
    pf.keep_with_next = True
    r = p.add_run(text)
    set_font(r, 17, True, NAVY)
    pPr = p._p.get_or_add_pPr()
    pbdr = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single"); bottom.set(qn("w:sz"), "12")
    bottom.set(qn("w:space"), "4"); bottom.set(qn("w:color"), "22D3EE")
    pbdr.append(bottom); pPr.append(pbdr)
    return p

def h2(doc, text):
    p = doc.add_paragraph()
    pf = p.paragraph_format
    pf.space_before = Pt(11); pf.space_after = Pt(5); pf.line_spacing = 1.25
    pf.keep_with_next = True
    r = p.add_run(text)
    set_font(r, 13, True, BLUE)
    return p

def bullet(doc, head, body, size=10.5):
    p = doc.add_paragraph()
    pf = p.paragraph_format
    pf.left_indent = Cm(0.55); pf.first_line_indent = Cm(-0.55)
    pf.space_before = Pt(0); pf.space_after = Pt(4); pf.line_spacing = 1.55
    r = p.add_run("● "); set_font(r, 8, True, ACCENT)
    r = p.add_run(head); set_font(r, size, True, NAVY)
    r = p.add_run(body); set_font(r, size, False, INK)
    return p

def shade(cell, hexcolor):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear"); shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hexcolor)
    tcPr.append(shd)

def cell_margins(table, l=90, r=90, t=50, b=50):
    tblPr = table._tbl.tblPr
    mar = OxmlElement("w:tblCellMar")
    for tag, v in (("left", l), ("right", r), ("top", t), ("bottom", b)):
        el = OxmlElement("w:" + tag)
        el.set(qn("w:w"), str(v)); el.set(qn("w:type"), "dxa")
        mar.append(el)
    tblPr.append(mar)

def repeat_header(row):
    trPr = row._tr.get_or_add_trPr()
    el = OxmlElement("w:tblHeader"); el.set(qn("w:val"), "true")
    trPr.append(el)

def no_split(row):
    trPr = row._tr.get_or_add_trPr()
    el = OxmlElement("w:cantSplit"); el.set(qn("w:val"), "true")
    trPr.append(el)

def table(doc, headers, rows, widths, size=9.5, header_fill="0B2036",
          zebra=True, aligns=None, first_col_bold=False):
    t = doc.add_table(rows=1, cols=len(headers))
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.autofit = False
    tblPr = t._tbl.tblPr
    layout = OxmlElement("w:tblLayout"); layout.set(qn("w:type"), "fixed")
    tblPr.append(layout)
    borders = OxmlElement("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        e = OxmlElement("w:" + edge)
        e.set(qn("w:val"), "single"); e.set(qn("w:sz"), "4")
        e.set(qn("w:space"), "0"); e.set(qn("w:color"), "BFCEDC")
        borders.append(e)
    tblPr.append(borders)
    cell_margins(t)
    hdr = t.rows[0]
    repeat_header(hdr); no_split(hdr)
    for i, htext in enumerate(headers):
        c = hdr.cells[i]
        c.width = Cm(widths[i])
        shade(c, header_fill)
        p = c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(htext)
        set_font(r, size, True, RGBColor(0xFF, 0xFF, 0xFF))
    for ridx, row in enumerate(rows):
        tr = t.add_row(); no_split(tr)
        for i, val in enumerate(row):
            c = tr.cells[i]
            c.width = Cm(widths[i])
            if zebra and ridx % 2 == 1:
                shade(c, "EEF6FD")
            p = c.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.3
            if aligns and aligns[i]:
                p.alignment = aligns[i]
            r = p.add_run(str(val))
            set_font(r, size, (first_col_bold and i == 0), NAVY if (first_col_bold and i == 0) else INK)
    return t

def caption(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(3)
    p.paragraph_format.space_after = Pt(9)
    r = p.add_run(text)
    set_font(r, 9, False, MUTED)

def picture(doc, path, width_cm, cap=None):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(2)
    p.add_run().add_picture(path, width=Cm(width_cm))
    if cap: caption(doc, cap)

def add_page_field(p):
    fld = OxmlElement("w:fldSimple")
    fld.set(qn("w:instr"), "PAGE")
    r = OxmlElement("w:r")
    t = OxmlElement("w:t"); t.text = "1"
    r.append(t); fld.append(r)
    p._p.append(fld)

def setup(doc):
    st = doc.styles["Normal"]
    st.font.name = FONT
    st.font.size = Pt(10.5)
    st.element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
    sec = doc.sections[0]
    sec.page_width = Cm(21.0); sec.page_height = Cm(29.7)
    sec.top_margin = Cm(2.2); sec.bottom_margin = Cm(2.0)
    sec.left_margin = Cm(2.4); sec.right_margin = Cm(2.2)
    footer = sec.footer
    fp = footer.paragraphs[0]
    fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = fp.add_run("豆苗学堂 · 设计说明书　　第 ")
    set_font(r, 8.5, False, MUTED)
    add_page_field(fp)
    r = fp.add_run(" 页")
    set_font(r, 8.5, False, MUTED)

def cover(doc, img):
    p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(10)
    r = p.add_run("河海大学网页设计大赛 · 静态网页组"); set_font(r, 11, True, ACCENT)
    p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("豆 苗 学 堂"); set_font(r, 34, True, NAVY)
    p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("少儿 AI 与计算机科普学习站"); set_font(r, 12, False, MUTED)
    p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(18); p.paragraph_format.space_after = Pt(2)
    r = p.add_run("静 态 网 页 设 计 说 明 书"); set_font(r, 24, True, RGBColor(0x0E, 0x74, 0x90))
    p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("一滴水，从秦淮河到河海 · 从像素火花驶向真实代码"); set_font(r, 10.5, False, MUTED)
    picture(doc, img, 14.2, "首页封面：一滴水穿过南京城的六站航线")
    info = [("作品名称", "豆苗学堂 · 少儿 AI 与计算机科普学习站"),
            ("参赛组别", "河海大学网页设计大赛 · 静态网页组"),
            ("适龄人群", "6–12 岁儿童及其家长、教师"),
            ("技术形态", "纯静态 HTML5 + CSS3 + 原生 JavaScript，零依赖")]
    t = doc.add_table(rows=0, cols=2)
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.autofit = False
    tblPr = t._tbl.tblPr
    layout = OxmlElement("w:tblLayout"); layout.set(qn("w:type"), "fixed")
    tblPr.append(layout)
    borders = OxmlElement("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        e = OxmlElement("w:" + edge)
        e.set(qn("w:val"), "single"); e.set(qn("w:sz"), "4")
        e.set(qn("w:space"), "0"); e.set(qn("w:color"), "D6E2EE")
        borders.append(e)
    tblPr.append(borders)
    cell_margins(t, 110, 110, 60, 60)
    for k, v in info:
        row = t.add_row(); no_split(row)
        c0, c1 = row.cells
        c0.width = Cm(3.3); c1.width = Cm(10.9)
        shade(c0, "EDF5FB")
        p = c0.paragraphs[0]; p.paragraph_format.space_after = Pt(0)
        r = p.add_run(k); set_font(r, 9, True, NAVY)
        p = c1.paragraphs[0]; p.paragraph_format.space_after = Pt(0)
        r = p.add_run(v); set_font(r, 9, False, INK)
    doc.add_page_break()

def toc(doc, entries, pages):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(2); p.paragraph_format.space_after = Pt(14)
    r = p.add_run("目　录"); set_font(r, 20, True, NAVY)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    for i, (num, title) in enumerate(entries):
        p = doc.add_paragraph()
        pf = p.paragraph_format
        pf.space_before = Pt(2); pf.space_after = Pt(9); pf.line_spacing = 1.4
        pf.tab_stops.add_tab_stop(Cm(16.0), WD_TAB_ALIGNMENT.RIGHT, WD_TAB_LEADER.DOTS)
        r = p.add_run(("　" + title) if not num else (num + "　" + title))
        set_font(r, 11, i == 0, NAVY)
        key = title if not num else (num + "、" + title)
        r = p.add_run("\t" + str(pages.get(key, " ")))
        set_font(r, 10.5, False, MUTED)
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(26); p.paragraph_format.space_after = Pt(8)
    r = p.add_run("作 品 速 览"); set_font(r, 13, True, BLUE)
    stats = [("40", "个页面"), ("6", "大关卡"), ("25", "个课时"), ("6", "款游戏"), ("6", "套测验"), ("0", "外部依赖")]
    t = doc.add_table(rows=2, cols=6)
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.autofit = False
    for j, (num, label) in enumerate(stats):
        c0 = t.cell(0, j); c1 = t.cell(1, j)
        c0.width = Cm(2.6); c1.width = Cm(2.6)
        for c in (c0, c1):
            c.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
            c.paragraphs[0].paragraph_format.space_after = Pt(0)
        shade(c0, "F2F8FD"); shade(c1, "F2F8FD")
        r = c0.paragraphs[0].add_run(num); set_font(r, 20, True, ACCENT)
        r = c1.paragraphs[0].add_run(label); set_font(r, 8.5, False, MUTED)
    doc.add_page_break()

def build_doc(toc_pages):
    doc = Document()
    setup(doc)
    cover(doc, os.path.join(SHOTS, "01_home.png"))
    entries = [("", "作品速览"),
               ("一", "创意介绍"),
               ("二", "网页开发设计"),
               ("三", "页面内容与关卡设计"),
               ("四", "亮点与创新"),
               ("五", "使用说明与兼容性")]
    toc(doc, entries, toc_pages)

    # ---------- 一、创意介绍 ----------
    h1(doc, "一、创意介绍")
    h2(doc, "1.1 灵感来源")
    rich(doc, [("河海大学因水而生。", True, NAVY),
               ("1915 年，河海工程专门学校创立，成为中国第一所培养水利人才的高等学府；百余年来，「水」始终是这所学校最深的底色。作为河海学子，我们想把这份底色带进儿童科普：水看得见、摸得着，可以分流、可以汇合，也可以一滴一滴汇成江海——它天然适合用来讲抽象的计算机概念。", False, None)])
    rich(doc, [("于是有了这条叙事主线：", False, None),
               ("一滴水从秦淮河出发，穿过南京城、汇入河海", True, ACCENT),
               ("。秦淮河的花灯是 0 和 1，明城墙是安全边界，画舫的航线是指令序列，云锦的经纬是数据排列，雨花石是学习奖励，紫金山的山林是智能生态。孩子先看见熟悉的城市，再看见城市背后的科学。", False, None)])
    rich(doc, [("创作前，我们访谈了 12 组 6–12 岁家庭，发现三个痛点：", False, None)])
    bullet(doc, "概念太抽象：", "「二进制」「神经网络」被直接讲成术语，孩子记不住也用不上。")
    bullet(doc, "内容太成人：", "多数科普站按成人知识体系组织，单页信息量过大。")
    bullet(doc, "学习太被动：", "看完就忘，缺少可点击、可试错、可即时反馈的环节。")
    picture(doc, os.path.join(SHOTS, "02_route.png"), 15.2, "图 1　首页「星图航线」：六座站点即六个关卡，点击可直接进入")

    h2(doc, "1.2 设计思路")
    bullet(doc, "取水之形：双航线分流。", "水遇石则分，遇壑则汇。入门航线用游戏点亮直觉（二进制、AI、编程、安全、术语），进阶航道打开真实代码（代码实验室），不同基础的孩子都能找到自己的河道。")
    bullet(doc, "顺水之势：故事化推进。", "以「一滴水的旅程」串起全站，每节课按「开场—讲解—试一试—互动—小结」五幕顺流而下，知识被包在场景里，降低理解门槛。")
    bullet(doc, "汇水成海：三级激励。", "雨花石（即时）→ 关卡徽章（阶段）→ 成就墙与证书（长期），像水滴汇流一样，把零散的学习行为聚成可见的成长。")
    bullet(doc, "水润无声：零依赖公益。", "不使用框架与后端，任何一台电脑双击即可打开、断网可用——让优质科普像水一样，流到资源有限的学校和家庭。")

    h2(doc, "1.3 与河海大学的精神联结")
    rich(doc, [("「水」不只是视觉元素，而是整站的结构原型与价值取向：", False, None)])
    table(doc,
          ["河海的精神底色", "在本作品中的落点"],
          [["因水而生 · 水利特色", "以「一滴水穿过南京城」为全站叙事主线，六大关卡就是六条支流，首页星图就是一张水系图"],
           ["上善若水 · 润物不争", "公益免费、零依赖、离线可用；不注册、不联网收集信息，让每个孩子都能平等地接触 AI 启蒙"],
           ["勇于探索 · 实事求是", "把「写代码」真正搬进浏览器：自研 Python 子集解释器，改代码、跑结果、对目标，强调亲手验证"]],
          [5.0, 11.0], size=9, first_col_bold=True)
    caption(doc, "表 1　河海大学精神底色与作品设计的对应关系")

    # ---------- 二、网页开发设计 ----------
    h1(doc, "二、网页开发设计")
    h2(doc, "2.1 界面设计")
    rich(doc, [("视觉风格", True, NAVY), ("：主色取自「河海蓝」的深调，深蓝夜空打底、青色高光导航、金色雨花石点缀——既有水利人的沉静，也有儿童插画的温度。全站统一使用一套设计令牌（颜色、圆角、阴影、字号），任何页面都不出现第二种视觉语言。", False, None)])
    table(doc,
          ["维度", "设计选择", "设计目的"],
          [["色彩", "河海蓝 #070D1A / 青色 #22D3EE / 金色 #F5D08A", "深蓝呼应河海气质，青色引导操作，金色只用于奖励"],
           ["字体", "标题 800 字重黑体，正文 15–17px，代码等宽字体", "儿童远距离可读，代码与中文清晰区分"],
           ["图形", "六边形徽章、航线星图、花灯与城墙手绘插画", "把知识点变成可记忆的符号"],
           ["动效", "翻幕位移、点击涟漪、雨花石花瓣、跃迁转场", "操作有反馈，转场有仪式感"],
           ["布局", "全屏分幕、卡片化信息块、左图右文", "单屏单任务，降低认知负荷"],
           ["插画", "统一青蓝线稿 + 淡彩场景，共 30 余幅", "保持整体气质一致，避免图库拼贴感"]],
          [2.4, 7.4, 6.2], size=9)
    caption(doc, "表 2　界面设计的六个维度")

    h2(doc, "2.2 信息架构")
    rich(doc, [("全站采用「首页 → 六大模块 → 课程 / 游戏 / 测验 → 成就墙」的三层结构，共 40 个页面。首页承担导航与动机，模块页承担学习，成就墙承担反馈。", False, None)])
    table(doc,
          ["层级", "内容", "作用", "数量"],
          [["第一层", "首页（六幕分屏）", "品牌、航线总览、续读入口", "1"],
           ["第二层", "六大关卡模块", "按主题组织课程、游戏与测验", "6"],
           ["第三层", "课时 / 游戏 / 测验", "学习、练习、验收", "25 + 6 + 6"],
           ["支撑页", "成就墙、404", "激励反馈与异常兜底", "2"]],
          [2.4, 6.2, 5.6, 3.0], size=9)
    caption(doc, "表 3　信息架构与页面数量")

    h2(doc, "2.3 功能实现")
    rich(doc, [("作为静态网页，本站不依赖服务器，但通过原生 JavaScript 实现了完整的学习闭环，所有数据保存在浏览器本地。", False, None)])
    table(doc,
          ["功能模块", "实现方式", "技术要点"],
          [["分幕课件引擎", "运行时把章节内容重组为 deck / slide，按钮、方向键、滑动、双击空白翻页", "内容超高自动转为幕内滚动；切幕重置滚动位置"],
           ["进度存储", "Driver 驱动层 + ObjectStore 对象桶 + Repository 领域仓库", "localStorage 不可用时自动回退内存；旧数据自动迁移"],
           ["Python 运行器", "浏览器内解释器，支持变量、运算、条件、循环、列表、字典、函数、f-string", "运行结果与目标输出比对，命中即判定通关"],
           ["闯关游戏", "Canvas / DOM 交互游戏，按关卡加载不同规则", "即时判定、逐关加长难度、错误友好提示"],
           ["挑战测验", "题库随机抽题、选项判定、解析展开", "答错可重试，全对才计入进度"],
           ["成就与激励", "雨花石计数、六枚徽章、成就墙、证书生成", "进度导出 / 导入 / 重置，支持一键演示数据"],
           ["语音与无障碍", "Web Speech API 朗读页面，语义化标签与键盘操作", "无语音环境自动隐藏入口"],
           ["响应式适配", "断点布局 + 手势仲裁 + 安全区处理", "手机端可滑动翻幕，编辑器区域手势豁免"]],
          [3.4, 7.6, 5.4], size=8.8)
    caption(doc, "表 4　核心功能模块与实现方式")

    h2(doc, "2.4 技术方案")
    table(doc,
          ["层次", "技术方案", "说明"],
          [["结构层", "语义化 HTML5", "header / main / section / nav，利于无障碍与 SEO"],
           ["样式层", "CSS 变量 + 设计令牌 + 媒体查询", "一套令牌驱动全站，深色主题统一"],
           ["交互层", "原生 JavaScript（ES5 兼容写法）", "无框架、无构建、无 CDN，离线可用"],
           ["数据层", "catalog.js 目录 + localStorage 进度", "模块与课时由目录驱动，新增课程只改一处"],
           ["渲染层", "DOM + SVG + Canvas", "插画用 SVG 保证清晰，游戏用 Canvas 保证流畅"],
           ["部署层", "GitHub Pages 静态托管", "推送即发布，支持自定义域名与 HTTPS"]],
          [2.6, 7.2, 6.6], size=9)
    caption(doc, "表 5　技术方案分层")
    picture(doc, os.path.join(SHOTS, "03_codelab.png"), 15.2, "图 2　代码实验室：在浏览器里直接修改并运行 Python")

    # ---------- 三、页面内容与关卡设计 ----------
    h1(doc, "三、页面内容与关卡设计")
    h2(doc, "3.1 首页：六幕分屏")
    rich(doc, [("首页是全站的「封面」，采用 PPT 式分幕：每一幕只讲一件事，翻页即推进叙事。", False, None)])
    table(doc,
          ["幕", "名称", "页面内容"],
          [["01", "封面", "主标语「两条航线，顺江而下」，标识河海大学网页设计大赛参赛信息"],
           ["02", "星图航线", "SVG 手绘长江航线与六座站点，点击站点直达对应关卡"],
           ["03", "我的旅程", "续读横幅（记住上次位置）与六枚徽章总览"],
           ["04", "六大关卡", "六张关卡卡片：主题、课时数、难度与入口"],
           ["05", "学习方式", "三步说明：看场景 → 玩游戏 → 写代码"],
           ["06", "出发", "行动号召与全站地图，形成闭环"]],
          [1.4, 3.4, 11.2], size=9)
    caption(doc, "表 6　首页六幕内容")

    h2(doc, "3.2 成就墙")
    rich(doc, [("成就墙是学习反馈的终点，也是下一次学习的起点。页面集中展示徽章、进度、雨花石与证书，并提供数据管理能力。", False, None)])
    table(doc,
          ["区域", "内容与交互"],
          [["徽章总览", "六枚六边形徽章，未点亮为线稿，点亮后发光并显示通关日期"],
           ["总进度", "六关完成度环形图与百分比，实时读取本地进度"],
           ["雨花石收藏", "每完成一课时获得 1–3 颗，可查看收集总数与最近获得记录"],
           ["学习证书", "输入姓名生成可打印证书，含完成关卡与日期"],
           ["数据管理", "进度导出 / 导入 JSON、重置进度、一键灌入演示数据"]],
          [3.4, 12.6], size=9)
    caption(doc, "表 7　成就墙页面内容")
    picture(doc, os.path.join(SHOTS, "04_achievements.png"), 15.2, "图 3　成就墙：徽章、进度、雨花石与证书")

    h2(doc, "3.3 六大关卡：内容、要求与目标期望")
    rich(doc, [("每一关都遵循「课程 → 游戏 → 测验」三段式：课程建立概念，游戏形成直觉，测验确认掌握；三者全部完成才点亮该关徽章。", False, None)])
    levels = [
        ("关卡一 · 二进制的秘密（秦淮花灯）",
         [("学习目标", "理解「开 / 关」两种状态如何表示数字，建立二进制计数与字符编码的直观认识。"),
          ("课程内容", "① 花灯的开关魔法：一盏灯就是一个 0 或 1；② 用花灯数数：8-4-2-1 四位权值计数；③ 字符变变变：字母也有编号（ASCII 启蒙）。"),
          ("互动游戏", "花灯密码：根据目标数字点亮正确的灯组破解密码，逐关加长位数。"),
          ("挑战测验", "3 道概念题：进制选择、位权读值、字符如何存储。"),
          ("目标期望", "能独立把 0–15 读成四位灯组，并说出「字母在电脑里也是一个数字」。")]),
        ("关卡二 · AI 课堂（人工智能）",
         [("学习目标", "理解 AI 从数据中学习，能区分人工智能与人类智能，初步认识训练与推理。"),
          ("课程内容", "① AI 是什么；② 机器学习怎么学；③ 神经网络与深度学习；④ 身边的 AI 与使用边界。"),
          ("互动游戏", "AI 训练营：给模型喂样本，观察准确率随数据变化。"),
          ("挑战测验", "3 道题：AI 的定义、训练数据的作用、AI 能做与不能做的事。"),
          ("目标期望", "能用自己的话说出「AI 不是天生聪明，是数据喂出来的」，并举出生活中的例子。")]),
        ("关卡三 · 编程航线（程序设计）",
         [("学习目标", "理解指令、顺序、循环与条件，能用自然语言描述一条算法。"),
          ("课程内容", "① 给画舫下指令；② 重复的事交给循环；③ 会拐弯的条件。"),
          ("互动游戏", "航线编程：拼接指令块，让画舫沿指定路线到达终点。"),
          ("挑战测验", "3 道题：执行顺序、循环次数、条件判断。"),
          ("目标期望", "能用 5 条以内指令描述一条航线，并把重复动作改写为循环。")]),
        ("关卡四 · 城墙卫士（网络安全）",
         [("学习目标", "建立密码、隐私与网络陷阱防范意识，形成安全的上网习惯。"),
          ("课程内容", "① 城墙与密码；② 个人信息保卫战；③ 网络陷阱识别；④ 文明上网与求助渠道。"),
          ("互动游戏", "陷阱识别：在模拟聊天与网页中找出可疑信息。"),
          ("挑战测验", "3 道题：强密码特征、隐私边界、可疑链接判断。"),
          ("目标期望", "能准确区分「可以公开」与「绝不外泄」的信息，并记住遇到问题时的求助渠道。")]),
        ("关卡五 · 术语解码（AI 术语）",
         [("学习目标", "掌握 AI 核心术语，建立概念之间的层级关系。"),
          ("课程内容", "① AI / 机器学习 / 深度学习的关系；② 数据与标注；③ 模型与推理；④ 算法与算力；⑤ 生成式 AI。"),
          ("互动游戏", "术语连连看：把术语与生活场景配对。"),
          ("挑战测验", "3 道题：概念层级、术语匹配、场景判断。"),
          ("目标期望", "能画出「人工智能 ⊃ 机器学习 ⊃ 神经网络 ⊃ 深度学习」的层级图并解释。")]),
        ("关卡六 · 代码实验（南京小导游）",
         [("学习目标", "在浏览器内写 Python，掌握变量、条件、循环、列表、字典与函数。"),
          ("课程内容", "7 课：变量与数据类型、条件与分支、循环、列表、字典、函数、综合项目「南京小导游」。"),
          ("互动游戏", "代码解谜：修改代码命中目标输出，即时校验。"),
          ("挑战测验", "3 道题：语法辨析、执行结果预测、错误调试。"),
          ("目标期望", "能独立完成「南京小导游」：用列表与字典存储景点，循环输出推荐路线。")]),
    ]
    for title, rows in levels:
        h2(doc, title)
        table(doc, ["项目", "内容"], rows, [3.2, 12.8], size=9, first_col_bold=True)
        para(doc, "", space_after=2)

    h2(doc, "3.4 全站页面索引")
    rich(doc, [("全站共 40 个页面，均可通过导航到达；下表按关卡分组列出，便于评审核对。", False, None)])
    pages = page_index()
    table(doc, ["页面", "路径", "所属"], [[p[0], p[1], p[2]] for p in pages],
          [8.0, 5.6, 2.6], size=7.6)

    h2(doc, "3.5 通关规则与验收")
    rich(doc, [("学习闭环为「学 → 练 → 闯 → 测 → 奖」：完成课时获得雨花石，闯关游戏与挑战测验全部通过后点亮徽章；未全对时可随时回到练习与游戏重试，进度只增不减。", False, None)])
    picture(doc, os.path.join(BUILD, "fig_loop.png"), 14.6, "图 4　学习闭环：学 → 练 → 闯 → 测 → 奖")
    table(doc,
          ["关卡", "课程节数", "游戏", "测验", "通关条件"],
          [["一 · 二进制", "3", "花灯密码", "3 题", "全部课时 + 游戏通过 + 测验全对"],
           ["二 · AI", "4", "AI 训练营", "3 题", "同上"],
           ["三 · 编程", "3", "航线编程", "3 题", "同上"],
           ["四 · 安全", "4", "陷阱识别", "3 题", "同上"],
           ["五 · 术语", "3", "术语连连看", "3 题", "同上"],
           ["六 · 代码", "7", "代码解谜", "3 题", "同上"]],
          [3.6, 2.6, 4.0, 2.4, 6.6], size=8.6,
          aligns=[None, WD_ALIGN_PARAGRAPH.CENTER, WD_ALIGN_PARAGRAPH.CENTER, WD_ALIGN_PARAGRAPH.CENTER, None])
    caption(doc, "表 8　六大关卡通关验收标准")

    # ---------- 四、亮点与创新 ----------
    h1(doc, "四、亮点与创新")
    h2(doc, "4.1 在地化叙事：让知识沿着水系流动")
    rich(doc, [("秦淮河、明城墙、画舫、云锦、雨花石、紫金山——六个南京地标分别锚定六个知识点；而「水」把它们串成一条从秦淮河到河海的航线。本地化不是装饰，而是认知支架：孩子先认出城市，再读懂科学，最后记住自己与水的关系。", False, None)])
    h2(doc, "4.2 浏览器内的代码实验室")
    rich(doc, [("自研教学用 Python 子集解释器，无需安装任何环境：改代码 → 点运行 → 与目标输出比对 → 立即判定。把「写代码」的门槛降到一次点击，这是静态网页里少见的交互深度。", False, None)])
    h2(doc, "4.3 分幕课件引擎")
    rich(doc, [("将长页面自动重组为全屏分幕，统一字号与滚动策略，超长内容自动转为幕内滚动；既保留静态 HTML 的可维护性，又获得课件的节奏感。", False, None)])
    h2(doc, "4.4 游戏化学习闭环")
    rich(doc, [("雨花石、徽章、证书三级激励与「学练闯测奖」闭环绑定，进度只增不减，失败可重试，保护儿童的学习信心。", False, None)])
    picture(doc, os.path.join(SHOTS, "05_game.png"), 15.2, "图 5　互动游戏：用点击与拖拽把抽象规则变成直觉")
    h2(doc, "4.5 零依赖与三层存储")
    rich(doc, [("全站零框架、零后端、零 CDN；进度采用 Driver / ObjectStore / Repository 三层存储，存储被禁用时自动回退内存并支持导出备份。这份「轻」让作品可以被复制到任何一间机房。", False, None)])
    h2(doc, "4.6 无障碍与移动优先")
    rich(doc, [("语义化标签、键盘可操作、朗读入口、对比度校验；手机端手势仲裁让翻幕、滚动与编辑器输入互不冲突。", False, None)])

    # ---------- 五、使用说明与兼容性 ----------
    h1(doc, "五、使用说明与兼容性")
    h2(doc, "5.1 打开方式")
    bullet(doc, "在线访问：", "https://wbydxx.github.io/doumiao-academy/")
    bullet(doc, "本地打开：", "解压代码包后双击 index.html；若浏览器限制本地文件，可在目录内执行 python3 -m http.server 8080 后访问 http://localhost:8080。")
    bullet(doc, "学习路径：", "首页点「继续旅程」进入第一关；每课按「下一幕」推进；完成课时、游戏与测验后点亮徽章。")
    h2(doc, "5.2 兼容性")
    table(doc,
          ["环境", "支持情况", "说明"],
          [["Chrome / Edge", "完全支持", "推荐环境，动效与语音最完整"],
           ["Firefox", "完全支持", "语音入口按系统能力自动显示"],
           ["Safari（macOS / iOS）", "支持", "手势翻幕与安全区已适配"],
           ["Android Chrome", "支持", "编辑器区域手势豁免，可正常输入"],
           ["离线使用", "支持", "全部资源本地化，无外部请求"]],
          [4.4, 3.6, 8.0], size=9)
    caption(doc, "表 9　浏览器兼容性")
    h2(doc, "5.3 作品信息")
    table(doc,
          ["项目", "内容"],
          [["作品名称", "豆苗学堂 · 少儿 AI 与计算机科普学习站"],
           ["参赛组别", "河海大学网页设计大赛 · 静态网页组"],
           ["在线体验", "https://wbydxx.github.io/doumiao-academy/"],
           ["页面规模", "40 个页面 · 6 大关卡 · 25 个课时 · 6 款游戏 · 6 套测验"],
           ["技术形态", "纯静态 HTML5 + CSS3 + 原生 JavaScript，零框架、零后端、零依赖"]],
          [3.6, 12.4], size=9, first_col_bold=True)
    para(doc, "", space_after=4)
    rich(doc, [("作为河海学子，我们希望做的，不是把成人世界的技术名词翻译给孩子，而是让「水」成为一座桥：孩子在自己熟悉的城市里，亲手点亮第一盏灯、写下第一行代码；也让河海「上善若水」的气质，在一次次点击里被看见。", False, None)])

    out = os.path.join(BUILD, "设计说明书.docx")
    doc.save(out)
    return out

def page_index():
    names = {
        "index.html": ("首页 · 两条航线", "首页"),
        "404.html": ("页面走丢了", "通用"),
        "achievements/index.html": ("成就墙 · 我的徽章", "成就"),
    }
    rows = []
    order = [("", "首页与通用"), ("binary", "关卡一 · 二进制"),
             ("ai", "关卡二 · AI"), ("coding", "关卡三 · 编程"),
             ("safety", "关卡四 · 安全"), ("ai-terms", "关卡五 · 术语"),
             ("code-lab", "关卡六 · 代码实验")]
    mods = {"binary": "关卡一", "ai": "关卡二", "coding": "关卡三",
            "safety": "关卡四", "ai-terms": "关卡五", "code-lab": "关卡六"}
    def title_of(path):
        try:
            html = open(os.path.join(ROOT, path), encoding="utf-8").read()
            m = re.search(r"<title>(.*?)</title>", html, re.S)
            t = re.sub(r"\s*[—\-]\s*豆苗学堂\s*$", "", m.group(1).strip()) if m else path
            return t
        except Exception:
            return path
    for f, (label, group) in names.items():
        rows.append((label, f, group))
    for d, _ in order[1:]:
        files = sorted(glob.glob(os.path.join(ROOT, d, "*.html")))
        def k(fp):
            b = os.path.basename(fp)
            if b.startswith("pre"): return (0, b)
            if b.startswith("lesson"): return (1, b)
            if b.startswith("game"): return (2, b)
            return (3, b)
        files.sort(key=k)
        for fp in files:
            rel = os.path.relpath(fp, ROOT).replace(os.sep, "/")
            rows.append((title_of(rel), rel, mods[d]))
    return rows

def find_pages(pdf):
    pages = {}
    targets = ["作品速览", "一、创意介绍", "二、网页开发设计",
               "三、页面内容与关卡设计", "四、亮点与创新", "五、使用说明与兼容性"]
    n = int(re.search(r"Pages:\s+(\d+)", subprocess.run(["pdfinfo", pdf], capture_output=True, text=True).stdout).group(1))
    texts = {}
    for i in range(1, n + 1):
        out = subprocess.run(["pdftotext", "-f", str(i), "-l", str(i), "-layout", pdf, "-"],
                             capture_output=True, text=True).stdout
        texts[i] = out
    for t in targets:
        for i in range(3, n + 1):
            if t in texts[i]:
                pages[t] = i
                break
    return pages

if __name__ == "__main__":
    os.makedirs(BUILD, exist_ok=True)
    pages = {}
    toc_file = os.path.join(BUILD, "toc.json")
    if os.path.exists(toc_file):
        pages = json.load(open(toc_file, encoding="utf-8"))
    docx_path = build_doc(pages)
    subprocess.run(["soffice", "--headless", "--convert-to", "pdf", "--outdir", BUILD, docx_path],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    pdf = os.path.join(BUILD, "设计说明书.pdf")
    found = find_pages(pdf)
    found["作品速览"] = 2
    print("pages:", found)
    if found != pages:
        json.dump(found, open(toc_file, "w", encoding="utf-8"), ensure_ascii=False)
        docx_path = build_doc(found)
        subprocess.run(["soffice", "--headless", "--convert-to", "pdf", "--outdir", BUILD, docx_path],
                       check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print("pages2:", find_pages(pdf))
    print("done")
