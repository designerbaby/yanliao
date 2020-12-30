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
- 3、移动绿色块解除报错
- 4、音符改变长度

- 缺失的功能：
- 1、没有音符重叠的标红报错提示
- 2、播放预览的时候声音很奇怪，播放线没有随着播放进度移动而是很快的移动
- 3、增加ctrl+Z的快捷键代表撤销
- bug：
- 1、节拍显示不全，只显示前两个小节(done)
- 2、右键时对应的音符应高亮(done)
- 3、生成音符的交互不对，单击不应出现音符，只有拖拽才出现音符(done)
注：SV中提供双击或者拖拽两种方式，但是没有单击生成的方式，且SV中的两种模式是互斥的，我们做的简单点只支持拖拽生成音符即可
- 4、当拖拽生成音符后，生成的音符自动高亮(done)
- 5、点击除音符以外的编辑器页面，之前高亮的音符变暗(done)
- 6、鼠标放在音符左右两边，出现改变长度的提示，但是拖动后长度没有改变
- 8、生成和移动音符，音符的长度必须要卡住节拍，不能使一个音符的起始或者初始位置处于32分音符中间，不然无法精确计算出时间
- 9、左边键盘的C1-C7要显示出来，参考SV （done）
