<template>
  <div class="uploadAudioPolicy">
    <h1>自定义音源制作说明</h1>
    <p>剪辑工具下载：<a href="https://www.audacityteam.org/" target="_blank">https://www.audacityteam.org/</a></p>
    <p>标注工具下载：<a href="https://www.fon.hum.uva.nl/praat/" target="_blank">https://www.fon.hum.uva.nl/praat/</a></p>
    <h2>第一步 找音色</h2>
    <p>1. 找到符合要求的素材</p>
    <p>2. 将素材下载下来</p>
    <p class="sj2">a. b站上可在对应的视频网站的bilibili.com前加kan，进行下载</p>
    <p class="sj2">b. 举例：</p>
    <p class="sj4">i. 若视频网站为：<a href="https://www.bilibili.com/video/BV1aE411K7zX?p=2" target="_blank">https://www.bilibili.com/video/BV1aE411K7zX?p=2</a></p>
    <p class="sj4">ii. 则下载网站为: <a href="https://www.kanbilibili.com/video/BV1aE411K7zX?p=2" target="_blank">https://www.kanbilibili.com/video/BV1aE411K7zX?p=2</a></p>
    <h2>第二步 截取</h2>
    <p>1. 一个音频大概2-4秒</p>
    <p>2. 只要目标人物（e.g. 唐国强) 的普通话干声片段，以下片段<span class="red">不要：</span></p>
    <p class="sj2">a. <span class="red">非目标人物声音不要</span>（比如在剪唐国强的素材的时候，非唐国强的声音全都<span class="red">不要</span>）</p>
    <p class="sj2">b. 有掺进任何其他非目标任务的声音的片段不要（如鼓掌声，背景音乐）</p>
    <p class="sj2">c. 有非普通话的片段不要</p>
    <p class="sj2">d. 发音含糊、不清晰的片段不要</p>
    <p class="sj2">e. 再次强调，千万千万千万不要剪非目标人物的声音片段进去（发生了重罚！！！）</p>
    <p>3. 剪下来的音频片段用音频对应的文本命名，名字里面不要出现标点符号，两句之间用「空格」隔开就好。（e.g. 一个音频片段的声音为：今天很开心，要出去了。 该音频文档的名则为：今天很开心 要出去了.wav）</p>
    <p>4. 有遇到不知道音频内容是什么的，可以看看视频帮助理解，或询问师兄</p>
    <h2>第三步 校对</h2>
    <h3>具体操作&快捷键</h3>
    <p>1、【播放】：Tab键</p>
    <p>2、【缩放】：点击软件左下角「in」图标放大，「out」图标缩小</p>
    <p>3、【删除片段】：Alt + Backspace or delete 键</p>
    <p>4、【增加片段】鼠标左键点击想要添加片段的地方，然后按回车键</p>
    <p>5、【保存】：ctrl + S</p>
    <h3>注意事项</h3>
    <p>1. 在做校准前，需了解校准的人物性别&发音特色</p>
    <p>2. 如果某一小片段的发音很不清晰，听不出是该片段对应的拼音的发音，可尝试连贯地听整句话的发音</p>
    <p class="sj2">a. 如果结合语境&场景，能较明确感知到这个地方确实会存在这个发音，则该发音可认为是个人发音特色，可以保留。</p>
    <p class="sj2">b. 如果结合语境&场景，仍然不能识别该发音，则可以删除该小片段上的拼音（保留该片段，在该片段按backspace or delete键）</p>
    <p>3. 如果存在<span class="red">无声音的空白小片段</span>（片段时间小于8毫秒），可结合具体情况，将该片段并入前/后一小段，具体操作为选中该片段，按Alt+backspace 键。若片段时间大于8毫秒，则保留。</p>
    <p>4. 若存在空白片段有明显声波&能听得出人物在说什么内容的时候，需给该片段标上声音内容对应的拼音&音调（ā对应1、á对应2、ǎ对应3、à对应4、a对应5）</p>
    <p>5. 完成每一个文档的人工校准后，记得重新检查一遍看是否有明显错误，如部分有声音的片段的拼音被误删了，或误被一些标点符号替代了。</p>
  </div>
</template>

<script>
// @ is an alias to /src
import { reportEvent } from '@/common/utils/helper'

export default {
  name: 'UploadAudioPolicy',
  mounted() {
    document.title = "上传音源须知"
  }
};
</script>

<style lang="less" scoped>
.uploadAudioPolicy {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px;
  a {
    color: #3072f6;
  }
}
.sj2 {
  text-indent: 2em;
}
.sj4 {
  text-indent: 4em;
}
.red {
  color: #ec3a2c;
}

</style>
