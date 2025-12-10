# InspireMusic 🎵

一个现代化的在线音乐播放器 Web 应用，支持多平台音乐搜索、歌词同步显示和 PWA 离线安装。

## ✨ 功能特性

- **🔍 多平台搜索** - 支持网易云音乐、酷我音乐、QQ音乐聚合搜索
- **📃 歌词同步** - 实时同步歌词显示，支持翻译歌词
- **📋 播放列表** - 创建、导入、管理自定义播放列表
- **❤️ 收藏功能** - 一键收藏喜爱的歌曲
- **🔀 播放模式** - 支持顺序播放、随机播放、单曲循环
- **⏰ 定时播放** - 睡眠定时器，支持自定义时长
- **🎨 响应式设计** - 完美适配 PC 和移动端
- **📱 PWA 支持** - 可安装为桌面/移动应用，支持媒体会话通知
- **💾 智能缓存** - 本地缓存歌曲信息，减少重复请求

## 🛠️ 技术栈

### 核心框架
| 技术 | 版本 | 说明 |
|------|------|------|
| React | 19.2 | 前端 UI 框架 |
| TypeScript | 5.9 | 类型安全的 JavaScript |
| Vite | 7.2 | 下一代前端构建工具 |

### 样式与动画
| 技术 | 版本 | 说明 |
|------|------|------|
| Tailwind CSS | 4.1 | 原子化 CSS 框架 |
| Framer Motion | 12.x | React 动画库 |
| Lucide React | 0.556 | 精美图标库 |

### 工具链
| 技术 | 说明 |
|------|------|
| ESLint | 代码规范检查 |
| PostCSS | CSS 处理器 |
| vite-plugin-pwa | PWA 支持插件 |

## 📁 项目结构

```
InspireMusic/
├── public/                    # 静态资源
│   ├── android-chrome-*.png   # PWA 图标
│   ├── apple-touch-icon.png   # iOS 图标
│   ├── favicon.ico            # 网站图标
│   └── logo.svg               # Logo
├── src/
│   ├── api.ts                 # API 接口封装
│   ├── types.ts               # TypeScript 类型定义
│   ├── App.tsx                # 主应用组件
│   ├── main.tsx               # 应用入口
│   ├── index.css              # 全局样式与主题
│   ├── components/            # React 组件
│   │   ├── Layout.tsx         # 布局组件
│   │   ├── Sidebar.tsx        # PC 端侧边栏
│   │   ├── BottomNav.tsx      # 移动端底部导航
│   │   ├── PlayerBar.tsx      # 播放器控制栏
│   │   ├── SearchView.tsx     # 搜索页面
│   │   ├── LyricsView.tsx     # 歌词页面
│   │   ├── LibraryView.tsx    # 音乐库页面
│   │   ├── QueueView.tsx      # 播放队列
│   │   ├── SongList.tsx       # 歌曲列表组件
│   │   ├── ToplistsView.tsx   # 排行榜页面
│   │   ├── PlaylistDetailView.tsx  # 歌单详情
│   │   └── ui/                # 通用 UI 组件
│   │       ├── CoverImage.tsx # 封面图片组件
│   │       ├── Modal.tsx      # 模态框组件
│   │       ├── Select.tsx     # 下拉选择组件
│   │       ├── Slider.tsx     # 滑块组件
│   │       └── Toast.tsx      # 消息提示组件
│   ├── hooks/                 # 自定义 React Hooks
│   │   ├── useLocalStorage.ts # 本地存储 Hook
│   │   └── useMediaSession.ts # 媒体会话 API Hook
│   └── utils/                 # 工具函数
│       ├── cache.ts           # 缓存管理
│       └── colors.ts          # 颜色工具
├── index.html                 # HTML 入口
├── vite.config.ts             # Vite 配置
├── tailwind.config.js         # Tailwind 配置 (v4 使用 CSS 配置)
├── postcss.config.js          # PostCSS 配置
├── tsconfig.json              # TypeScript 配置
└── package.json               # 项目依赖
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- pnpm 或 npm

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 开发模式

```bash
pnpm dev
# 或
npm run dev
```

访问 http://localhost:5173 查看应用。

### 构建生产版本

```bash
pnpm build
# 或
npm run build
```

构建产物位于 `dist/` 目录。

### 预览生产版本

```bash
pnpm preview
# 或
npm run preview
```

## 📱 PWA 功能

应用支持 PWA (Progressive Web App)，具有以下特性：

- **可安装** - 在浏览器地址栏点击安装按钮，添加到桌面/启动器
- **离线支持** - Service Worker 缓存静态资源
- **媒体会话** - 在系统通知中心显示当前播放歌曲，支持控制播放

## 🎨 主题配色

应用采用深色主题设计，参考 Spotify 风格：

| 颜色变量 | 色值 | 用途 |
|---------|------|------|
| `--color-primary` | `#1db954` | 主色调 (绿色) |
| `--color-background` | `#121212` | 背景色 |
| `--color-surface` | `#181818` | 卡片/表面色 |
| `--color-secondary` | `#282828` | 次级背景色 |
| `--color-text` | `#b3b3b3` | 普通文本 |
| `--color-text-highlight` | `#ffffff` | 高亮文本 |

## 🔌 API 说明

应用通过后端 API 获取音乐数据，主要接口包括：

| 接口 | 说明 |
|------|------|
| `searchSongs` | 单平台歌曲搜索 |
| `aggregateSearch` | 聚合多平台搜索 |
| `getSongInfo` | 获取歌曲详情 |
| `getLyrics` | 获取歌词 |
| `getPlaylist` | 获取歌单 |
| `getToplists` | 获取排行榜列表 |
| `getToplistSongs` | 获取排行榜歌曲 |

## 📝 类型定义

项目使用 TypeScript，核心类型包括：

- `Platform` - 音乐平台类型 (`'netease' | 'kuwo' | 'qq'`)
- `Quality` - 音质等级 (`'128k' | '320k' | 'flac' | 'flac24bit'`)
- `Song` - 歌曲信息
- `SongInfo` - 歌曲详情（含 URL、封面、歌词）
- `LocalPlaylist` - 本地播放列表
- `ParsedLyricLine` - 解析后的歌词行

## 📄 License

MIT License
