#!/bin/bash

# 1. 打包前端项目
# npm install
npm run build

# 2. 上传打包产物到服务器
# 请根据实际情况修改服务器地址、用户名和目标目录
SRC_DIR="build/"
DEST_USER="root"
DEST_HOST="8.133.240.77"
DEST_DIR="/opt/csr-admin/"

# 上传（覆盖目标目录）
echo "Uploading files to $DEST_USER@$DEST_HOST:$DEST_DIR ..."
scp -r $SRC_DIR* $DEST_USER@$DEST_HOST:$DEST_DIR

if [ $? -eq 0 ]; then
  echo "部署成功！"
else
  echo "部署失败，请检查日志。"
  exit 1
fi 