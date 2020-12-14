<template>
  <div class="privacyPolicy">
    <h1>播放激励</h1>
    <h2>亲爱的up主：</h2>
    <p>感谢您在盐料视频和更多同好分享搞笑视频，我们和酷狗音频app建立了长期合作关系，如果您在发布视频的时候同意将视频同步到酷狗音乐app的视频区，您将可以获得酷狗给您提供的播放激励，并直接成为酷狗音乐的视频达人。您的作品会被推荐到酷狗音乐APP，被更多的人关注和认可！</p>
    <p>
      酷狗原创视频的收益是按照上传视频每天实际产生的总播放量进行统计的，所获的收益数据情况可以在酷狗号达人后台（http://kuhao.kugou.com）中查看，每个月的提现期（11日-15日）可以对余额进行提现。
    </p>
    <p>
      原创视频是指由上传者本人独立创作的作品，包括本人录制和剪辑的视频。混剪等二次创作类的作品采用的画面片段素材，每段不能超过30秒。视频清晰，画面流畅由观看性，不能是篡改他人创作或者搬运的视频。发现抄袭、刷数据或发布违规内容等不良行为，立即取消原创作者身份，收益失效。
    </p>
  </div>
</template>

<script>
// @ is an alias to /src
import { reportEvent } from "@/common/utils";

export default {
  name: "PlayIncentives",
  components: {},
  mounted() {
    document.title = "播放激励";
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.privacyPolicy {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px;
}
</style>
