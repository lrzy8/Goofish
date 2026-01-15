# GoofishCBot 安装说明索引

本项目提供了三种详细的安装部署方式，请根据你的环境选择对应的安装说明：

## 📚 安装文档

### 1. [面板部署安装说明](./docs/安装说明-面板部署.md)
适用于：宝塔面板、1Panel、雨云面板等 Linux 服务器面板

**特点：**
- 详细的步骤说明
- 适合新手用户
- 支持 PM2 进程管理
- 支持反向代理配置

### 2. [Docker 部署安装说明](./docs/安装说明-Docker部署.md)
适用于：任何支持 Docker 的系统（Linux、Windows、macOS）

**特点：**
- 一键部署
- 环境隔离
- 易于维护和更新
- 支持 Docker Compose

### 3. [飞牛 NAS 部署安装说明](./docs/安装说明-飞牛NAS部署.md)
适用于：飞牛 NAS（FnOS）系统

**特点：**
- 图形化操作
- 适合 NAS 用户
- 详细的界面操作说明

---

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 18（推荐 20 LTS）
- **npm**: >= 9
- **内存**: 建议至少 512MB
- **磁盘**: 建议至少 500MB

### 快速安装（开发环境）

```bash
# 1. 克隆项目
git clone https://github.com/haiyewei/GoofishCredentialsBot.git
cd GoofishCredentialsBot

# 2. 安装依赖
npm install
cd frontend && npm install && cd ..

# 3. 启动开发服务器
npm run dev
```

访问 `http://localhost:3000` 即可使用。

---

## 📖 详细文档

请查看对应的安装说明文档获取详细的部署步骤：

- [面板部署](./docs/安装说明-面板部署.md)
- [Docker 部署](./docs/安装说明-Docker部署.md)
- [飞牛 NAS 部署](./docs/安装说明-飞牛NAS部署.md)

---

## ❓ 常见问题

### Q: 我应该选择哪种部署方式？

- **面板部署**：如果你有 Linux 服务器并使用面板管理，推荐使用面板部署
- **Docker 部署**：如果你熟悉 Docker，推荐使用 Docker 部署，更简单易维护
- **飞牛 NAS**：如果你使用飞牛 NAS，推荐使用飞牛 NAS 部署说明

### Q: 部署后无法访问？

1. 检查防火墙是否开放了 3000 端口
2. 检查服务是否正常启动
3. 查看日志文件排查错误

### Q: 如何更新项目？

请参考对应安装说明文档中的「更新项目」章节。

---

## 📞 获取帮助

- 查看项目 GitHub Issues
- 阅读详细的安装说明文档
- 检查日志文件

---

**祝您使用愉快！** 🎉
