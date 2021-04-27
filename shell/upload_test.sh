#! /bin/bash

if [ ! -f "./dist" ];then
  echo "文件不存在"
else
  rm -f ./dist
fi
unzip -d ./dist dist.zip

ips=(10.130.64.176)

for ip in ${ips[*]}
do
    scp -r dist/* ${ip}:/data/services/yan.qq.com/
    echo "=================== upload web files to ${ip} ==================="
    sleep 3
done

rm dist.zip
rm -r ./dist