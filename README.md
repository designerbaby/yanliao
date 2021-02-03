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

### 数据上报地址：
- https://growth.tencent.com/kh37dyui2j/data_management/Source_Event/4889/user_event

### TODO

- 1、要把doPlay的判断改成状态机
- 2、配置gitlab-ci去设置代码发布

3、右键增加“批量编辑歌词”的功能，点击后弹出歌词输入框，输入框显示当前所有音符的歌词，支持在弹窗中输入最大字数为当前页面音符数的歌词，点击确定后歌词将顺序填充进音符中。歌词的显示、编辑以及拼音校正逻辑都与输入单个歌词保持一致。
4、要对stagePitches进行排序

## 难点
- 1、画音高线的时候锯齿
- 2、数据处理规划
- 3、播放进度不流畅
- 4、播放的状态机
- 5、播放线移动的位置
