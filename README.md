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
刚开始可使用辅助工具，https://github.com/commitizen/cz-cli
```
npm install -g commitizen
```

### TODO

- 2、video标签要支持avi、wmv、mpeg、m4v、mov、asf、flv、f4v格式的文件
- m4v: 浏览器不支持m4v格式文件，这些格式需要播放器支持。这些文件直接无法在浏览器中运行。 像chrome，firefox，ie ......等。
- 因为这些文件格式属于iOS操作系统，由apple开发

- （done）14、播放时，点击暂停，声音没有消失 
- (done)15、播放时，点击暂停，进度条初始化，期望是进度条停在原位置 
- (done)16、调整节拍，不可以支持输入数字，期望支持输入数字
- (done)17、每小节的拍子之间的黑线不明显，和小格区分不出；
- (done)19、改变音符长度，音符必须卡住格子，现在音符是可以不卡住格子的 
- 20、音符可以移动到编辑器键盘上方，期望不能移动超过键盘最高的键 
-  (done)21、调整节拍，当分母设为16时，编辑器右侧有灰色无效区域
- （done）22、当音符画到最右边时，编辑器页面应相应的延展，但是现在没有延展 
- (done)23、当两个白键之间没有半音，白色区域也要有分割线，类似于SV 
- (done)24、增加A2，半音要处于两个全音之间，比如B#不可以完全处在B而不在A上 


- 18、ctrl+z的撤销只对于生成音符有效，但是当改变音符长度、改成音符位置、删除音符后，ctrl+z均无法撤销操作；
- 13、拖动音符，鼠标点击较长时间，松开后音符粘在鼠标上无法固定