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
  - web1.5: 自定义音源制作说明：https://docs.qq.com/doc/DVU5YY0R5eWt3c3Bs
  - 。。。等等

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

### TODO

- 1、要把doPlay的判断改成状态机
- 2、配置gitlab-ci去设置代码发布

## 难点
- 1、画音高线的时候锯齿
- 2、整体数据规划
- 3、播放进度不流畅
- 4、播放的状态机
- 5、播放线移动的位置
- 6、组件的规划
