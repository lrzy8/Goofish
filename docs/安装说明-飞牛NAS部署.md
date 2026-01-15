# GoofishCBot 飞牛 NAS 部署安装说明

本文档详细说明如何在飞牛 NAS（FnOS）上使用 Docker Compose 部署 GoofishCBot。

## 📋 前置要求

### 系统要求
- **飞牛 NAS**：已安装 FnOS 系统
- **Docker**：飞牛 NAS 已启用 Docker 服务
- **内存**：建议至少 2GB 可用内存
- **磁盘空间**：建议至少 2GB 可用空间

### 检查 Docker 是否可用

1. 登录飞牛 NAS 管理界面
2. 进入「应用中心」或「容器管理」
3. 确认 Docker 服务已启用

---

## 🚀 部署步骤

### 第一步：准备项目文件

#### 1.1 创建项目目录

**方法一：通过文件管理器**
1. 登录飞牛 NAS 管理界面
2. 进入「文件管理」
3. 导航到数据盘目录（如：`/volume1/docker/`）
4. 创建新文件夹，命名为 `goofishcbot`

**方法二：通过 SSH（如果已启用）**
```bash
ssh admin@你的NAS_IP
mkdir -p /volume1/docker/goofishcbot
cd /volume1/docker/goofishcbot
```

#### 1.2 上传项目文件

**方法一：通过文件管理器上传**
1. 在本地电脑将项目文件夹压缩为 ZIP 文件
2. 在飞牛 NAS 文件管理器中，进入 `goofishcbot` 目录
3. 点击「上传」按钮，选择 ZIP 文件
4. 上传完成后，右键点击 ZIP 文件，选择「解压」
5. 确保解压后的文件包含以下内容：
   - `Dockerfile`
   - `docker-compose.yml`
   - `package.json`
   - `src/` 目录
   - `frontend/` 目录

**方法二：通过 Git（如果 NAS 支持）**
```bash
# 通过 SSH 连接
cd /volume1/docker/goofishcbot
git clone https://github.com/haiyewei/GoofishCredentialsBot.git .
```

---

### 第二步：配置 Docker Compose

#### 2.1 检查 docker-compose.yml 文件

确保 `docker-compose.yml` 文件存在且内容正确：

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

**注意**：如果飞牛 NAS 的 Docker 不支持 `build`，需要先手动构建镜像（见下方说明）。

---

### 第三步：使用飞牛 NAS 容器管理部署

#### 3.1 进入容器管理

1. 登录飞牛 NAS 管理界面
2. 进入「应用中心」或「容器管理」
3. 找到「Docker Compose」或「容器编排」功能

#### 3.2 创建 Compose 项目

**方法一：使用 Compose 功能（推荐）**

1. 点击「创建项目」或「新建 Compose」
2. 项目名称：`goofishcbot`
3. 项目路径：选择 `/volume1/docker/goofishcbot`
4. 配置文件：选择 `docker-compose.yml`
5. 点击「创建」或「部署」

**方法二：手动创建容器**

如果飞牛 NAS 不支持 Compose，可以手动创建：

1. 进入「容器管理」→「创建容器」
2. 选择「自定义镜像」或「从 Dockerfile 构建」
3. 配置如下：
   - **容器名称**：`goofishcbot`
   - **镜像**：需要先构建（见下方）
   - **端口映射**：`3000:3000`
   - **数据卷**：
     - `/volume1/docker/goofishcbot/data` → `/app/data`
     - `/volume1/docker/goofishcbot/logs` → `/app/logs`
   - **环境变量**：
     - `NODE_ENV=production`
     - `PORT=3000`
   - **重启策略**：`总是重启`

---

### 第四步：构建镜像（如果需要）

如果飞牛 NAS 不支持自动构建，需要手动构建镜像：

#### 4.1 通过 SSH 构建（推荐）

```bash
# SSH 连接到 NAS
ssh admin@你的NAS_IP

# 进入项目目录
cd /volume1/docker/goofishcbot

# 构建镜像
docker build -t goofishcbot:latest .

# 等待构建完成（可能需要 5-10 分钟）
```

#### 4.2 通过 Docker Desktop 构建后导入

1. 在本地电脑构建镜像：
   ```bash
   docker build -t goofishcbot:latest .
   docker save goofishcbot:latest -o goofishcbot.tar
   ```

2. 将 `goofishcbot.tar` 上传到 NAS

3. 在 NAS 上导入：
   ```bash
   docker load -i goofishcbot.tar
   ```

---

### 第五步：启动容器

#### 5.1 使用 Compose 启动

1. 在 Compose 项目管理界面
2. 找到 `goofishcbot` 项目
3. 点击「启动」或「部署」按钮

#### 5.2 手动启动容器

1. 进入「容器管理」
2. 找到 `goofishcbot` 容器
3. 点击「启动」

#### 5.3 验证启动状态

1. 在容器列表中，查看 `goofishcbot` 状态
2. 状态应显示为「运行中」或「Up」
3. 点击容器名称，查看「日志」标签，确认没有错误

---

### 第六步：配置网络访问

#### 6.1 检查端口映射

1. 在容器详情中，确认端口映射为 `3000:3000`
2. 如果端口被占用，可以修改为其他端口（如 `8080:3000`）

#### 6.2 配置防火墙（如果需要）

1. 进入飞牛 NAS「系统设置」→「网络」→「防火墙」
2. 添加规则，允许端口 3000（或你设置的端口）
3. 保存设置

#### 6.3 访问管理界面

在浏览器中访问：
```
http://你的NAS_IP:3000
```

如果能看到管理界面，说明部署成功！

---

## 🔧 常用操作

### 查看日志

1. 进入「容器管理」
2. 找到 `goofishcbot` 容器
3. 点击容器名称
4. 进入「日志」标签
5. 可以实时查看日志输出

### 停止/启动容器

1. 在容器列表中，找到 `goofishcbot`
2. 点击「停止」按钮停止容器
3. 点击「启动」按钮启动容器
4. 点击「重启」按钮重启容器

### 更新项目

1. **停止容器**
   - 在容器管理中停止 `goofishcbot` 容器

2. **备份数据**
   - 进入文件管理器
   - 备份 `data/goofishcbot.db` 文件
   - 备份整个 `data/` 和 `logs/` 目录

3. **更新代码**
   - 上传新的项目文件（覆盖旧文件）
   - 或通过 Git 拉取最新代码

4. **重新构建（如果需要）**
   - 如果修改了 Dockerfile，需要重新构建镜像

5. **启动容器**
   - 重新启动容器

---

## 📁 数据管理

### 数据目录位置

项目数据存储在：
- **数据库**：`/volume1/docker/goofishcbot/data/goofishcbot.db`
- **日志**：`/volume1/docker/goofishcbot/logs/`

### 备份数据

**通过文件管理器：**
1. 进入文件管理器
2. 导航到 `/volume1/docker/goofishcbot/data/`
3. 复制 `goofishcbot.db` 文件到备份位置

**通过 SSH：**
```bash
# 备份数据库
cp /volume1/docker/goofishcbot/data/goofishcbot.db /volume1/backup/goofishcbot-$(date +%Y%m%d).db

# 备份整个数据目录
tar -czf /volume1/backup/goofishcbot-data-$(date +%Y%m%d).tar.gz /volume1/docker/goofishcbot/data/
```

### 恢复数据

1. 停止容器
2. 将备份的数据库文件复制回 `data/` 目录
3. 确保文件权限正确
4. 启动容器

---

## 🔒 安全配置

### 修改访问端口

如果不想使用默认的 3000 端口：

1. 编辑 `docker-compose.yml`：
   ```yaml
   ports:
     - "8080:3000"  # 改为 8080
   ```

2. 重新部署容器

3. 访问：`http://你的NAS_IP:8080`

### 使用域名访问（推荐）

1. **配置反向代理**
   - 如果飞牛 NAS 支持 Nginx 或反向代理功能
   - 配置域名指向 `http://127.0.0.1:3000`

2. **配置 SSL 证书**
   - 使用 Let's Encrypt 免费证书
   - 启用 HTTPS

---

## 🐛 常见问题

### Q1: 容器启动失败

**解决方案：**
1. 查看容器日志，找到错误信息
2. 检查端口是否被占用
3. 检查数据目录权限
4. 确认 Dockerfile 和 docker-compose.yml 配置正确

### Q2: 无法访问管理界面

**解决方案：**
1. 检查容器是否正在运行
2. 检查端口映射是否正确
3. 检查防火墙设置
4. 尝试使用 NAS 的 IP 地址访问

### Q3: 数据库权限错误

**解决方案：**
1. 通过文件管理器，右键点击 `data/` 目录
2. 选择「属性」→「权限」
3. 确保有读写权限
4. 或通过 SSH 执行：
   ```bash
   chmod 755 /volume1/docker/goofishcbot/data
   chmod 755 /volume1/docker/goofishcbot/logs
   ```

### Q4: 内存不足

**解决方案：**
1. 检查 NAS 内存使用情况
2. 关闭其他不必要的应用
3. 考虑升级 NAS 内存

### Q5: 构建镜像失败

**解决方案：**
1. 检查网络连接
2. 使用国内镜像源（修改 Dockerfile）
3. 通过 SSH 手动构建，查看详细错误信息

---

## 📊 监控和维护

### 查看资源使用

1. 进入「容器管理」
2. 查看容器列表中的资源使用情况
3. 或进入容器详情，查看「资源」标签

### 设置自动启动

1. 在容器详情中
2. 找到「重启策略」设置
3. 选择「总是重启」或「除非停止」

---

## ✅ 验证清单

部署完成后，请验证：

- [ ] Docker 服务已启用
- [ ] 容器成功创建并启动
- [ ] 可以通过 `http://NAS_IP:3000` 访问管理界面
- [ ] 数据目录已正确挂载
- [ ] 日志文件正常生成
- [ ] 可以正常添加账号和使用功能

---

## 📞 获取帮助

如果遇到问题：

1. 查看容器日志
2. 检查本文档的「常见问题」部分
3. 访问项目 GitHub Issues 页面
4. 联系飞牛 NAS 技术支持（如果是 NAS 相关问题）

---

## 💡 提示

- **定期备份**：建议定期备份 `data/goofishcbot.db` 数据库文件
- **监控日志**：定期查看日志，及时发现问题
- **更新维护**：定期更新项目代码，获取最新功能和修复
- **资源监控**：注意 NAS 的 CPU 和内存使用情况

---

**祝您使用愉快！** 🎉
