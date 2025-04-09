# 决策魔方 (ChoiceCube)

决策魔方是一款帮助用户做决策的应用，通过多种风格的随机选择动画，为用户提供有趣而公正的选择体验。

## 功能特点

- **多种决策主题**：
  - 命运胶囊：传统经典的随机选择样式
  - 神选时刻：神秘而庄重的决策体验
  - 天机轮：东方特色的八卦转盘选择
  - 气运池：充满科技感的气泡选择

- **实用功能**：
  - 随机公正的决策结果
  - 历史记录保存和查看
  - 结果重现功能
  - 选项一键恢复

- **用户体验**：
  - 精美的动画效果
  - 流畅的交互设计
  - 支持震动反馈
  - 简洁直观的界面
  - 主题化背景图片

## 技术栈

- 基于 **UniApp** 跨平台框架开发
- 使用 **Vue.js** 组件化开发
- **Vuex** 状态管理
- CSS3 动画和过渡效果
- 本地存储实现历史记录功能

## 项目结构

```
choicecube-app/
├── components/          # 组件目录
├── pages/               # 页面目录
│   ├── index/           # 首页
│   ├── option-input/    # 选项输入页
│   ├── theme-select/    # 主题选择页
│   ├── animation/       # 动画展示页
│   ├── result/          # 结果展示页
│   └── history/         # 历史记录页
├── static/              # 静态资源
│   ├── images/          # 图片资源
│       ├── themes/      # 主题预览图
│       └── backgrounds/ # 页面背景图
├── store/               # Vuex状态管理
├── utils/               # 工具函数
├── App.vue              # 应用入口组件
├── main.js              # 应用入口文件
├── pages.json           # 页面配置
└── manifest.json        # 应用配置
```

## 图片资源

应用使用了两套图片资源系统：

### 主题预览图

位于 `/static/images/themes/` 目录，用于主题选择页面，包括：
- `capsule_preview.png` - 命运胶囊主题预览
- `divine_preview.png` - 神选时刻主题预览
- `wheel_preview.png` - 天机轮主题预览
- `pool_preview.png` - 气运池主题预览

### 背景图片

位于 `/static/images/backgrounds/` 目录，用于各页面背景：
- `home_bg.png` - 首页背景
- `option_input_bg.png` - 选项输入页背景
- `theme_select_bg.png` - 主题选择页背景
- 各主题动画页背景:
  - `capsule_animation_bg.png`
  - `divine_animation_bg.png`
  - `wheel_animation_bg.png`
  - `pool_animation_bg.png`
- 各主题结果页背景:
  - `capsule_result_bg.png`
  - `divine_result_bg.png`
  - `wheel_result_bg.png`
  - `pool_result_bg.png`

完整的图片规格和要求请参考：
- `/static/images/themes/theme-images-readme.md`
- `/static/images/backgrounds/backgrounds-readme.md`

## 开发说明

### 环境要求

- HBuilderX 3.0+
- Node.js 12.0+

### 安装与运行

1. 克隆项目到本地：
   ```bash
   git clone https://github.com/yourusername/choicecube-app.git
   ```

2. 使用HBuilderX打开项目

3. 运行项目：
   - 选择运行到内置浏览器
   - 或运行到安卓/iOS模拟器
   - 或运行到真机预览

## 贡献指南

欢迎提交问题报告和功能建议。如果您想贡献代码，请：

1. Fork本项目
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个Pull Request

## 许可证

[MIT License](LICENSE) 