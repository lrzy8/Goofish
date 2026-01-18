#!/bin/bash
# 飞牛NAS部署脚本

echo "开始部署 GoofishCredentialsBot 到飞牛NAS..."

# 更新代码
echo "拉取最新代码..."
git pull origin master

# 清理旧容器和镜像
echo "清理旧容器和镜像..."
docker stop goofishcbot 2>/dev/null || true
docker rm goofishcbot 2>/dev/null || true
docker rmi goofishcbot:latest 2>/dev/null || true

# 构建新镜像（使用生产优化版 Dockerfile）
echo "构建新镜像..."
docker build --no-cache -f Dockerfile.prod -t goofishcbot:latest .

# 检查构建是否成功
if [ $? -eq 0 ]; then
    echo "镜像构建成功，启动容器..."
    
    # 创建数据目录（如果不存在）
    mkdir -p ./data
    mkdir -p ./logs
    
    # 运行容器
    docker run -d \
      --name goofishcbot \
      -p 3000:3000 \
      -v $(pwd)/data:/app/data \
      -v $(pwd)/logs:/app/logs \
      --restart unless-stopped \
      goofishcbot:latest
    
    if [ $? -eq 0 ]; then
        echo "容器启动成功！"
        echo "访问地址: http://$(hostname -I | awk '{print $1}'):3000"
        echo "系统日志可通过 'docker logs goofishcbot' 查看"
    else
        echo "容器启动失败，请检查错误信息"
        exit 1
    fi
else
    echo "镜像构建失败，请检查错误信息"
    exit 1
fi

echo "部署完成！"