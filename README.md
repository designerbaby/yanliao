# 盐料视频 - 百万调音合成工具

## 准备工作
```
npm install
```

### 启动
```
npm run serve
```

### 编译
```
npm run build
```

### 参考文档
See [Configuration Reference](https://cli.vuejs.org/config/).

### 需求文档：
  - Web端创作工具
  - web1.0：制作主流程 https://docs.qq.com/doc/DVVZ6d0RNVGFJZWtp
  - Web1.1：账号体系（包括登录和作品列表）https://docs.qq.com/doc/DVWdhdW12THlSbXdO 该文档里面仅账号体系和作品列表相关的可以参考，其他的需求在后面都有变动，需参考后面的相关文档
  - Web1.2：草稿箱 https://docs.qq.com/doc/DVW9veVRqUENvR053
  - web1.3：视频发布及账号绑定 https://docs.qq.com/doc/DVWNrQVVYbVNIdE1V
  - web1.4: 编辑器：https://docs.qq.com/doc/DVWVNTHpWanZWT0Rw
  - 编辑器3-4月份规划出版：https://docs.qq.com/doc/DVWFMRHJIUUlLc3Z3
  - 。。。等等

## 辅助文档
  - 自定义音源制作说明：https://docs.qq.com/doc/DVU5YY0R5eWt3c3Bs
  - 拼音音素对照表：https://docs.qq.com/doc/DVU9rVXNsUWl4R0dR
  - 音名音高对照表：https://docs.qq.com/sheet/DVXNTS2VjanZ1cmJm?tab=BB08J2

### 接口文档：
  后台接口文档：
  - 后台统一接口文档：http://git.tmeoa.com/simonygzhao/RESTfulAPI
  分类如下：
    - 短视频：http://git.tmeoa.com/simonygzhao/RESTfulAPI/blob/master/video.md
    - 草稿箱： http://git.tmeoa.com/simonygzhao/RESTfulAPI/blob/master/audio_draft.md
    - 登录：http://git.tmeoa.com/simonygzhao/RESTfulAPI/blob/master/auth.md
    - 主流程：http://git.tmeoa.com/simonygzhao/RESTfulAPI/blob/master/kuwa.md
    - 绑定酷狗账号：https://git.code.tencent.com/musicx_backend/mundo_proto/blob/master/musicx_yan/yan_kugou_bus/musicx_yan_kugou_bus.proto
    - 编辑器：https://git.code.tencent.com/musicx_backend/mundo_proto/blob/master/musicx_kuwa/kuwa_music_synth/musicx_kuwa_music_synth.proto
    - 获取音高线：https://git.code.tencent.com/musicx_backend/mundo_proto/blob/master/musicx_yan/yan_sdk_client/musicx_yan_sdk_client.proto
    - 自定义音源：https://git.code.tencent.com/musicx_backend/mundo_proto/blob/master/musicx_yan/yan_audio_src/musicx_yan_audio_src.proto

### 数据上报地址：
- https://growth.tencent.com/kh37dyui2j/data_management/Source_Event/4889/user_event

## 难点
- 1、用svg画音高线的时候出现锯齿
- 2、整体数据规划
- 3、播放进度不流畅,播放的时候只有音频怎么把线的位置和音频的声音结合在一起
- 4、播放的状态机
- 5、播放线移动的位置
- 6、组件的规划
- 7、用画音高线，几万个数据怎么处理优化
- 8、批量的操作，如何做到和操作文件夹一致
- 9、所有快捷键的操作规划
- 10、ctrl+z和ctrl+y快捷键操作整理

## 乐理
- 分母：一个拍由哪种音符构成
- 分子：一个小节有多少拍
- 1/4音符是由8个32分音符组成的，是音符的一种，1/4拍是一种节拍类型，代表一个4分音符为1拍，1小节有1拍

## 声音地址
- mp4: https://musicx-1253428821.file.myqcloud.com/files/harpsichord-c4.mp4
- wav: https://musicx-1253428821.file.myqcloud.com/files/harpsichord-c4.wav
- webm: https://musicx-1253428821.file.myqcloud.com/files/harpsichord-c4.webm
- url: `https://musicx-1253428821.file.myqcloud.com/files/harpsichord-c4.${extension}`


- m4a: https://musicx-1253428821.file.myqcloud.com/files/C4.m4a
- mp3: https://musicx-1253428821.file.myqcloud.com/files/C4.mp3
- wav: https://musicx-1253428821.file.myqcloud.com/files/C4.wav
- webm: https://musicx-1253428821.file.myqcloud.com/files/C4.webm

### 代码提交规范

遵循 https://www.conventionalcommits.org/zh/v1.0.0-beta.3/
```
feat: 新功能（feature）
fix: 修补bug
docs: 文档（documentation）
style: 格式（不影响代码运行的变动）
refactor: 重构（即不是新增功能，也不是修改bug的代码变动）
test: 增加测试
chore: 构建过程或辅助工具的变动

（注意：冒号为英文半角冒号，后带空格，再接信息）
```
