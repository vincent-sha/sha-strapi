# 数据库配置与切换指南

适用版本：Strapi 5.31.3，Node 20+。默认数据库为 SQLite，如需切换到 MySQL 或 PostgreSQL 按下列步骤操作。

## 目录
- 快速启用与切换
- 各数据库环境变量
- SSL 与连接池
- 常见问题

## 快速启用与切换
1) 在项目根目录创建/修改 `.env`。
2) 选择数据库类型并设置环境变量 `DATABASE_CLIENT`：`sqlite` (默认) / `mysql` / `postgres`。
3) 填写对应的连接参数（见下文）。
4) 首次或切库后建议重新安装依赖并重建后台：
   ```bash
   npm install
   npm run build   # 重新构建后台
   npm run develop # 或 npm run start
   ```
5) 若从 SQLite 切换到 MySQL/PostgreSQL，确保目标库已创建且可连通；如需迁移已有数据，可用 Strapi Transfer/导出导入，或自行迁移。

## `.env` 中的认证与密钥
Strapi 运行依赖两类凭据：数据库连接账号/密码（前面介绍通过 `DATABASE_*` 变量配置）和 Strapi 自身的密钥。后者用于加密 cookie、签发 JWT、保护 API Token，必须在生产环境固定，避免每次重启时重新生成。

```env
APP_KEYS=<key1>,<key2>          # 保证至少两段且长度 32+，逗号分隔
API_TOKEN_SALT=<random hex>     # 用于 API Token，推荐 32 字节十六进制
ADMIN_JWT_SECRET=<random hex>   # Strapi 管理界面 JWT 的签名密钥
STRAPI_JWT_SECRET=<random hex>  # 公共 API 的 JWT 秘钥
TRANSFER_TOKEN_SALT=<random hex> # Strapi Transfer 插件或导出/导入时签发共享令牌
```

除了以上，MySQL/PostgreSQL 还需 `DATABASE_USERNAME`/`DATABASE_PASSWORD` 提供数据库认证信息，确保账号具备建库写入权限。

### 自动生成随机密钥
直接使用 Node 提供的 `crypto` 模块可以快速生成可信随机串：

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

执行四次（或更多）填入对应 `.env` 变量，并将 `APP_KEYS` 设为至少两段，用逗号隔开。如需批量生成，可放入脚本：

```js
// scripts/generate-keys.js
import { randomBytes } from 'node:crypto';
const hex = () => randomBytes(32).toString('hex');
console.log('APP_KEYS=' + [hex(), hex()].join(','));
console.log('API_TOKEN_SALT=' + hex());
console.log('ADMIN_JWT_SECRET=' + hex());
console.log('STRAPI_JWT_SECRET=' + hex());
console.log('TRANSFER_TOKEN_SALT=' + hex());
```

`node scripts/generate-keys.js` 会输出四组密钥，复制粘贴即可；该脚本无需提交仓库，加入 `.gitignore` 或在 CI 中常规生成也可以。

## 环境变量速查
`config/database.ts` 支持三类配置，均通过环境变量注入。

### SQLite（默认，开箱即用）
```env
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db   # 可自定义路径
```
- 数据文件存放在项目目录下，适合开发/小规模测试。

### MySQL
```env
DATABASE_CLIENT=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
DATABASE_SSL=false                # 生产按需开启
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
DATABASE_CONNECTION_TIMEOUT=60000
```
- 开启 SSL 时附加：`DATABASE_SSL_KEY` `DATABASE_SSL_CERT` `DATABASE_SSL_CA` `DATABASE_SSL_CAPATH` `DATABASE_SSL_CIPHER` `DATABASE_SSL_REJECT_UNAUTHORIZED`。

### PostgreSQL
```env
DATABASE_CLIENT=postgres
# 可二选一：完整 URL 或分项配置
DATABASE_URL=postgresql://user:pass@localhost:5432/strapi
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
DATABASE_SCHEMA=public
DATABASE_SSL=false
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
DATABASE_CONNECTION_TIMEOUT=60000
```
- 若使用 `DATABASE_URL`，其余分项为后备默认值。
- SSL 变量同上。

### Neon（Serverless Postgres）特定说明

如果你在 Neon 上创建了数据库（例如：数据库名称为 `sha-databaes`），推荐做法：

- 使用 Neon 仪表盘提供的完整连接字符串放在 `DATABASE_URL`（包含用户名与密码），通常形如：
   `postgresql://<USER>:<PASSWORD>@<HOST>:5432/sha-databaes?sslmode=require`

- Neon 是 serverless Postgres，连接数有限制 — 请调低连接池，或使用 Neon 推荐的连接池方式（例如 pgBouncer 或 Neon 自带的 connection pooling）：
   ```env
   DATABASE_POOL_MIN=0
   DATABASE_POOL_MAX=5
   ```

- SSL 推荐开启（`DATABASE_SSL=true`）。如果 Neon 提供的证书无法通过默认校验，可选择 `DATABASE_SSL_REJECT_UNAUTHORIZED=false`（不推荐在生产中使用）。

- 完整示例（替换尖括号处）：
   ```env
   DATABASE_CLIENT=postgres
   DATABASE_URL=postgresql://<USERNAME>:<PASSWORD>@<HOST>:5432/sha-databaes?sslmode=require
   DATABASE_SCHEMA=public
   DATABASE_SSL=true
   DATABASE_SSL_REJECT_UNAUTHORIZED=false
   DATABASE_POOL_MIN=0
   DATABASE_POOL_MAX=5
   DATABASE_CONNECTION_TIMEOUT=60000
   ```

注意：Neon 建议在高并发环境下使用连接池（pgBouncer）或选择 Neon 提供的 “connection pool” 设置来避免连接溢出问题。

## SSL 与连接池
- `DATABASE_SSL=true` 时会尝试读取证书相关变量，未提供则使用 Node 默认信任链。
- 连接池：`DATABASE_POOL_MIN` / `DATABASE_POOL_MAX` 控制并发连接数；生产可按实例规格调整。
- `DATABASE_CONNECTION_TIMEOUT`（ms）控制获取连接的最长等待时间，默认 60000。

## 常见问题
- **切换数据库后数据为空？** 新库不会自动携带旧数据，需导入迁移。
- **连接被拒绝/超时？** 检查主机、端口、防火墙、白名单、SSL 配置及账号权限。
- **密码或证书含特殊字符？** 建议使用 `DATABASE_URL` 并对特殊字符 URL 编码，或通过分项变量传递。
- **多环境配置**：在不同环境准备对应 `.env` 或使用部署平台的环境变量管理。
