# 服务器部署指南

## 环境要求
1. 系统：建议使用 Ubuntu 22.04+/CentOS 9+/macOS 14+，保持稳定的网络与防火墙设置。
2. Node.js：本项目基于 Node 20+，请使用 `nvm` 或系统包管理器安装并设置为默认版本（`node -v` 输出 `v20.x`）。
3. npm：Node 安装后附带，建议为最新版本（`npm -v`）。
4. 数据库：根据 `.env` 配置选择 SQLite（仅开发）、MySQL、PostgreSQL、Neon 等，需在服务器上提前部署好数据库实例。
5. Git：必须能 `clone` 本仓库。

## 部署步骤
1. **克隆代码仓库**（例如放在 `/var/www/sha-strapi`）：
   ```bash
   git clone https://github.com/vincent-sha/sha-strapi.git /var/www/sha-strapi
   cd /var/www/sha-strapi
   git checkout main
   git pull
   ```
2. **安装依赖并构建**：
   ```bash
   npm install
   npm run build
   ```
3. **配置 `.env` 环境变量**：
   - 复制 `.env.example` 或新建 `.env`，设置 `DATABASE_CLIENT`、连接字符串、`DATABASE_USERNAME`、`DATABASE_PASSWORD` 等。
   - 设置 Strapi 所需密钥：`APP_KEYS`（至少两段）、`API_TOKEN_SALT`、`ADMIN_JWT_SECRET`、`STRAPI_JWT_SECRET`、`TRANSFER_TOKEN_SALT`。
   - 由 `scripts/generate-keys.js` 生成可信随机值：
     ```bash
     node scripts/generate-keys.js
     ```
     将输出粘贴到 `.env`。
   - 若使用数据库 URL，确保 `DATABASE_URL` 中包含用户名与密码；若启用 SSL，依据 `docs/database-guide.md` 配置证书变量。
4. **数据库准备**：
   - 如首次运行，Strapi 会自动在 `./database` 下创建表。若需要运行迁移脚本可以使用 `npx prisma migrate deploy`（本项目未集成 Prisma，仅 Strapi ORM）。
   - 若从旧库迁移数据，使用 Strapi Transfer 插件或导出/导入功能，确保 `TRANSFER_TOKEN_SALT` 与目标一致。
5. **运行服务**：
   - 开发环境：`npm run develop`
   - 生产环境：可结合 `pm2`、`systemd` 等守护进程启动 `npm run start`。
     示例（pm2）：
     ```bash
     pm2 start npm --name sha-strapi -- run start
     pm2 save
     ```
6. **配置反向代理（可选）**：
   - 推荐在 Nginx 中添加 `server` 监听 80/443，反向代理到 Strapi（默认 1337）：
     ```nginx
     server {
       listen 80;
       server_name api.example.com;
       location / {
         proxy_pass http://127.0.0.1:1337;
         proxy_http_version 1.1;
         proxy_set_header Upgrade $http_upgrade;
         proxy_set_header Connection keep-alive;
         proxy_set_header Host $host;
         proxy_cache_bypass $http_upgrade;
       }
     }
     ```
   - 若部署 HTTPS，建议使用 `certbot` 获取证书并在 Nginx 中启用。
7. **定期更新与日志**：
   - 进入项目目录，`git pull` 更新代码，`npm install`/`npm run build`。
   - 查看日志：`pm2 logs sha-strapi` 或 `npm run develop` 输出。
   - 备份 `.env`、数据库文件、`public/uploads`，并对 `uploads` 目录设置合适权限。

## 运行检查
- 访问 `http://server:1337` 或代理域名，确认 Strapi Admin 可登录。
- 访问 `/api/about` 等接口确认数据可读写。
- 查看 `strapi.log` 或 `pm2 logs`，确认没有报错。

## 安全建议
1. 禁用 SQLite 生产环境；请选择 MySQL/PostgreSQL/Neon 并配置强密码。
2. `.env` 等包含密钥的文件不应提交 git，生产服务器禁止外部访问。
3. 通过防火墙仅开启必要端口（如 22、80、443），Strapi 仅对反向代理开放。
4. 及时更新依赖、Node 版本；必要时启用火焰图或 APM 监控。