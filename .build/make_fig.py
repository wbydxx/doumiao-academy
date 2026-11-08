#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""绘制「学→练→闯→测→奖」学习闭环流程图"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
from matplotlib.font_manager import FontProperties

FONT = FontProperties(fname="/usr/share/fonts/opentype/noto/NotoSansCJK-Medium.ttc")
FONT_B = FontProperties(fname="/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc")
NAVY = "#0B2036"; CYAN = "#0E7490"; GOLD = "#B7791F"; MUTED = "#5A6B7C"
LIGHT = "#F2F8FD"; RULE = "#CFE0EE"

fig, ax = plt.subplots(figsize=(11.2, 4.4), dpi=220)
ax.set_xlim(0, 11.2); ax.set_ylim(0, 4.4); ax.axis("off")
fig.patch.set_facecolor("white")

steps = [
    ("01", "学", "课程分幕", "看场景 · 懂概念"),
    ("02", "练", "试一试", "改代码 · 立刻跑"),
    ("03", "闯", "互动游戏", "点一点 · 形成直觉"),
    ("04", "测", "挑战测验", "3 题 · 确认掌握"),
    ("05", "奖", "点亮徽章", "雨花石 · 证书"),
]
w, h, gap = 1.85, 1.55, 0.30
x0 = 0.42
y = 1.86
for i, (num, big, title, sub) in enumerate(steps):
    x = x0 + i * (w + gap)
    box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.02,rounding_size=0.10",
                         linewidth=1.2, edgecolor=RULE, facecolor=LIGHT, zorder=2)
    ax.add_patch(box)
    ax.text(x + 0.16, y + h - 0.20, num, fontproperties=FONT_B, fontsize=10, color="#8FB3CC", va="top")
    ax.text(x + w / 2, y + h - 0.52, big, fontproperties=FONT_B, fontsize=23, color=CYAN, ha="center", va="center")
    ax.text(x + w / 2, y + 0.46, title, fontproperties=FONT_B, fontsize=11.5, color=NAVY, ha="center")
    ax.text(x + w / 2, y + 0.20, sub, fontproperties=FONT, fontsize=8.2, color=MUTED, ha="center")
    if i < 4:
        ax.add_patch(FancyArrowPatch((x + w + 0.03, y + h / 2), (x + w + gap - 0.03, y + h / 2),
                                     arrowstyle="-|>", mutation_scale=13, linewidth=1.8, color="#2E86C1"))

x_test = x0 + 3 * (w + gap) + w / 2
x_prac = x0 + 1 * (w + gap) + w / 2
yb = y - 0.16
ax.plot([x_test, x_test], [y, yb], color=GOLD, lw=1.6, solid_capstyle="round")
ax.plot([x_prac, x_test], [yb, yb], color=GOLD, lw=1.6, solid_capstyle="round")
ax.add_patch(FancyArrowPatch((x_prac, yb), (x_prac, y - 0.04),
                             arrowstyle="-|>", mutation_scale=13, linewidth=1.6, color=GOLD))
ax.text((x_prac + x_test) / 2, yb - 0.16, "未全对：回到练 / 闯，随时重试（进度只增不减）",
        fontproperties=FONT, fontsize=9, color=GOLD, ha="center")

bar = FancyBboxPatch((0.42, 0.34), 10.36, 0.62, boxstyle="round,pad=0.02,rounding_size=0.08",
                     linewidth=0, facecolor="#E9F5FA", zorder=1)
ax.add_patch(bar)
ax.text(5.60, 0.66, "点亮本关徽章  →  自动跃迁下一关  →  六关全通解锁「我的学习证书」",
        fontproperties=FONT_B, fontsize=10.5, color=NAVY, ha="center", va="center")

plt.tight_layout(pad=0.15)
plt.savefig("/workspace/.build/fig_loop.png", facecolor="white", bbox_inches="tight")
print("ok")
