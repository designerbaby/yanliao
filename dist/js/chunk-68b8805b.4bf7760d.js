(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-68b8805b"],{7577:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAMAAADzapwJAAAAP1BMVEUAAAAsrP8srP8vrv8wsP8wrf8sq/8srP8tq/8trP8trP8tq/8srP8srP8trP8trP8trP8trP83tv9V1f8sq//5BkqYAAAAFHRSTlMA7tQ+LRr58uTdzcasopeBa1AOBnKoVFsAAABXSURBVBjTjdHJDsAgCEXRytBJO7///9Ym3RgiDd7lWRiB4T9Z06YtE4DpbBhfWVzGeDweA8SGa/vtMuarsqmoy0jsMpaI40eKBh8MxiHuXlWW6Az2aHEvDw0QI2n4PF4AAAAASUVORK5CYII="},"7f87":function(t,e,a){"use strict";a.d(e,"d",(function(){return s})),a.d(e,"e",(function(){return r})),a.d(e,"a",(function(){return o})),a.d(e,"b",(function(){return u})),a.d(e,"c",(function(){return d}));var i=a("a358"),n=i["a"],s=function(t){return n({method:"post",url:"/cgi-bin/v1/yan/synth/get_arrange_list",data:t})},r=function(t){return n({method:"post",url:"/cgi-bin/v1/yan/synth/get_audio_draft_list",data:t})},o=function(t){return n({method:"post",url:"/cgi-bin/v1/yan/synth/get_arrange_detail",data:{arrange_id:t}})},u=function(t){return n({method:"post",url:" /cgi-bin/v1/yan/synth/del_arrange_info",data:{arrange_id:t}})},d=function(t){return n({method:"post",url:" /cgi-bin/v1/yan/synth/del_audio_draft",data:{draft_id:t}})}},c662:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"audio-page"},[i("div",{staticClass:"main"},[i("div",{staticClass:"title"},[t._v(" 作品详情 ")]),i("div",{staticClass:"audio-title"},[t._v(t._s(t.arrangeName))]),i("div",{staticClass:"audio-create-time"},[t._v("创作时间："+t._s(t.$moment(1e3*t.updateTime).format("YYYY/MM/DD HH:mm")))]),""!==t.audioUrl?i("div",{staticClass:"player-box",on:{mousemove:t.progressMousemoveEvent,mouseup:t.progressMouseupEvent,mouseleave:t.progressMouseleaveEvent}},[!0===t.audioPaused?i("img",{staticClass:"play-button",attrs:{src:a("7577"),alt:""},on:{click:t.playButtonClick}}):t._e(),!1===t.audioPaused?i("img",{staticClass:"play-button",attrs:{src:a("fc79"),alt:""},on:{click:t.playButtonClick}}):t._e(),i("div",{staticClass:"progress-box",on:{click:t.progressClick}},[i("div",{staticClass:"progress",style:{width:this.progresswidth}},[i("div",{staticClass:"progress-button",on:{mousedown:t.progressButtonMousedownEvent}})])]),i("div",{staticClass:"audio-duration"},[t._v(t._s(t.formatTime(t.currentTime))+" / "+t._s(t.formatTime(t.duration)))])]):t._e(),i("audio",{attrs:{id:"audio",src:t.audioUrl},on:{play:t.playEvent,pause:t.pauseEvent,canplay:t.canplay,timeupdate:t.timeupdate}}),i("div",{staticClass:"strong-text text"},[t._v("歌曲："+t._s(t.musicName))]),i("div",{staticClass:"strong-text text"},[t._v("音源："+t._s(t.toneInfos.map((function(t){return t.display_name})).join(",")))]),i("div",{staticClass:"lyric-box"},[i("div",{staticClass:"left strong-text text"},[t._v("歌词：")]),i("div",{staticClass:"right"},t._l(t.lyricList,(function(e,a){return i("div",{key:e.content+a,staticClass:"text"},[t._v(t._s(e.content))])})),0)])])])},n=[],s=(a("b0c0"),a("b233")),r=a("3dc7"),o=a("7f87"),u={name:"Home",components:{Header:r["a"]},data:function(){return{arrangeId:this.$route.params.arrangeId,arrangeName:"",audioUrl:"",updateTime:0,toneInfos:[],audioPaused:!0,duration:0,currentTime:0,targetTime:0,audio:null,progresswidth:"0px",musicName:"",lyricList:[]}},mounted:function(){var t=this;Object(s["h"])("audiodetail-page-exposure","audiodetail-page-exposure",{arrangeId:this.arrangeId}),this.initAudio(),Object(o["a"])(this.arrangeId).then((function(e){var a=e.data.data;t.arrangeName=a.arrange_info.arrange_name,t.updateTime=a.arrange_info.update_time,t.audioUrl=a.arrange_info.online_url,t.musicName=a.music_info.name,t.toneInfos=a.arrange_info.tone_infos,t.lyricList=a.edit_info.new_lyric_list}))},methods:{formatTime:function(t){return this.$moment(1e3*t).format("mm:ss")},initAudio:function(){this.audio=document.querySelector("#audio")},playEvent:function(){this.audioPaused=!1},pauseEvent:function(){this.audioPaused=!0},canplay:function(){this.duration=audio.duration},timeupdate:function(t){if(!1===this.openSlideMode){var e=t.target.currentTime;this.currentTime=e;var a=e/this.duration*460;this.progresswidth="".concat(a,"px")}},playButtonClick:function(){var t=this.audio;!0===this.audio.paused?t.play():t.pause()},progressClick:function(t){},progressButtonMousedownEvent:function(t){this.openSlideMode=!0},progressMousemoveEvent:function(t){var e=document.querySelector(".progress-box"),a=t.clientX-e.offsetLeft;if(!0===this.openSlideMode&&a>=0&&a<=460){this.progresswidth="".concat(a,"px");var i=Math.floor(a/460*this.duration);this.currentTime=i}},progressMouseupEvent:function(t){this.openSlideMode=!1;var e=t.target;e.classList.contains("play-button")||(this.audio.currentTime=this.currentTime)},progressMouseleaveEvent:function(t){this.openSlideMode=!1}}},d=u,c=(a("d733"),a("2877")),l=Object(c["a"])(d,i,n,!1,null,"4c83b0fe",null);e["default"]=l.exports},d38a:function(t,e,a){},d733:function(t,e,a){"use strict";a("d38a")},fc79:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWBAMAAAA2mnEIAAAAD1BMVEUAAAAsq/8srf8sq/8sq/9erwomAAAABHRSTlMA+YXza8bhbQAAACVJREFUGNNjQAPKCgxMRlC2iAADoyOU7eLAwOIyhNkwvyD8iAoAe4MOe4zipr4AAAAASUVORK5CYII="}}]);
//# sourceMappingURL=chunk-68b8805b.4bf7760d.js.map