#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成《豆苗学堂》演示 PPT（河海大学网页设计大赛版）"""
import os
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE, MSO_CONNECTOR
from pptx.oxml.ns import qn
from lxml import etree

BUILD = "/workspace/.build"
SHOTS = "/workspace/.build/shots"
FONT = "微软雅黑"

NAVY = RGBColor(0x07, 0x0D, 0x1A)
PANEL = RGBColor(0x0E, 0x1A, 0x2E)
PANEL2 = RGBColor(0x10, 0x24, 0x3C)
CYAN = RGBColor(0x22, 0xD3, 0xEE)
GOLD = RGBColor(0xF5, 0xC5, 0x6B)
WHITE = RGBColor(0xEA, 0xF4, 0xFB)
MUTED = RGBColor(0x9F, 0xB6, 0xCC)
GREEN = RGBColor(0x35, 0xC7, 0x8A)

W, H = 13.333, 7.5

def make_bg():
    w, h = 1920, 1080
    yy = np.linspace(0, 1, h)[:, None]
    top = np.array([5, 11, 20]); mid = np.array([10, 27, 46]); bot = np.array([5, 10, 18])
    grad = np.where(yy < 0.5, top + (mid - top) * (yy / 0.5), mid + (bot - mid) * ((yy - 0.5) / 0.5))
    img = np.repeat(grad[:, None, :], w, axis=1)
    Y, X = np.mgrid[0:h, 0:w]
    d1 = np.sqrt(((X - w * 0.80) / (w * 0.55)) ** 2 + ((Y - h * 0.05) / (h * 0.55)) ** 2)
    g1 = np.clip(1 - d1, 0, 1) ** 2
    d2 = np.sqrt(((X - w * 0.10) / (w * 0.60)) ** 2 + ((Y - h * 1.05) / (h * 0.55)) ** 2)
    g2 = np.clip(1 - d2, 0, 1) ** 2
    img = img + g1[:, :, None] * np.array([10, 58, 76]) + g2[:, :, None] * np.array([38, 30, 10])
    img = np.clip(img, 0, 255).astype(np.uint8)
    im = Image.fromarray(img).convert("RGB")
    d = ImageDraw.Draw(im, "RGBA")
    for x in range(0, w, 80):
        d.line([(x, 0), (x, h)], fill=(34, 211, 238, 10), width=1)
    for y in range(0, h, 80):
        d.line([(0, y), (w, y)], fill=(34, 211, 238, 10), width=1)
    vig = Image.new("L", (w, h), 0)
    dv = ImageDraw.Draw(vig)
    dv.ellipse([-w * 0.25, -h * 0.35, w * 1.25, h * 1.35], fill=255)
    vig = vig.filter(ImageFilter.GaussianBlur(180))
    black = Image.new("RGB", (w, h), (2, 5, 10))
    im = Image.composite(im, black, vig)
    im.save(os.path.join(BUILD, "bg16x9.png"))

def set_run(run, size, bold=False, color=WHITE, font=FONT, spacing=None):
    run.font.name = font
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = color
    rPr = run._r.get_or_add_rPr()
    ea = rPr.find(qn("a:ea"))
    if ea is None:
        ea = etree.SubElement(rPr, qn("a:ea"))
    ea.set("typeface", font)
    if spacing is not None:
        rPr.set("spc", str(int(spacing * 100)))

def tx(slide, x, y, w, h, text, size=12, bold=False, color=WHITE,
       align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP, line=1.15, space_after=0,
       font=FONT, wrap=True, spacing=None):
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = wrap
    tf.margin_left = 0; tf.margin_right = 0; tf.margin_top = 0; tf.margin_bottom = 0
    tf.vertical_anchor = anchor
    for i, ln in enumerate(text.split("\n")):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        p.line_spacing = line
        p.space_after = Pt(space_after)
        r = p.add_run(); r.text = ln
        set_run(r, size, bold, color, font, spacing=spacing)
    return tb

def box(slide, x, y, w, h, fill=PANEL, line=None, radius=0.06, lw=1.0, shape=MSO_SHAPE.ROUNDED_RECTANGLE):
    s = slide.shapes.add_shape(shape, Inches(x), Inches(y), Inches(w), Inches(h))
    s.fill.solid(); s.fill.fore_color.rgb = fill
    if line is None:
        s.line.fill.background()
    else:
        s.line.color.rgb = line; s.line.width = Pt(lw)
    s.shadow.inherit = False
    if shape == MSO_SHAPE.ROUNDED_RECTANGLE:
        try: s.adjustments[0] = radius
        except Exception: pass
    s.text_frame.text = ""
    return s

def pic(slide, path, x, y, w, h, border=True):
    from PIL import Image as I
    iw, ih = I.open(path).size
    r = min(w / iw, h / ih)
    pw, ph = iw * r, ih * r
    px, py = x + (w - pw) / 2, y + (h - ph) / 2
    if border:
        box(slide, px - 0.035, py - 0.035, pw + 0.07, ph + 0.07, fill=RGBColor(0x16, 0x30, 0x4A), line=RGBColor(0x2A, 0x6A, 0x8A), radius=0.012)
    slide.shapes.add_picture(path, Inches(px), Inches(py), Inches(pw), Inches(ph))
    return px, py, pw, ph

def arrow(slide, x1, y1, x2, y2, color=CYAN, width=1.6):
    c = slide.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(x1), Inches(y1), Inches(x2), Inches(y2))
    c.line.color.rgb = color; c.line.width = Pt(width)
    ln = c.line._get_or_add_ln()
    tail = etree.SubElement(ln, qn("a:tailEnd"))
    tail.set("type", "triangle"); tail.set("w", "med"); tail.set("len", "med")
    return c

def head(slide, kicker, title, sub=None):
    tx(slide, 0.78, 0.34, 8.5, 0.3, kicker, 10.5, True, CYAN, spacing=2)
    tx(slide, 0.76, 0.60, 11.8, 0.62, title, 29, True, WHITE)
    box(slide, 0.78, 1.27, 0.62, 0.055, fill=CYAN, radius=0)
    if sub:
        tx(slide, 0.78, 1.40, 11.8, 0.30, sub, 11.5, False, MUTED)

def page_no(slide, n):
    tx(slide, 12.15, 7.06, 0.55, 0.25, f"{n:02d}", 9.5, True, RGBColor(0x54, 0x70, 0x8A), PP_ALIGN.RIGHT)
    tx(slide, 0.78, 7.06, 4.6, 0.25, "豆苗学堂 · 河海大学网页设计大赛参赛作品", 9, False, RGBColor(0x54, 0x70, 0x8A))

def new(prs, bg):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    s.shapes.add_picture(bg, 0, 0, width=prs.slide_width, height=prs.slide_height)
    return s

def chip(slide, x, y, w, h, text, color=CYAN, fill=PANEL2, size=10, bold=True):
    b = box(slide, x, y, w, h, fill=fill, line=color, radius=0.5, lw=0.9)
    tf = b.text_frame
    tf.margin_left = 0; tf.margin_right = 0; tf.margin_top = 0; tf.margin_bottom = 0
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = text
    set_run(r, size, bold, color)
    return b

def s01(prs, bg):
    s = new(prs, bg)
    chip(s, 0.80, 0.58, 4.55, 0.36, "河海大学网页设计大赛 · 静态网页组", CYAN, PANEL2, 10)
    tx(s, 0.78, 1.24, 9.0, 0.55, "豆 苗 学 堂", 44, True, WHITE, spacing=2)
    tx(s, 0.80, 2.00, 10.6, 1.05, "两条航线，顺江而下", 40, True, CYAN)
    tx(s, 0.80, 2.90, 10.8, 0.55, "从像素火花驶向真实代码", 25, True, WHITE)
    tx(s, 0.82, 3.54, 10.6, 0.40, "一滴水从秦淮河出发，穿过南京城、汇入河海",
       12.5, False, MUTED)
    chip(s, 0.80, 4.26, 1.45, 0.34, "6–12 岁", GOLD, PANEL2, 10)
    chip(s, 2.38, 4.26, 1.85, 0.34, "零依赖 · 无需后端", GOLD, PANEL2, 10)
    cx, cy = 11.05, 3.55
    for rr, col, lw in [(1.18, RGBColor(0x1B, 0x5A, 0x78), 1.2), (0.94, RGBColor(0x22, 0xD3, 0xEE), 1.4)]:
        c = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(cx - rr), Inches(cy - rr), Inches(rr * 2), Inches(rr * 2))
        c.fill.background(); c.line.color.rgb = col; c.line.width = Pt(lw); c.shadow.inherit = False
    tx(s, cx - 0.55, cy - 0.42, 1.1, 0.5, "40", 26, True, CYAN, PP_ALIGN.CENTER)
    tx(s, cx - 0.55, cy + 0.04, 1.1, 0.3, "个页面", 9.5, False, MUTED, PP_ALIGN.CENTER)
    tx(s, cx - 0.85, cy + 1.34, 1.7, 0.3, "六站航线 · 六枚徽章", 9.5, False, MUTED, PP_ALIGN.CENTER)
    tx(s, 0.80, 6.66, 7.0, 0.32, "wbydxx.github.io/doumiao-academy", 12.5, True, CYAN)
    page_no(s, 1)

def s02(prs, bg):
    s = new(prs, bg)
    head(s, "OVERVIEW", "一页看懂豆苗学堂", "为河海大学网页设计大赛而作：40 个页面、6 大关卡、25 个课时，全部原生实现")
    stats = [("40", "个页面", "首页 + 37 课程 + 成就墙 + 404"),
             ("6", "大关卡", "二进制 / AI / 编程 / 安全 / 术语 / 代码"),
             ("25", "个课时", "每课 3–7 幕：开场到小结"),
             ("0", "外部依赖", "零框架、零后端、零 CDN")]
    for i, (num, label, sub) in enumerate(stats):
        x = 0.78 + i * 3.06
        box(s, x, 1.92, 2.86, 1.28, PANEL, RGBColor(0x1E, 0x3E, 0x5C), 0.08)
        tx(s, x + 0.24, 2.02, 1.2, 0.6, num, 28, True, CYAN)
        tx(s, x + 1.10, 2.12, 1.6, 0.35, label, 11.5, True, WHITE)
        tx(s, x + 0.24, 2.62, 2.45, 0.5, sub, 8.6, False, MUTED, line=1.15)
    pic(s, SHOTS + "/01_home.png", 0.78, 3.42, 7.55, 3.44)
    tx(s, 8.62, 3.46, 4.0, 0.34, "它解决什么问题？", 14, True, GOLD)
    items = [("抽象概念有锚点", "花灯是 0/1，城墙是边界，画舫是指令"),
             ("单屏只做一件事", "分幕课件把长页面拆成 3–7 幕"),
             ("动手才有反馈", "内置 Python 运行器，改完立刻跑"),
             ("成长看得见", "雨花石 → 徽章 → 证书")]
    y = 3.92
    for t, d in items:
        box(s, 8.62, y, 0.07, 0.46, fill=CYAN, radius=0)
        tx(s, 8.84, y - 0.02, 3.9, 0.28, t, 11.5, True, WHITE)
        tx(s, 8.84, y + 0.25, 3.95, 0.30, d, 8.8, False, MUTED)
        y += 0.78
    page_no(s, 2)

def s03(prs, bg):
    s = new(prs, bg)
    head(s, "INSPIRATION", "灵感：从秦淮河到河海",
         "河海大学因水而生；六个南京地标对应六个知识点，水把它们串成一条航线")
    pairs = [("秦淮花灯", "亮 / 灭 就是 1 / 0", "二进制"),
             ("红山动物园", "喂图片给电脑就是训练", "人工智能"),
             ("秦淮画舫", "航线就是指令序列", "编程"),
             ("南京明城墙", "里 / 外 就是安全边界", "网络安全"),
             ("金陵图书馆", "索引就是术语地图", "AI 术语"),
             ("紫峰实验室", "窗口就是代码实验台", "代码实验")]
    for i, (a, b, c) in enumerate(pairs):
        col, row = i % 3, i // 3
        x = 0.78 + col * 3.10
        y = 1.86 + row * 2.24
        box(s, x, y, 2.92, 1.94, PANEL, RGBColor(0x1E, 0x3E, 0x5C), 0.08)
        tx(s, x + 0.26, y + 0.20, 2.4, 0.34, a, 16, True, WHITE)
        tx(s, x + 0.26, y + 0.68, 2.45, 0.32, b, 10, False, MUTED)
        arrow(s, x + 0.26, y + 1.10, x + 0.92, y + 1.10, GOLD, 1.3)
        tx(s, x + 0.26, y + 1.24, 2.45, 0.40, c, 17, True, GOLD)
    tx(s, 0.80, 6.36, 11.9, 0.30, "河海大学始于 1915 年河海工程专门学校 · 中国第一所培养水利人才的高等学府",
       9.5, False, CYAN)
    tx(s, 0.80, 6.70, 11.9, 0.30, "在地化不是装饰，而是认知支架：孩子先看见城市，再看见科学。", 9.5, False, MUTED)
    page_no(s, 3)

def s04(prs, bg):
    s = new(prs, bg)
    head(s, "DESIGN PHILOSOPHY", "设计理念：上善若水，两条航线",
         "水遇石则分、遇壑则汇：让技术教育像水一样，分流而不淘汰，汇流而成海")
    box(s, 0.78, 1.84, 5.88, 3.35, PANEL, RGBColor(0x1E, 0x3E, 0x5C), 0.06)
    tx(s, 1.04, 2.02, 3.0, 0.34, "入门航线 · 支流", 15, True, CYAN)
    tx(s, 1.04, 2.38, 5.4, 0.30, "用游戏点亮直觉，适合第一次接触的孩子", 9.5, False, MUTED)
    entry = ["花灯密码：把数字读成灯组", "训练 AI 小助手：喂图片、帮纠错",
             "画舫航线：顺序与循环", "城墙情境：守住小秘密"]
    y = 2.86
    for i, t in enumerate(entry):
        tx(s, 1.04, y, 0.4, 0.30, f"0{i+1}", 10, True, GOLD)
        tx(s, 1.50, y - 0.01, 4.9, 0.30, t, 10.8, False, WHITE)
        y += 0.52
    box(s, 6.86, 1.84, 5.68, 3.35, PANEL, RGBColor(0x3A, 0x5A, 0x2A), 0.06)
    tx(s, 7.12, 2.02, 3.2, 0.34, "进阶航道 · 干流", 15, True, GOLD)
    tx(s, 7.12, 2.38, 5.1, 0.30, "完成全部入门关卡后解锁，走向术语与真实代码", 9.5, False, MUTED)
    adv = ["AI 术语解码：机器学习家族、大语言模型、AI 安全",
           "代码实验室：7 课 Python，从变量到综合项目",
           "自研解释器：改代码、跑结果、对目标",
           "六关全通，领取「科技小苗」结业证书"]
    y = 2.92
    for i, t in enumerate(adv):
        tx(s, 7.12, y, 0.4, 0.30, f"0{i+1}", 10, True, CYAN)
        tx(s, 7.58, y - 0.01, 4.8, 0.30, t, 10.4, False, WHITE)
        y += 0.52
    tx(s, 0.80, 5.46, 3.0, 0.30, "三级激励 · 汇流成海", 12.5, True, GOLD)
    stages = [("雨花石", "完成课时、游戏或测验获得", "即时反馈"),
              ("关卡徽章", "课程 + 游戏 + 测验都完成", "阶段成就"),
              ("学习证书", "六关全通生成电子证书", "长期目标")]
    for i, (a, b, c) in enumerate(stages):
        x = 0.78 + i * 4.12
        box(s, x, 5.82, 3.86, 0.96, PANEL2, RGBColor(0x2A, 0x6A, 0x8A), 0.08)
        tx(s, x + 0.22, 5.92, 1.5, 0.30, a, 12.5, True, CYAN)
        tx(s, x + 0.22, 6.24, 2.55, 0.26, b, 8.5, False, MUTED)
        tx(s, x + 2.92, 6.02, 0.80, 0.26, c, 8.5, True, GOLD)
        if i < 2:
            arrow(s, x + 3.90, 6.30, x + 4.08, 6.30, GOLD, 1.4)
    page_no(s, 4)

def s05(prs, bg):
    s = new(prs, bg)
    head(s, "INFORMATION ARCHITECTURE", "信息架构：40 个页面，三层到达",
         "首页负责动机，关卡负责学习，成就墙负责反馈")
    box(s, 4.42, 1.78, 4.48, 0.66, PANEL2, CYAN, 0.10)
    tx(s, 4.42, 1.94, 4.48, 0.32, "首页 · 六幕分屏", 13, True, WHITE, PP_ALIGN.CENTER)
    mods = [("花灯密码", "5"), ("AI 小课堂", "6"), ("编程初体验", "5"),
            ("城墙小卫士", "6"), ("AI 术语解码", "5"), ("代码实验室", "10")]
    bus_y = 2.74
    c = s.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(6.66), Inches(2.44), Inches(6.66), Inches(bus_y))
    c.line.color.rgb = RGBColor(0x2A, 0x6A, 0x8A); c.line.width = Pt(1.2)
    c2 = s.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(1.60), Inches(bus_y), Inches(11.72), Inches(bus_y))
    c2.line.color.rgb = RGBColor(0x2A, 0x6A, 0x8A); c2.line.width = Pt(1.2)
    for i, (name, cnt) in enumerate(mods):
        x = 0.78 + i * 2.0
        cx = x + 0.92
        c3 = s.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(cx), Inches(bus_y), Inches(cx), Inches(2.98))
        c3.line.color.rgb = RGBColor(0x2A, 0x6A, 0x8A); c3.line.width = Pt(1.2)
        box(s, x, 2.98, 1.84, 1.02, PANEL, RGBColor(0x1E, 0x3E, 0x5C), 0.08)
        tx(s, x, 3.12, 1.84, 0.30, name, 11, True, WHITE, PP_ALIGN.CENTER)
        tx(s, x, 3.52, 1.84, 0.26, f"{cnt} 个页面", 9, False, CYAN, PP_ALIGN.CENTER)
    layers = [("课程 · 25 课时", "分幕学习，每课 3–7 幕", 4.02),
              ("游戏 · 6 款", "动手试错，形成直觉", 4.72),
              ("测验 · 6 套", "3–6 题验收，完成后计入进度", 5.42)]
    for t, d, y in layers:
        box(s, 1.60, y, 8.6, 0.56, PANEL2, None, 0.10)
        tx(s, 1.86, y + 0.13, 2.6, 0.30, t, 11.5, True, WHITE)
        tx(s, 4.6, y + 0.15, 5.2, 0.28, d, 9.5, False, MUTED)
    box(s, 10.42, 4.02, 2.12, 1.96, PANEL, GOLD, 0.08)
    tx(s, 10.42, 4.18, 2.12, 0.30, "成就墙", 13, True, GOLD, PP_ALIGN.CENTER)
    tx(s, 10.62, 4.60, 1.75, 1.20, "徽章\n进度\n雨花石\n证书", 10, False, WHITE, PP_ALIGN.CENTER, line=1.5)
    arrow(s, 10.22, 5.00, 10.38, 5.00, GOLD, 1.4)
    tx(s, 0.80, 6.52, 11.9, 0.30, "全站 40 个页面，按课时顺序与导航串联，可从首页逐级进入。", 10, False, MUTED)
    page_no(s, 5)

def s06(prs, bg):
    s = new(prs, bg)
    head(s, "VISUAL DESIGN", "界面设计：河海蓝里的南京",
         "主色取自河海蓝的深调，一套设计令牌驱动全站")
    cols = [("#070D1A", "河海蓝"), ("#0E1A2E", "卡片"), ("#22D3EE", "青色高光"),
            ("#F5C56B", "金色奖励"), ("#2E86DE", "链接蓝"), ("#35C78A", "成功绿")]
    for i, (hexv, label) in enumerate(cols):
        x = 0.78 + i * 0.63
        c = RGBColor(int(hexv[1:3], 16), int(hexv[3:5], 16), int(hexv[5:7], 16))
        box(s, x, 1.86, 0.54, 0.54, c, RGBColor(0x2A, 0x4A, 0x66), 0.12)
        tx(s, x - 0.06, 2.46, 0.68, 0.22, hexv, 6.8, False, MUTED, PP_ALIGN.CENTER)
        tx(s, x - 0.10, 2.68, 0.76, 0.22, label, 7.2, False, WHITE, PP_ALIGN.CENTER)
    tx(s, 0.78, 3.10, 5.2, 0.42, "标题 / 800 字重", 20, True, WHITE)
    tx(s, 0.78, 3.58, 5.2, 0.34, "正文 15–17px · 行高 1.7", 11.5, False, MUTED)
    tx(s, 0.78, 4.02, 5.2, 0.34, "print(\"你好，南京\")  ·  等宽字体", 10.5, False, CYAN)
    tx(s, 0.78, 4.58, 3.0, 0.30, "动效语言", 12, True, GOLD)
    motions = ["翻幕位移 + 入场动画", "点击涟漪与按压反馈", "雨花石花瓣粒子", "站点间跃迁转场"]
    y = 4.94
    for m in motions:
        tx(s, 0.80, y, 4.4, 0.28, "·  " + m, 9.8, False, WHITE)
        y += 0.34
    pic(s, SHOTS + "/01_home.png", 5.62, 1.80, 7.0, 4.86)
    page_no(s, 6)

def s07(prs, bg):
    s = new(prs, bg)
    head(s, "LEARNING LOOP", "学习闭环：学 → 练 → 闯 → 测 → 奖",
         "每一关都是同一个闭环，完成后点亮徽章，并可一键衔接下一关")
    steps = [("学", "课程分幕", "看场景 · 懂概念"),
             ("练", "试一试", "改代码 · 立刻跑"),
             ("闯", "互动游戏", "点一点 · 形成直觉"),
             ("测", "挑战测验", "3–6 题 · 确认掌握"),
             ("奖", "点亮徽章", "雨花石 · 证书")]
    for i, (big, title, sub) in enumerate(steps):
        x = 0.80 + i * 2.44
        sh = s.shapes.add_shape(MSO_SHAPE.CHEVRON, Inches(x), Inches(2.34), Inches(2.34), Inches(1.02))
        sh.fill.solid(); sh.fill.fore_color.rgb = PANEL2 if i < 4 else RGBColor(0x2A, 0x22, 0x10)
        sh.line.color.rgb = CYAN if i < 4 else GOLD; sh.line.width = Pt(1.1)
        sh.shadow.inherit = False
        tf = sh.text_frame; tf.word_wrap = False
        tf.margin_left = 0; tf.margin_right = 0
        p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
        r = p.add_run(); r.text = big; set_run(r, 22, True, CYAN if i < 4 else GOLD)
        tx(s, x + 0.16, 3.52, 2.0, 0.30, title, 12, True, WHITE, PP_ALIGN.CENTER)
        tx(s, x + 0.16, 3.84, 2.0, 0.26, sub, 8.8, False, MUTED, PP_ALIGN.CENTER)
    ax1, ax2 = 9.95, 5.30
    yb = 4.42
    c1 = s.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(ax1), Inches(3.36), Inches(ax1), Inches(yb))
    c1.line.color.rgb = GOLD; c1.line.width = Pt(1.4)
    c2 = s.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(ax2), Inches(yb), Inches(ax1), Inches(yb))
    c2.line.color.rgb = GOLD; c2.line.width = Pt(1.4)
    arrow(s, ax2, yb, ax2, 3.42, GOLD, 1.4)
    tx(s, 5.16, 4.52, 5.4, 0.28, "答错会给出提示并可继续作答，进度只增不减", 9.5, False, GOLD)
    box(s, 0.80, 5.34, 11.74, 0.92, PANEL, RGBColor(0x2A, 0x6A, 0x8A), 0.06)
    tx(s, 1.06, 5.56, 11.2, 0.32, "完成本关  →  一键跃迁下一关  →  六关全通解锁「我的学习证书」", 14, True, WHITE, PP_ALIGN.CENTER)
    tx(s, 0.82, 6.52, 11.7, 0.28, "进度保存在浏览器本地：Driver 驱动层 + ObjectStore 对象桶 + Repository 仓库，可导出备份。", 9.5, False, MUTED)
    page_no(s, 7)

def s08(prs, bg):
    s = new(prs, bg)
    head(s, "COURSEWARE", "分幕课件：一屏只讲一件事",
         "长页面在运行时重组为全屏分幕，统一字号与滚动策略")
    pic(s, SHOTS + "/06_lesson.png", 0.80, 1.80, 7.10, 4.34)
    acts = [("开场", "场景与问题：花灯为什么一闪一闪？"),
            ("讲解", "概念拆解：亮 = 1，灭 = 0"),
            ("试一试", "跟着示例读一组灯"),
            ("互动", "点灯游戏：把数字读成灯组"),
            ("小结", "一句话记住 + 下一课预告")]
    tx(s, 8.24, 1.86, 4.2, 0.32, "常见环节（幕数 3–7）", 14, True, GOLD)
    y = 2.28
    for i, (a, b) in enumerate(acts):
        box(s, 8.24, y, 0.36, 0.36, PANEL2, CYAN, 0.5, 0.8)
        tx(s, 8.24, y + 0.055, 0.36, 0.24, str(i + 1), 10, True, CYAN, PP_ALIGN.CENTER)
        tx(s, 8.78, y - 0.02, 3.7, 0.28, a, 11.5, True, WHITE)
        tx(s, 8.78, y + 0.26, 3.8, 0.28, b, 8.8, False, MUTED)
        y += 0.80
    tx(s, 8.26, 6.34, 4.2, 0.28, "内容超高自动转幕内滚动，按钮不再压住正文", 8.8, False, CYAN)
    page_no(s, 8)

def s09(prs, bg):
    s = new(prs, bg)
    head(s, "CODE LAB", "代码实验室：在浏览器里写真正的 Python",
         "自研教学用解释器：改代码 → 点运行 → 与目标输出比对 → 立即判定")
    pic(s, SHOTS + "/03_codelab.png", 0.80, 1.80, 7.28, 4.40)
    feats = [("无需安装", "打开网页就能写，变量、条件、循环、列表、字典、函数全支持"),
             ("即时判定", "输出与目标一致即通关，错误提示用孩子能懂的话"),
             ("任务驱动", "每个任务配一张工程图与一句目标输出，先想后写"),
             ("可还原", "改坏了点「还原」回到初始代码，鼓励大胆试错")]
    y = 1.88
    for t, d in feats:
        box(s, 8.40, y, 0.06, 0.62, fill=CYAN, radius=0)
        tx(s, 8.62, y - 0.02, 3.9, 0.28, t, 12, True, WHITE)
        tx(s, 8.62, y + 0.26, 3.95, 0.48, d, 8.8, False, MUTED)
        y += 0.92
    box(s, 8.40, 5.62, 4.12, 0.56, PANEL2, RGBColor(0x2A, 0x6A, 0x8A), 0.08)
    tx(s, 8.56, 5.76, 3.8, 0.28, "第 6 关 · 7 课（含 1 个综合项目）", 10, True, CYAN)
    page_no(s, 9)

def s10(prs, bg):
    s = new(prs, bg)
    head(s, "GAMIFICATION", "游戏化：让进步看得见",
         "把「学完了」变成「点亮了」：即时反馈、阶段成就、长期目标")
    pic(s, SHOTS + "/04_achievements.png", 0.80, 1.80, 7.20, 4.42)
    nums = [("42", "颗雨花石", CYAN), ("6", "枚徽章", GOLD), ("100", "% 进度", GREEN)]
    for i, (n, l, c) in enumerate(nums):
        x = 8.36 + i * 1.62
        tx(s, x, 1.94, 1.5, 0.52, n, 24, True, c, PP_ALIGN.CENTER)
        tx(s, x, 2.46, 1.5, 0.26, l, 8.5, False, MUTED, PP_ALIGN.CENTER)
    tx(s, 8.36, 2.96, 4.2, 0.30, "成就墙做什么？", 13, True, GOLD)
    items = ["六枚徽章：未点亮为线稿，点亮后发光", "总进度环形图，实时读取本地进度",
             "雨花石收藏墙，记录每一颗的来历", "输入姓名生成电子证书，可保存图片",
             "进度导出 JSON、重置、一键演示"]
    y = 3.32
    for t in items:
        tx(s, 8.38, y, 4.2, 0.28, "·  " + t, 9.4, False, WHITE)
        y += 0.38
    box(s, 8.36, 5.42, 4.18, 0.80, PANEL2, CYAN, 0.08)
    tx(s, 8.56, 5.56, 3.85, 0.26, "进度只增不减", 10.5, True, CYAN)
    tx(s, 8.56, 5.84, 3.85, 0.26, "答错可重试，保护儿童的学习信心", 8.5, False, MUTED)
    page_no(s, 10)

def s11(prs, bg):
    s = new(prs, bg)
    head(s, "INNOVATION", "六个创新点", "不是把成人内容翻译给孩子，而是为儿童重新设计学习路径")
    items = [("01", "在地化叙事", "六个南京地标对应六个知识点，从秦淮河到河海，让抽象概念有具体锚点"),
             ("02", "浏览器内代码实验室", "自研 Python 子集解释器，零安装、零后端、即时判定"),
             ("03", "分幕课件引擎", "长页面自动重组为全屏分幕，统一节奏与字号"),
             ("04", "游戏化闭环", "学练闯测奖绑定三级激励，进度只增不减"),
             ("05", "零依赖三层存储", "Driver / ObjectStore / Repository，禁用存储自动回退"),
             ("06", "无障碍与移动优先", "手势仲裁、键盘操作、朗读入口、对比度校验")]
    for i, (n, t, d) in enumerate(items):
        col, row = i % 3, i // 3
        x = 0.78 + col * 4.10
        y = 1.86 + row * 2.34
        box(s, x, y, 3.88, 2.06, PANEL, RGBColor(0x1E, 0x3E, 0x5C), 0.07)
        tx(s, x + 0.24, y + 0.18, 0.7, 0.36, n, 13, True, GOLD)
        tx(s, x + 0.24, y + 0.62, 3.4, 0.34, t, 14, True, WHITE)
        tx(s, x + 0.24, y + 1.06, 3.45, 0.80, d, 9.2, False, MUTED, line=1.35)
    page_no(s, 11)

def s12(prs, bg):
    s = new(prs, bg)
    head(s, "TECH STACK", "技术方案：零依赖的三层架构",
         "纯静态 HTML5 + CSS3 + 原生 JavaScript，无框架、无构建、无 CDN")
    layers = [("表现层", "40 个静态页面 · 语义化 HTML5 · CSS 设计令牌 · 响应式断点", 1.82, CYAN),
              ("交互层", "分幕引擎 · 代码解释器 · 手势仲裁 · 语音朗读 · 动效与音效", 3.10, GOLD),
              ("数据层", "catalog 目录 · localStorage 三层存储 · 进度导出 / 重置", 4.38, GREEN)]
    for name, desc, y, c in layers:
        box(s, 0.78, y, 7.30, 1.04, PANEL, c, 0.06)
        tx(s, 1.02, y + 0.16, 1.35, 0.32, name, 13.5, True, c)
        tx(s, 1.02, y + 0.56, 6.85, 0.30, desc, 9.2, False, MUTED)
    arrow(s, 4.40, 2.90, 4.40, 3.06, CYAN, 1.2)
    arrow(s, 4.40, 4.18, 4.40, 4.34, CYAN, 1.2)
    caps = ["分幕引擎", "Python 解释器", "三层存储", "手势仲裁", "语音朗读", "进度导出"]
    for i, c in enumerate(caps):
        x = 8.42 + (i % 2) * 2.16
        y = 1.92 + (i // 2) * 0.66
        chip(s, x, y, 2.02, 0.46, c, CYAN, PANEL2, 9.5)
    tx(s, 8.42, 4.02, 4.2, 0.28, "原生能力清单", 11.5, True, GOLD)
    notes = ["无框架：加载即用，无需构建", "无后端：进度保存在浏览器", "无 CDN：全部资源本地化", "部署：GitHub Pages 推送即发布"]
    y = 4.38
    for n in notes:
        tx(s, 8.44, y, 4.1, 0.26, "·  " + n, 9.2, False, WHITE)
        y += 0.36
    tx(s, 8.42, 6.34, 4.2, 0.30, "全部资源随包提供 · 无外部请求", 9.2, False, CYAN)
    page_no(s, 12)

def s13(prs, bg):
    s = new(prs, bg)
    head(s, "SIX LEVELS", "六大关卡：内容与目标期望",
         "课程建立概念，游戏形成直觉，测验确认掌握")
    rows = [
        ("一 · 花灯密码", "二进制 3 课", "花灯密码闯关 · 3 题", "把 0–15 读成四位灯组"),
        ("二 · AI 小课堂", "AI 4 课", "训练 AI 小助手 · 3 题", "说出 AI 靠数据学习、也会犯错"),
        ("三 · 编程初体验", "编程 3 课", "画舫航线闯关 · 3 题", "拆解顺序指令，用循环简化重复"),
        ("四 · 城墙小卫士", "安全 4 课", "城墙情境闯关 · 5 题", "分清可公开与需保密的信息"),
        ("五 · AI 术语解码", "术语 3 课", "术语挑战赛 · 4 题", "解释机器学习、神经网络与大模型"),
        ("六 · 代码实验室", "Python 7 课", "代码谜题闯关 · 6 题", "完成「南京小导游」项目"),
    ]
    tw = [2.85, 2.30, 3.05, 3.55]
    x0, y0 = 0.78, 1.76
    hh = 0.44
    headers = ["关卡", "课程", "游戏 / 测验", "目标期望"]
    xx = x0
    for i, htext in enumerate(headers):
        box(s, xx, y0, tw[i], hh, RGBColor(0x0B, 0x20, 0x36), None, 0)
        tx(s, xx + 0.14, y0 + 0.09, tw[i] - 0.2, 0.28, htext, 9.6, True, CYAN)
        xx += tw[i]
    for r, row in enumerate(rows):
        y = y0 + hh + r * 0.715
        fill = PANEL if r % 2 == 0 else RGBColor(0x0C, 0x18, 0x2A)
        xx = x0
        for i, val in enumerate(row):
            box(s, xx, y, tw[i], 0.695, fill, RGBColor(0x1A, 0x33, 0x4C), 0)
            tx(s, xx + 0.14, y + 0.20, tw[i] - 0.22, 0.30, val, 9.6, i == 0, WHITE if i == 0 else MUTED)
            xx += tw[i]
    tx(s, 0.80, 6.72, 11.9, 0.30, "三件事全部完成才点亮徽章；答错会给出提示，可继续作答。", 9.5, False, GOLD)
    page_no(s, 13)

def s14(prs, bg):
    s = new(prs, bg)
    head(s, "RESPONSIVE", "手机适配：同一套内容，两种尺寸",
         "不是缩小版，而是重新排版的移动体验")
    pic(s, SHOTS + "/09_mobile_home.png", 1.02, 1.74, 2.30, 5.02)
    pic(s, SHOTS + "/10_mobile_codelab.png", 3.70, 1.74, 2.30, 5.02)
    tx(s, 1.02, 6.80, 2.30, 0.24, "首页 · 竖屏分幕", 8.8, False, MUTED, PP_ALIGN.CENTER)
    tx(s, 3.70, 6.80, 2.30, 0.24, "代码实验室", 8.8, False, MUTED, PP_ALIGN.CENTER)
    tips = [("手势仲裁", "起点在编辑器内则不触发翻页，输入与大页滚动互不冲突"),
            ("安全区适配", "顶部导航可横滑，状态栏与底部手势条不遮挡内容"),
            ("断点重排", "双栏改单栏，卡片纵向堆叠，字号不缩小"),
            ("幕内滚动", "内容超高自动转为幕内滚动，按钮入文档流不压正文"),
            ("触屏友好", "按钮约 40px 触控高度，滑动翻页带 800ms 冷却"),
            ("无横向溢出", "锁定页面横向滚动，避免露白")]
    tx(s, 6.70, 1.80, 4.2, 0.32, "移动端六项处理", 14, True, GOLD)
    y = 2.26
    for t, d in tips:
        box(s, 6.70, y, 0.06, 0.56, fill=CYAN, radius=0)
        tx(s, 6.94, y - 0.02, 5.4, 0.28, t, 11, True, WHITE)
        tx(s, 6.94, y + 0.26, 5.5, 0.30, d, 8.6, False, MUTED)
        y += 0.72
    page_no(s, 14)

def s15(prs, bg):
    s = new(prs, bg)
    tx(s, 0.94, 1.14, 8.0, 0.30, "河海大学网页设计大赛 · 静态网页组参赛作品", 12, True, CYAN)
    tx(s, 0.92, 1.58, 8.2, 2.30,
       "让每个孩子，\n都能在自己城市的江面上，\n看见科技的光。", 33, True, WHITE, line=1.5)
    tx(s, 0.96, 4.12, 7.6, 0.36, "豆苗学堂 · 少儿 AI 与计算机科普学习站", 14, False, MUTED)
    box(s, 0.96, 4.72, 5.72, 0.62, RGBColor(0x0F, 0x2C, 0x46), RGBColor(0x2A, 0x6A, 0x8A), 0.14)
    tx(s, 1.16, 4.88, 5.3, 0.30, "wbydxx.github.io/doumiao-academy", 14, True, CYAN)
    stats = [("40", "页面"), ("6", "大关卡"), ("25", "课时"), ("0", "依赖")]
    for i, (n, l) in enumerate(stats):
        x = 7.10 + i * 1.42
        tx(s, x, 1.98, 1.30, 0.52, n, 26, True, CYAN, PP_ALIGN.CENTER)
        tx(s, x, 2.54, 1.30, 0.26, l, 9, False, MUTED, PP_ALIGN.CENTER)
    box(s, 10.02, 3.10, 2.34, 2.34, RGBColor(0xFF, 0xFF, 0xFF), None, 0.06)
    qr = os.path.join(BUILD, "qr.png")
    if os.path.exists(qr):
        s.shapes.add_picture(qr, Inches(10.16), Inches(3.24), Inches(2.06), Inches(2.06))
    tx(s, 10.02, 5.54, 2.34, 0.26, "扫码打开作品", 9, False, MUTED, PP_ALIGN.CENTER)
    tx(s, 0.96, 6.48, 11.5, 0.30, "谢谢观看 · 欢迎在手机上打开体验", 10.5, False, RGBColor(0x6E, 0x8A, 0xA6))
    page_no(s, 15)

def main():
    make_bg()
    prs = Presentation()
    prs.slide_width = Inches(W)
    prs.slide_height = Inches(H)
    bg = os.path.join(BUILD, "bg16x9.png")
    for fn in (s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12, s13, s14, s15):
        fn(prs, bg)
    out = os.path.join(BUILD, "演示PPT.pptx")
    prs.save(out)
    print("saved", out, len(prs.slides._sldIdLst))

if __name__ == "__main__":
    main()
