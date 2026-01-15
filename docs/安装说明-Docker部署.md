# GoofishCBot Docker 部署安装说明

本文档详细说明如何使用 Docker 和 Docker Compose 部署 GoofishCBot。

## 📋 前置要求

### 系统要求
- **操作系统**：Linux（Ubuntu 20.04+ / Debian 11+ / CentOS 8+）或 Windows Server / macOS
- **Docker**：版本 >= 20.10
- **Docker Compose**：版本 >= 2.0（或 docker-compose >= 1.29）
- **内存**：建议至少 1GB 可用内存
- **磁盘空间**：建议至少 2GB 可用空间

### 检查 Docker 是否已安装

```bash
# 检查 Docker 版本
docker --version

# 检查 Docker Compose 版本
docker compose version
# 或
docker-compose --version
```

如果未安装，请参考「安装 Docker」章节。

---

## 🐳 安装 Docker

### Ubuntu/Debian 系统

```bash
# 更新软件包索引
sudo apt-get update

# 安装必要的依赖
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# 添加 Docker 官方 GPG 密钥
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 设置 Docker 仓库
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装 Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 启动 Docker 服务
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
sudo docker run hello-world
```

### CentOS/RHEL 系统

```bash
# 安装必要的工具
sudo yum install -y yum-utils

# 添加 Docker 仓库
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 安装 Docker Engine
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 启动 Docker 服务
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
sudo docker run hello-world
```

### Windows 系统

1. 下载 Docker Desktop for Windows：
   - 访问：https://www.docker.com/products/docker-desktop
   - 下载并安装 Docker Desktop
   - 安装完成后重启电脑
   - 启动 Docker Desktop

2. 验证安装：
   ```powershell
   docker --version
   docker compose version
   ```

### macOS 系统

1. 下载 Docker Desktop for Mac：
   - 访问：https://www.docker.com/products/docker-desktop
   - 下载对应芯片版本（Intel 或 Apple Silicon）
   - 安装并启动 Docker Desktop

2. 验证安装：
   ```bash
   docker --version
   docker compose version
   ```

---

## 🚀 部署步骤

### 第一步：准备项目文件

#### 1.1 创建项目目录

```bash
# 创建目录
mkdir -p ~/goofishcbot
cd ~/goofishcbot
```

#### 1.2 获取项目文件

**方法一：使用 Git 克隆**
```bash
git clone https://github.com/haiyewei/GoofishCredentialsBot.git .
```

**方法二：手动上传**
1. 将项目文件压缩为 ZIP
2. 上传到服务器
3. 解压到 `~/goofishcbot` 目录

**确保以下文件存在：**
- `Dockerfile`
- `docker-compose.yml`
- `package.json`
- `src/` 目录
- `frontend/` 目录

---

### 第二步：配置 Docker Compose

#### 2.1 检查 docker-compose.yml

确保 `docker-compose.yml` 文件存在且配置正确：

```yaml
version: '3.8'

services:
  goofishcbot:
    build: .
    container_name: goofishcbot
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
    environment:
      - NODE_ENV=production
      - PORT=3000
    networks:
      - goofishcbot-network

networks:
  goofishcbot-network:
    driver: bridge
```

#### 2.2 检查 Dockerfile

确保 `Dockerfile` 文件存在（项目根目录应已包含）。

---

### 第三步：构建和启动容器

#### 3.1 构建镜像

```bash
# 在项目根目录执行
cd ~/goofishcbot

# 构建 Docker 镜像（首次构建可能需要 5-10 分钟）
docker compose build

# 或使用旧版 docker-compose
docker-compose build
```

**构建过程说明：**
- 会下载 Node.js 基础镜像
- 安装项目依赖
- 构建前端代码
- 编译 TypeScript 代码

#### 3.2 启动容器

```bash
# 启动服务（后台运行）
docker compose up -d

# 或使用旧版
docker-compose up -d
```

**启动成功后，会看到类似输出：**
```
[+] Running 2/2
 ✔ Network goofishcbot_goofishcbot-network    Created
 ✔ Container goofishcbot                       Started
```

#### 3.3 查看容器状态

```bash
# 查看运行状态
docker compose ps

# 查看日志
docker compose logs -f

# 查看最近 100 行日志
docker compose logs --tail=100
```

---

### 第四步：验证部署

#### 4.1 检查容器是否运行

```bash
docker compose ps
```

应看到 `goofishcbot` 容器状态为 `Up`。

#### 4.2 检查端口是否监听

```bash
# Linux/macOS
netstat -tulpn | grep 3000
# 或
ss -tulpn | grep 3000

# Windows PowerShell
netstat -ano | findstr :3000
```

#### 4.3 访问管理界面

在浏览器中访问：
```
http://你的服务器IP:3000
```

如果能看到管理界面，说明部署成功！

---

## 🔧 常用操作

### 查看日志

```bash
# 实时查看日志
docker compose logs -f

# 查看最近 100 行
docker compose logs --tail=100

# 查看特定服务的日志
docker compose logs goofishcbot
```

### 停止服务

```bash
# 停止容器
docker compose stop

# 停止并删除容器
docker compose down
```

### 重启服务

```bash
# 重启容器
docker compose restart

# 重新构建并启动
docker compose up -d --build
```

### 进入容器

```bash
# 进入容器内部
docker compose exec goofishcbot sh

# 或使用 bash（如果支持）
docker compose exec goofishcbot bash
```

### 更新项目

```bash
# 1. 停止当前容器
docker compose down

# 2. 备份数据（重要！）
cp -r data data.backup
cp -r logs logs.backup

# 3. 更新代码（如果使用 Git）
git pull

# 4. 重新构建镜像
docker compose build --no-cache

# 5. 启动新容器
docker compose up -d

# 6. 查看日志确认启动成功
docker compose logs -f
```

---

## 📁 数据持久化

### 数据目录说明

项目使用 Docker Volume 挂载以下目录：

- `./data` → `/app/data`：SQLite 数据库文件
- `./logs` → `/app/logs`：应用日志文件

### 备份数据

```bash
# 备份数据库
cp data/goofishcbot.db data/goofishcbot.db.backup

# 备份整个数据目录
tar -czf goofishcbot-data-backup-$(date +%Y%m%d).tar.gz data/

# 备份日志
tar -czf goofishcbot-logs-backup-$(date +%Y%m%d).tar.gz logs/
```

### 恢复数据

```bash
# 停止容器
docker compose down

# 恢复数据库
cp data/goofishcbot.db.backup data/goofishcbot.db

# 启动容器
docker compose up -d
```

---

## 🔒 安全配置

### 修改默认端口

编辑 `docker-compose.yml`：

```yaml
ports:
  - "8080:3000"  # 将外部端口改为 8080
```

然后重启：
```bash
docker compose down
docker compose up -d
```

### 配置防火墙

```bash
# Ubuntu/Debian (ufw)
sudo ufw allow 3000/tcp
sudo ufw reload

# CentOS (firewalld)
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

### 使用反向代理（推荐）

#### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name bot.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🐛 常见问题

### Q1: 构建镜像失败

**错误信息：** `npm install` 失败

**解决方案：**
```bash
# 检查网络连接
ping registry.npmjs.org

# 使用国内镜像（修改 Dockerfile）
# 在 Dockerfile 中添加：
RUN npm config set registry https://registry.npmmirror.com
```

### Q2: 容器启动后立即退出

**解决方案：**
```bash
# 查看容器日志
docker compose logs

# 检查端口是否被占用
docker compose ps
netstat -tulpn | grep 3000

# 检查数据目录权限
ls -la data/ logs/
chmod 755 data logs
```

### Q3: 无法访问管理界面

**解决方案：**
```bash
# 检查容器是否运行
docker compose ps

# 检查端口映射
docker compose port goofishcbot 3000

# 检查防火墙
sudo ufw status
# 或
sudo firewall-cmd --list-ports
```

### Q4: 数据库文件权限问题

**解决方案：**
```bash
# 修改数据目录权限
sudo chown -R 1000:1000 data/
sudo chmod -R 755 data/
```

### Q5: 内存不足

**解决方案：**
```bash
# 查看容器资源使用
docker stats

# 限制容器内存（修改 docker-compose.yml）
services:
  goofishcbot:
    mem_limit: 512m
    mem_reservation: 256m
```

---

## 📊 监控和维护

### 查看资源使用

```bash
# 实时监控容器资源
docker stats goofishcbot

# 查看容器详细信息
docker inspect goofishcbot
```

### 清理未使用的资源

```bash
# 清理未使用的镜像
docker image prune -a

# 清理未使用的容器
docker container prune

# 清理所有未使用的资源
docker system prune -a
```

### 设置自动重启

`docker-compose.yml` 中已配置 `restart: unless-stopped`，容器会在系统重启后自动启动。

---

## ✅ 验证清单

部署完成后，请验证：

- [ ] Docker 和 Docker Compose 已正确安装
- [ ] 容器成功构建并启动
- [ ] 可以通过 `http://IP:3000` 访问管理界面
- [ ] 数据目录 `data/` 和 `logs/` 已正确挂载
- [ ] 日志文件正常生成
- [ ] 可以正常添加账号和使用功能

---

## 📞 获取帮助

如果遇到问题：

1. 查看容器日志：`docker compose logs -f`
2. 检查本文档的「常见问题」部分
3. 访问项目 GitHub Issues 页面
4. 检查 Docker 和系统日志

---

**祝您使用愉快！** 🎉
