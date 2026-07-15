## Vibe
- Dark tech dashboard with cyberpunk infographics influence: glowing signal accents, structured grid modules, and high-contrast typography against a near-black canvas.

## Color
- Primary: #ff4757
- On Primary: #0f1117
- Accent: #4dabf7
- On Accent: #0f1117
- Background: #0f1117
- Foreground: #e8eaf0
- Muted: #8b92a8
- Border: #2a2f3e
- Secondary: #161922

## Typography
- Heading: Inter (family: 'Inter', weight: 700-800, url: https://resource-static.bj.bcebos.com/fonts/Inter-VariableFont_opsz,wght.woff2)
- Body: Inter (family: 'Inter', weight: 400-500, url: https://resource-static.bj.bcebos.com/fonts/Inter-VariableFont_opsz,wght.woff2)

## Visual Language
- 核心视觉签名：顶部3px信号色边框的深色卡片（signal-border card）作为统一容器语言，配合左侧微光渐变，营造仪表盘模块的科技感边界。
- 材质与深度：几乎无投影，靠背景层级（#0f1117 → #161922 → #1e2230）制造深度；仅有精致的1px边框分隔模块。
- 容器与按钮：卡片使用大圆角（16px）、细边框和顶部信号色短边；主按钮使用Primary文字+透明背景+细边框的幽灵按钮，避免大色块铺底。
- 布局节奏：密集KPI卡片行 + 宽松图表区的明暗交替，强调信息层级；所有文本左对齐，保持秩序感。

## Animation
- 入场：KPI卡片和图表卡片从下方20px淡入（translateY + opacity），按模块错落100ms延迟。
- 交互：卡片hover时轻微上浮（translateY -2px）+ 边框颜色过渡至Primary；数据刷新时旋转图标+数字滚动动画。
- 过渡：图表数据切换使用ECharts原生过渡动画；筛选变化时整体内容fade-in/out 200ms。

## Forbidden
- 禁用大块纯色铺底和大面积渐变背景
- 禁用通用阴影和拟物化按钮
- 禁用Emoji作为标题/按钮/图标