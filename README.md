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

## TODO
19、 设置一个生成音频的最长时间，如果点击播放预览后超过这个时间没有合成音频，就退出播放加载模式，并提示”音频合成失败，请稍后再试“。否则用户无法退出播放加载模式，就需要刷新页面，这时之前画的音符都消失了

2、要把doPlay的判断改成状态机
3、 音高线模式下播放进度拖动不流畅

4、配置gitlab-ci去设置代码发布
13、 编辑器入口样式优化：
12、 未登录状态下进入我们的编辑器页面是可以画音符的，但是播放预览的时候会报错，改为如果没登录的情况下用户做任何操作都弹出登录弹窗呢，同时未登录状态也应显示页头，右上角的用户头像那里显示登录按钮
11、 改变音符长度的样式优化，鼠标只有放在音符内侧才会出现箭头
9、 稍快点画音高线的时候，有明显的锯齿
4、 作品列表编辑作品，之前填写的多音字歌词，不点击校正拼音时显示该字没有多音字，应支持再次编辑作品的时候修改多音字发音，需要保存之前选择过的多音字的发音

18、 设置一个生成音频的最长时间，如果点击播放预览后超过这个时间没有合成音频，就退出播放加载模式，并提示”音频合成失败，请稍后再试“。否则用户无法退出播放加载模式，就需要刷新页面，这时之前画的音符都消失了



