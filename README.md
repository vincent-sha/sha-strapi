# 🚀 SHA-Strapi 后端项目

这是一个基于 **Strapi 5.31.3** 构建的内容管理系统（CMS）后端项目。项目支持多种内容类型管理，包括文章、作者、分类、关于页面等。

## 📋 项目概览

- **框架**: Strapi 5.31.3
- **数据库**: SQLite（默认）/ MySQL / PostgreSQL
- **Node版本**: >= 20.0.0 <= 24.x.x
- **语言**: TypeScript
- **状态**: 开发中（v0.1.0）

### 核心内容类型

- **文章 (Article)**: 管理博客文章内容
- **作者 (Author)**: 管理作者信息
- **分类 (Category)**: 管理文章分类
- **关于 (About)**: 管理关于页面内容
- **全局设置 (Global)**: 管理全局网站设置

## 🛠️ 项目结构

```
sha-strapi/
├── src/
│   ├── api/                    # API 内容类型定义和业务逻辑
│   │   ├── article/           # 文章模块
│   │   ├── author/            # 作者模块
│   │   ├── category/          # 分类模块
│   │   ├── about/             # 关于模块
│   │   └── global/            # 全局设置模块
│   ├── components/            # 可复用组件
│   │   └── shared/           # 共享组件（媒体、SEO、富文本等）
│   └── extensions/            # 扩展功能
├── config/                     # 项目配置
│   ├── server.ts             # 服务器配置
│   ├── database.ts           # 数据库配置
│   ├── middlewares.ts        # 中间件配置
│   └── plugins.ts            # 插件配置
├── data/                       # 种子数据
│   ├── data.json             # 初始化数据
│   └── uploads/              # 上传文件目录
├── database/                   # 数据库文件
│   └── migrations/           # 数据库迁移
├── scripts/                    # 工具脚本
│   └── seed.js               # 数据初始化脚本
├── public/                     # 静态资源
└── types/                      # TypeScript 类型定义
    └── generated/            # 自动生成的类型
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
# 或使用 yarn
yarn install
```

### 2. 环境配置

项目使用环境变量进行配置。可选择创建 `.env` 文件：

```env
# 数据库配置（默认使用 SQLite）
DATABASE_CLIENT=sqlite
# 可选：DATABASE_CLIENT=mysql 或 postgres

# 服务器配置
HOST=0.0.0.0
PORT=1337

# 应用密钥（必需）
APP_KEYS=your-app-keys-here
```

### 3. 初始化数据库（首次运行）

```bash
# 运行种子数据脚本初始化示例数据
npm run seed:example
```

### 4. 启动开发服务

```bash
# 开发模式（启用自动重载）
npm run dev
# 或
npm run develop
```

访问 http://localhost:1337/admin 打开 Strapi 管理后台。

## 📦 npm 命令详解

| 命令 | 描述 |
|------|------|
| `npm run dev` / `develop` | 启动开发服务器（热重载） |
| `npm run start` | 启动生产服务器（无热重载） |
| `npm run build` | 构建管理后台（TypeScript 编译） |
| `npm run console` | 进入 Strapi 控制台（REPL） |
| `npm run seed:example` | 运行示例数据初始化脚本 |
| `npm run deploy` | 部署到 Strapi Cloud |
| `npm run upgrade` | 升级 Strapi 到最新版本 |
| `npm run upgrade:dry` | 模拟升级（不实际执行） |

## 🗄️ 数据库配置

### SQLite（默认）
无需额外配置，开箱即用。数据库文件存储在 `database/` 目录。

### MySQL
```env
DATABASE_CLIENT=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=strapi
DATABASE_USERNAME=root
DATABASE_PASSWORD=password
DATABASE_SSL=false
```

### PostgreSQL
```env
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://user:password@localhost:5432/strapi
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
```

## 🔌  核心插件

- **@strapi/plugin-users-permissions**: 用户权限管理系统
- **@strapi/plugin-cloud**: Strapi Cloud 集成支持

## 📝 API 端点示例

项目自动生成 RESTful API 端点，示例：

- `GET /api/articles` - 获取所有文章
- `POST /api/articles` - 创建新文章
- `GET /api/articles/:id` - 获取单个文章
- `PUT /api/articles/:id` - 更新文章
- `DELETE /api/articles/:id` - 删除文章

同样适用于 `/api/authors`, `/api/categories`, `/api/about`, `/api/global`

## 🔧 常见操作

### 创建新的内容类型
1. 进入管理后台 (http://localhost:1337/admin)
2. 导航到 "内容管理器" → "创建新的内容类型"
3. 定义字段并保存
4. 系统会自动生成对应的 API 端点

### 添加新字段到现有内容类型
1. 在 `src/api/{content-type}/content-types/{content-type}/schema.json` 中编辑
2. 重启服务器使更改生效

### 上传文件
- 文件会自动保存到 `public/uploads/` 目录
- 支持图片、文档等多种格式

### 访问管理后台
- 首次访问时需要创建管理员账户
- URL: http://localhost:1337/admin

## 🚀 部署

### 到 Strapi Cloud
```bash
npm run deploy
```

### 自托管部署
1. 构建项目：`npm run build`
2. 启动生产服务：`npm run start`
3. 配置环境变量并确保数据库可访问

## 📚 学习资源

- [Strapi 官方文档](https://docs.strapi.io)
- [Strapi CLI 命令详解](https://docs.strapi.io/dev-docs/cli)
- [Strapi REST API](https://docs.strapi.io/dev-docs/rest-api)
- [部署指南](https://docs.strapi.io/dev-docs/deployment)
- [社区教程](https://strapi.io/tutorials)

## 📄 许可证

This project is private.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
