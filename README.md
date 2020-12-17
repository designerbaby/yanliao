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
    - 短视频接口文档：http://git.tmeoa.com/simonygzhao/RESTfulAPI/blob/master/video.md
    - 草稿箱： http://git.tmeoa.com/simonygzhao/RESTfulAPI/blob/master/audio_draft.md
    - 登录：http://git.tmeoa.com/simonygzhao/RESTfulAPI/blob/master/auth.md
    - 主流程：http://git.tmeoa.com/simonygzhao/RESTfulAPI/blob/master/kuwa.md
    - 运营后台管理：http://git.tmeoa.com/simonygzhao/RESTfulAPI/blob/master/audio_manager_api.md
    - 绑定酷狗账号：https://git.code.tencent.com/musicx_backend/mundo_proto/blob/master/musicx_yan/yan_kugou_bus/musicx_yan_kugou_bus.proto

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
bug
1、编辑作品，修改歌词后进入拼音校正，点击上一步刚刚保存的结果丢失P1
2、编辑作品，在2的场景下，编辑后产生一个新的作品而不是覆盖原作品P1
3、创作或者编辑没有第三步校正拼音的作品，点击“确定”后提示参数错误，但是音频的合成效果没有受到影响P0
4、再次编辑作品没有请求曲调范围P0
5、第三步校正拼音保存草稿，再次编辑草稿，无法返回上一步P0
