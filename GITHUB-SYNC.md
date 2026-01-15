# 同步到 GitHub 操作指南

## 📋 前置准备

### 1. 确保已安装 Git

```bash
git --version
```

如果未安装，请访问：https://git-scm.com/downloads

### 2. 配置 Git 用户信息（如果未配置）

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

---

## 🚀 同步步骤

### 方法一：推送到现有仓库（如果已有 GitHub 仓库）

#### 1. 添加远程仓库

```bash
# 替换为你的 GitHub 仓库地址
git remote add origin https://github.com/你的用户名/GoofishCredentialsBot.git

# 或使用 SSH（推荐）
git remote add origin git@github.com:你的用户名/GoofishCredentialsBot.git
```

#### 2. 推送到 GitHub

```bash
# 首次推送
git push -u origin main

# 如果默认分支是 master
git push -u origin master
```

---

### 方法二：创建新仓库并推送

#### 1. 在 GitHub 上创建新仓库

1. 登录 GitHub
2. 点击右上角「+」→「New repository」
3. 填写仓库信息：
   - **Repository name**: `GoofishCredentialsBot`（或你喜欢的名字）
   - **Description**: `闲鱼卡密机器人 - 自动回复、自动发货、订单管理`
   - **Visibility**: 选择 Public 或 Private
   - **不要**勾选「Initialize this repository with a README」
4. 点击「Create repository」

#### 2. 添加远程仓库并推送

```bash
# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/GoofishCredentialsBot.git

# 查看远程仓库
git remote -v

# 推送到 GitHub
git branch -M main
git push -u origin main
```

---

## 🔐 身份验证

### 使用 HTTPS（需要 Personal Access Token）

1. **生成 Personal Access Token**：
   - 访问：https://github.com/settings/tokens
   - 点击「Generate new token (classic)」
   - 选择权限：至少勾选 `repo`
   - 生成并复制 Token

2. **推送时使用 Token**：
   ```bash
   # 推送时会提示输入用户名和密码
   # 用户名：你的 GitHub 用户名
   # 密码：使用刚才生成的 Token（不是 GitHub 密码）
   git push -u origin main
   ```

### 使用 SSH（推荐）

1. **检查是否已有 SSH 密钥**：
   ```bash
   ls -al ~/.ssh
   ```

2. **如果没有，生成 SSH 密钥**：
   ```bash
   ssh-keygen -t ed25519 -C "你的邮箱"
   # 按回车使用默认路径
   # 可以设置密码或直接回车
   ```

3. **复制公钥**：
   ```bash
   # Windows
   type %USERPROFILE%\.ssh\id_ed25519.pub
   
   # Linux/macOS
   cat ~/.ssh/id_ed25519.pub
   ```

4. **添加到 GitHub**：
   - 访问：https://github.com/settings/keys
   - 点击「New SSH key」
   - Title: 填写描述（如：我的电脑）
   - Key: 粘贴刚才复制的公钥
   - 点击「Add SSH key」

5. **测试连接**：
   ```bash
   ssh -T git@github.com
   ```

6. **使用 SSH 地址添加远程仓库**：
   ```bash
   git remote set-url origin git@github.com:你的用户名/GoofishCredentialsBot.git
   ```

---

## 🔄 后续更新

推送代码后，后续更新代码：

```bash
# 1. 添加修改的文件
git add .

# 2. 提交更改
git commit -m "描述你的更改"

# 3. 推送到 GitHub
git push
```

---

## ❓ 常见问题

### Q1: 推送时提示 "remote: Support for password authentication was removed"

**解决方案**：使用 Personal Access Token 或 SSH 密钥

### Q2: 推送时提示 "Permission denied"

**解决方案**：
- 检查 SSH 密钥是否正确添加到 GitHub
- 或使用 HTTPS + Personal Access Token

### Q3: 推送时提示 "Updates were rejected"

**解决方案**：
```bash
# 先拉取远程更改
git pull origin main --rebase

# 然后再推送
git push
```

### Q4: 如何修改远程仓库地址？

```bash
# 查看当前远程地址
git remote -v

# 修改远程地址
git remote set-url origin 新的仓库地址
```

---

## 📝 当前状态

当前项目已经：
- ✅ 初始化了 Git 仓库
- ✅ 添加了所有文件
- ✅ 创建了初始提交

**下一步**：按照上面的步骤连接到 GitHub 并推送代码。

---

**祝您同步成功！** 🎉
