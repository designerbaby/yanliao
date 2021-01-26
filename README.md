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
3、 音高线模式下播放进度拖动不流畅
9、 点击音频编辑器入口，默认打开为空页面，而不是之前编辑的页面，只有点击作品编辑才跳转至之前编辑的页面。
11、 在没有进行播放预览时，一个新的编辑器作品无法生成音频作品，改为点击播放预览或生成音频都会更新对应的音频作品
总结：作品列表中的编辑器作品在点击“生成音频”和“播放预览”的的时候更新。当点击“生成音频”或者播放预览，如果是在编辑之前生成过的作品，则覆盖原作品；如果是一个新的编辑器作品，则在列表生成新作品。
12、 在音符重叠的情况下点击“生成音频”，不应跳转作品列表，而是弹出报错提示

14、 非首次播放时，设置面板修改音源和曲速无效，音频也没有重新生成
15、 设置面板希望长期悬浮，除非用户自己叉掉，设置面板修改一个逻辑，
18、 编辑歌词时，点击“拼音校正”，如果没有多音字，则直接弹出提示”没有多音字，无需校正“。
19、 设置一个生成音频的最长时间，如果点击播放预览后超过这个时间没有合成音频，就退出播放加载模式，并提示”音频合成失败，请稍后再试“。否则用户无法退出播放加载模式，就需要刷新页面，这时之前画的音符都消失了
20、 把音符画在后面的节拍， 播放异常，改为默认从0开始播放进度线，仍然允许用户可以拖动改变起始播放位置
21、 播放进度和声音不同步，之前仅仅是第一个不同步，现在所有的都不同步

优化：
1、 编辑器做成全屏界面，并支持控制区不动的情况下滚动键盘
