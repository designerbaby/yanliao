(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-d87dec48"],{"0413":function(t,e,n){},"096b":function(t,e,n){"use strict";n.d(e,"a",(function(){return a})),n.d(e,"b",(function(){return s})),n.d(e,"c",(function(){return l}));var i=n("a358"),o=i["a"],a=function(t){return o({method:"post",url:"/cgi-bin/v1/yan/synth/modify_audio_draft",data:t})},s=function(t){return o({method:"post",url:"/cgi-bin/v1/yan/synth/del_audio_draft",data:{draft_id:t}})},l=function(t){return o({method:"post",url:"/cgi-bin/v1/yan/synth/get_audio_draft_detail",data:{draft_id:t}})}},"718b":function(t,e,n){"use strict";n("fa18")},b9af:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAArCAMAAAAwqkq2AAAAjVBMVEUAAAAtq/8srf9W4/8trP8srP8sq/8sq/8trP8trP8ztP9Lxv8trP8srP8trf8trv8urv8sq/8sq/8srP8srP8trP8srP8trP8urP8wrv8wrv8sq/8trP8trv8vrf8wsv8xtf8trP8tq/8srf8trf8trP8trP8trP8srP8trf8trP8trP8urf9Av/8sq//3dUWiAAAALnRSTlMAq4UD+7707eN6EQbpuW5FNffm3dbTzVE8KCDHllwxGAqikHJYSrCmnIiHfWMIyHqPAwAAAWhJREFUOMuNlOmWgjAMRiNlEZRFWUREcB8dnb7/483RpMwopeT+4+s9ITQ5QIcob07m2V7mWPEMRtj5nvxj6QdGe7WU78zPBvso+1iD9rfU4Q/YWyVk9d2/Ol1fK629dvF0k1AQ5xik2gsK8XAiumRGUaSxGzzK/5cKPHyfRv9CPXkLLQzbni20hUrU456eaNtsMd0OTaj52Imhbz28clu8p9VQ9T3u1EcaD/W+nz4JP9Ia9QpY0L0XPFvt3J1nl/bLdgOWvZ6rDeaQkJ3tOPZ2gba7ZsizWiL2mdN2TrbLsaMF2dNmXG5DSTjtuL3yVNu+GP/GgyTSEkapCmXXO/5o5DIGRtvqRiYBx7ZRXjyAQUO15yXHDlK6kQo47Km2yf655W5xFM81odkkpqEUOGzR/fQOYMCSSAQB3Uo40XAiPSfdgZM0YJHuqkWFK0cvuuobju5L5AEpRxfO6/GCbZl08qMwu5wAfgEAgWxGqClQhAAAAABJRU5ErkJggg=="},e151:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"edit-page"},[i("div",{staticClass:"main"},[t._m(0),i("div",{staticClass:"section"},[t._m(1),i("div",{staticClass:"lyric-edit-box"},[i("div",{staticClass:"lyric-item first-lyric-item"},[i("div",{staticClass:"title"},[t._v("原歌词:")]),i("div",{staticClass:"title"},[t._v("新歌词:")]),i("div",{class:0===t.toneType?"radio selected":"radio"},[i("input",{directives:[{name:"model",rawName:"v-model",value:t.toneType,expression:"toneType"}],attrs:{id:"0",type:"radio",hidden:""},domProps:{value:0,checked:t._q(t.toneType,0)},on:{change:function(e){t.toneType=0}}}),i("label",{attrs:{for:"0"}},[t._v("音源")])])]),t._l(t.oldLyricList,(function(e,o){return i("div",{key:e+o,staticClass:"lyric-item"},[i("div",{staticClass:"text"},[t._v(t._s(e))]),i("div",{class:!1===t.validateResult.contents[o].status?"input check-failed":"input"},[i("input",{directives:[{name:"model",rawName:"v-model",value:t.newLyricList[o].content,expression:"newLyricList[index].content"}],attrs:{autofocus:0===o?"autofocus":null,placeholder:"输入新歌词"},domProps:{value:t.newLyricList[o].content},on:{input:[function(e){e.target.composing||t.$set(t.newLyricList[o],"content",e.target.value)},function(e){return t.lyricInputChange(e,o)}],blur:function(e){return t.lyricInputBlur(e,o)}}}),i("span",{staticClass:"error-text"},[t._v(t._s(t.validateResult.contents[o].text))])]),0===t.toneType&&0===o?i("div",{class:!1===t.validateResult.singleTone?"tone-selector check-failed":"tone-selector"},[i("el-select",{staticClass:"selector",attrs:{filterable:"",placeholder:"选择谁来演唱这首歌"},on:{change:t.singleToneIdChange},model:{value:t.singleToneId,callback:function(e){t.singleToneId=e},expression:"singleToneId"}},t._l(t.toneList,(function(e){return i("el-option",{key:e.tone_id+o,attrs:{label:e.display_name,value:e.tone_id}},[i("span",{staticStyle:{float:"left"}},[t._v(t._s(e.display_name))]),i("span",{staticStyle:{float:"right",color:"#8492a6","font-size":"13px"}},[t._v("by "+t._s(e.nickname))])])})),1),null!==t.singleToneId?i("img",{attrs:{src:n("e6ee"),alt:""},on:{click:function(e){return t.playerButtonClick(e,t.singleToneId)}}}):t._e(),i("a",{staticClass:"upload-audio",attrs:{href:"/audioUpload"}},[t._v("上传其他音源 >")])],1):t._e(),1===t.toneType?i("div",{class:!1===t.validateResult.tone[o]?"tone-selector check-failed":"tone-selector"},[i("el-select",{staticClass:"selector",attrs:{filterable:"",placeholder:"选择谁来演唱这首歌"},on:{change:function(e){return t.toneSelectorChange(e,o)}},model:{value:t.newLyricList[o].toneId,callback:function(e){t.$set(t.newLyricList[o],"toneId",e)},expression:"newLyricList[index].toneId"}},t._l(t.toneList,(function(e){return i("el-option",{key:e.tone_id+o,attrs:{label:e.display_name,value:e.tone_id}},[i("span",{staticStyle:{float:"left"}},[t._v(t._s(e.display_name))]),i("span",{staticStyle:{float:"right",color:"#8492a6","font-size":"13px"}},[t._v("by "+t._s(e.nickname))])])})),1),t.newLyricList.findIndex((function(e){return e.toneId===t.newLyricList[o].toneId}))===o&&null!==t.newLyricList[o].toneId?i("img",{attrs:{src:n("e6ee"),alt:""},on:{click:function(e){return t.playerButtonClick(e,t.newLyricList[o].toneId)}}}):t._e(),0===o?i("a",{staticClass:"upload-audio",attrs:{href:"/audioUpload"}},[t._v("上传其他音源 >")]):t._e()],1):t._e()])})),i("div",{staticClass:"audio-box"},t._l(t.toneList,(function(t){return i("audio",{key:t.tone_id,attrs:{id:"audio-"+t.tone_id,src:t.audit_url}})})),0)],2)]),i("div",{staticClass:"section"},[t._m(2),i("el-input-number",{staticClass:"bpm-input",attrs:{"controls-position":"right"},on:{input:t.bpmInputChange},model:{value:t.bpm,callback:function(e){t.bpm=e},expression:"bpm"}}),!1===t.validateResult.bpm?i("div",{staticClass:"bpm-error-text"},[t._v("曲速不能超过 50 - 200 (bpm) 的范围")]):t._e()],1),i("div",{staticClass:"section"},[t._m(3),i("el-select",{staticClass:"melody-selector",attrs:{disabled:!0===t.melodySelectorDisable,placeholder:!0===t.melodySelectorDisable?"请选择音源后再选择曲调":""},model:{value:t.melody,callback:function(e){t.melody=e},expression:"melody"}},t._l(t.melodyOptions,(function(t){return i("el-option",{key:t.value,attrs:{label:t.label,value:t.value}})})),1)],1)]),i("div",{staticClass:"footer"},[i("button",{staticClass:"main-button",on:{click:t.prevButtonClick}},[t._v("上一步")]),i("button",{staticClass:"main-button",on:{click:t.audioButtonClick}},[t._v("去调音")]),i("button",{staticClass:"main-button",on:{click:t.confirmButtonClick}},[t._v("确定")])]),i("CompleteDialog",{ref:"CompleteDialog"})],1)},o=[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"page-title"},[i("img",{staticClass:"step",attrs:{src:n("b9af"),alt:""}}),i("div",{staticClass:"text"},[t._v("改编歌曲")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"title-box"},[n("div",{staticClass:"edit-title"},[n("div",{staticClass:"section-title"},[t._v("编辑歌词")]),n("div",{staticClass:"tips"},[t._v("将原歌词替换成新歌词")])]),n("div",{staticClass:"tone-title"},[n("div",{staticClass:"section-title"},[t._v("选择音源")]),n("div",{staticClass:"tips"},[t._v("选择谁来演唱这首歌")])])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"section-title"},[n("span",[t._v("调节曲速")]),n("span",{staticClass:"melody-tips"},[t._v("(单位: BPM)")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"section-title"},[t._v("选择曲调 "),n("span",{staticClass:"melody-tips"},[t._v("(单位: 1 度代表 1 半音)")])])}],a=n("0bd5"),s=(n("3d17"),n("3d26"),n("9851")),l=n.n(s),r=(n("1ff9"),n("d514")),c=n.n(r),d=(n("5b47"),n("17c9")),u=n.n(d),f=(n("cb95"),n("5de1")),m=n.n(f),h=(n("6a61"),n("3337"),n("16ca"),n("3bae"),n("4cd5"),n("7a3a"),n("591f"),n("62f9"),n("27ae"),n("4ec3")),p=n("096b"),v=n("dfe3"),y=n("3dc7"),g=n("b233"),b=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("Dialog",{attrs:{visible:t.dialogVisible,width:"400px","custom-class":"dialog"},on:{"update:visible":function(e){t.dialogVisible=e}}},[n("div",{staticClass:"dialog-main"},[t._v(t._s(t.text))]),n("div",{staticClass:"dialog-confirm-button",on:{click:function(e){t.dialogVisible=!1}}},[t._v("确定")])])},_=[],A=(n("62e5"),n("7c6a")),I=n.n(A),C={name:"CompleteDialog",data:function(){return{dialogVisible:!1,text:""}},components:{Dialog:I.a},methods:{show:function(t){this.text=t,this.dialogVisible=!0},hide:function(){this.dialogVisible=!1}}},L=C,T=n("5d22"),k=Object(T["a"])(L,b,_,!1,null,null,null),w=k.exports,x={name:"Home",components:{"el-input":m.a,"el-select":u.a,"el-option":c.a,"el-input-number":l.a,Header:y["a"],CompleteDialog:w},data:function(){return{submitSuccess:!1,edited:!1,maxTone:0,minTone:0,melodySelectorDisable:!0,singleToneId:null,validateResult:{contents:[],tone:[],bpm:null,singleTone:null},firstSelectTone:!0,musicId:null,toneType:0,newLyricList:[],bpm:50,melody:null,formChecked:!0,melodyOptions:[],oldLyricList:[],toneList:[],toneId:0,wantAddDraft:!0,oldBpmTone:{bpm:50,melody:0}}},watch:{toneType:function(t,e){t!==e&&(this.validateResult.tone=this.oldLyricList.map((function(t){return null})),this.validateResult.singleTone=null,0===t?this.singleToneId?this.melodySelectorDisable=!1:this.melodySelectorDisable=!0:1===t&&(this.newLyricList.every((function(t){return!t.toneId}))?this.melodySelectorDisable=!0:this.melodySelectorDisable=!1))}},created:function(){var t=this,e=parseInt(this.$route.params.musicId),n=this.$route.params.arrangeId,i=this.$route.params.toneId,o=sessionStorage.getItem("draftId");console.log("musicId:".concat(e,", arrangeId:").concat(n,",toneId:").concat(i)),this.toneId=i,this.musicId=e,this.arrangeId=n,this.draftId=o,Object(h["e"])(e).then((function(e){var n=e.data.data;t.toneList=n.tone_list})),o?this.getDraftInfo(o):n?this.getEditedInfo(n):this.getSongInfo()},mounted:function(){Object(g["n"])("edit-page-exposure"),this.toOnBeforeUpload()},destroyed:function(){window.onbeforeunload=null},methods:{toOnBeforeUpload:function(){var t=this;window.onbeforeunload=function(e){var n=t.comparisonFormData();if(console.log("this.wantAddDraft:",t.wantAddDraft),!0===n&&t.wantAddDraft)return t.submitDraft(),"您可能有数据没有保存"}},comparisonFormData:function(){var t=this.defaultForm,e=this.getFormData(),n=!1;return JSON.stringify(t)!==JSON.stringify(e)&&(n=!0),n},getDraftInfo:function(t){var e=this;Object(p["c"])(t).then((function(t){var n=t.data.data;e.initFormData(n)}))},getEditedInfo:function(t){var e=this;Object(h["a"])(t).then((function(t){var n=t.data.data;e.initFormData(n)}))},getSongInfo:function(){var t=this,e=this.musicId;Object(h["d"])(e).then((function(e){var n=e.data.data;t.initFormData(n)}))},initLyricData:function(t){this.arrangeId||this.draftId?0===this.toneType?(this.singleToneId=t.new_lyric_list[0].tone_id||null,this.newLyricList=t.new_lyric_list.map((function(t){return{content:t.content,toneId:null}}))):this.newLyricList=t.new_lyric_list.map((function(t){return{content:t.content,toneId:t.tone_id||null}})):this.newLyricList=this.oldLyricList.map((function(t){var e={content:t,toneId:null};return e}))},initFormData:function(t){var e=this,n="normal";this.draftId?n="draft":this.arrangeId&&(n="edit"),console.log("initFormData type: ".concat(n,", data:"),t);var i={normal:function(){e.oldLyricList=t.lyric_list,e.bpm=t.avg_bpm,e.maxTone=0,e.minTone=0,e.melody=0,e.musicId=t.music_id,e.countAdjust=t.count_adjust||[],e.oldBpmTone={bpm:t.avg_bpm,melody:0},e.initLyricData()},edit:function(){var n=t.edit_info;console.log("edit editInfo:",n),e.maxTone=t.max_tone,e.minTone=t.min_tone,e.bpm=n.bpm,e.melody=n.up_down_tone,e.toneType=n.tone_type,e.oldLyricList=t.lyric_list,e.countAdjust=t.count_adjust||[],e.oldBpmTone={bpm:n.bpm,melody:n.up_down_tone},e.initLyricData(n)},draft:function(){var n=t.audio_draft_info.content;e.bpm=n.bpm,e.melody=n.up_down_tone,e.toneType=n.tone_type,e.maxTone=n.max_tone,e.minTone=n.min_tone,e.oldLyricList=n.new_lyric_list.map((function(t){return t.content}));var i=e.musicId;e.oldBpmTone={bpm:n.bpm,melody:n.up_down_tone},Object(h["d"])(i).then((function(t){e.oldLyricList=t.data.data.lyric_list,e.initvalidateData()})),e.countAdjust=t.audio_draft_info.count_adjust||[],e.initLyricData(n)}};i[n](),this.$nextTick((function(){e.melodySelectorDisable=0===e.maxTone&&0===e.minTone})),this.initMelodyOption(),this.initvalidateData(),this.defaultForm=this.getFormData()},submitDraft:function(){var t=this.getFormData(),e=sessionStorage.getItem("draftId"),n=Object.assign({},t,{step:1,draft_id:e||""});Object(p["a"])(n).then((function(t){var e=t.data.data,n=e.draft_id;sessionStorage.setItem("draftId",n)}))},getFormData:function(){var t={music_id:this.musicId,tone_type:this.toneType,new_lyric_list:this.cleansingData(this.newLyricList),bpm:parseInt(this.bpm),up_down_tone:this.melody,max_tone:this.maxTone,min_tone:this.minTone};return t},initvalidateData:function(){this.validateResult={contents:this.oldLyricList.map((function(t){return{status:null,text:""}})),bpm:null,tone:this.oldLyricList.map((function(t){return null})),singleTone:null}},initMelodyOption:function(){for(var t=this.maxTone,e=this.minTone,n=[],i=e;i<=t;i++){var o={value:i};o.label=i>0?"升 ".concat(i," 度"):0===i?"曲调不变(默认)":"降 ".concat(Math.abs(i)," 度"),n.push(o)}t<0&&n.push({value:0,label:"曲调不变(默认)"}),e>0&&n.unshift({value:0,label:"曲调不变(默认)"}),this.melodyOptions=n},getMelodyConfig:function(t){var e=this;return Object(a["a"])(regeneratorRuntime.mark((function n(){var i,o,a;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return i=e.musicId,console.log("getMelodyConfig: musicId:".concat(i,", toneId:").concat(t)),n.next=4,Object(v["g"])({music_id:i,tone_id:t});case 4:o=n.sent,a=o.data,console.log("getToneInfo:",a),e.melodySelectorDisable=!1,e.maxTone=a.data.tone_max,e.minTone=a.data.tone_min,e.initMelodyOption(),e.melody=0;case 12:case"end":return n.stop()}}),n)})))()},bpmInputChange:function(t){this.checkBpmInput()},toneSelectorChange:function(t,e){!0===this.firstSelectTone&&1===this.toneType&&(log("初次选择音源"),this.newLyricList.forEach((function(e){e.toneId=t})),this.getMelodyConfig(t),this.checkAllToneSelector(),this.firstSelectTone=!1),this.validateResult.tone[e]=!!t},singleToneIdChange:function(t){t?(this.getMelodyConfig(t),this.validateResult.singleTone=!0):this.validateResult.singleTone=!1},lyricInputChange:function(t,e){var n=t.target,i=n.value;this.checkSingleContentInput(i,e);this.edited=!0},lyricInputBlur:function(t,e){var n=t.target;n.value},playerButtonClick:function(t,e){var n=document.querySelectorAll("audio");n.forEach((function(t){t.pause()}));var i=document.querySelector("#audio-".concat(e));i.currentTime=0,i.play()},prevButtonClick:function(){Object(g["n"])("edit-page-prev-button"),this.$router.push("/search")},deleteDraft:function(){var t=sessionStorage.getItem("draftId");t&&Object(p["b"])(t),sessionStorage.setItem("draftId","")},handlePolyphonicList:function(t){var e=t,n=[];return e.forEach((function(t){n.push({x:t.x,y:t.y,pinyin:t.pinyin_list[0]})})),n},audioButtonClick:function(){var t=this;this.wantAddDraft=!1;var e=this.getFormData();this.checkForm(),!0===this.formChecked?Object(h["b"])(e).then((function(n){var i=n.data.data;e.fix_pinyin_list=t.handlePolyphonicList(i.polyphonic_list),e.is_add_ac=0;var o=t.judgeToneBpmChange();t.arrangeId?(e.arrange_id=t.arrangeId,t.$router.push("/audioEditor?musicId=".concat(t.musicId,"&index=1&arrangeId=").concat(t.arrangeId,"&resetF0Draw=").concat(o))):t.$router.push("/audioEditor?musicId=".concat(t.musicId,"&index=1&resetF0Draw=").concat(o)),sessionStorage.setItem("xml2JsonReq",JSON.stringify(e))})).then((function(t){})):this.$refs.CompleteDialog.show("请先完善信息后再进行下一步")},judgeToneBpmChange:function(){return console.log("this.oldBpmTone: ".concat(this.oldBpmTone,", this.bpm: ").concat(this.bpm,", this.melody: ").concat(this.melody)),this.oldBpmTone.bpm!==this.bpm||this.oldBpmTone.melody!==this.melody?1:0},confirmButtonClick:function(){var t=this;Object(g["n"])("edit-page-confirm-button");var e=this.getFormData(),n=this.$route.params.arrangeId;n&&(e.arrange_id=n),console.log("edit confirmButtonClick提交数据",e),this.checkForm(),!0===this.formChecked?Object(h["b"])(e).then((function(n){var i=n.data.data,o=i.polyphonic_list;if(0===o.length)return e.fix_pinyin_list=[],Object(h["f"])(e);sessionStorage.setItem("form",JSON.stringify(e)),sessionStorage.setItem("polyphonicList",JSON.stringify(i.polyphonic_list)),sessionStorage.setItem("editPath",JSON.stringify(t.$router.history.current.path)),t.$router.push("/rectify?arrangeId=".concat(e.arrange_id||""))})).then((function(e){if(e){e.data.data;t.submitSuccess=!0,t.deleteDraft(),t.$router.push("/profile")}})):this.$refs.CompleteDialog.show("请先完善信息后再进行下一步"),this.defaultForm.bpm!==this.bpm&&Object(g["n"])("edit-page-update-bpm"),this.defaultForm.melody!==this.melody&&Object(g["n"])("edit-page-update-melody")},fillValidateResult:function(t,e,n){var i={status:t,text:e};this.validateResult.contents[n]=i},checkBpmInput:function(){var t=this.bpm;this.validateResult.bpm=!(t<50||t>200)},checkSingleContentInput:function(t,e){var n=this.countAdjust.find((function(t){return t.line===e+1})),i={status:!0,text:""};if(this.validateResult.contents[e]=i,0===t.length)return this.fillValidateResult(!1,"请输入歌词",e),this.oldLyricList[e].length;if(!1===/^((?![\u3000-\u303F])[\u2E80-\uFE4F]|\·)*(?![\u3000-\u303F])[\u2E80-\uFE4F](\·)*$/.test(t))return this.fillValidateResult(!1,"只能输入中文",e),this.oldLyricList[e].length;if(n){if(Array.from(t).length!==n.count)return this.fillValidateResult(!1,"".concat(Array.from(t).length,"/").concat(n.count),e),n.count}else if(Array.from(t).length!==Array.from(this.oldLyricList[e]).length)return this.fillValidateResult(!1,"".concat(Array.from(t).length,"/").concat(Array.from(this.oldLyricList[e]).length),e),Array.from(this.oldLyricList[e]).length;return Array.from(this.oldLyricList[e]).length},checkAllContentInput:function(){var t=this;this.newLyricList.forEach((function(e,n){var i=e.content;t.checkSingleContentInput(i,n)}))},checkAllToneSelector:function(){var t=this;0===this.toneType?null!==this.singleToneId?this.validateResult.singleTone=!0:this.validateResult.singleTone=!1:this.newLyricList.forEach((function(e,n){var i=e.toneId;t.validateResult.tone[n]=null!==i}))},checkForm:function(){var t=this;this.checkBpmInput(),this.checkAllContentInput(),this.checkAllToneSelector(),console.log("validate result",this.validateResult),this.formChecked=!0;var e=this.validateResult;Object.keys(e).forEach((function(n){var i=e[n],o=Object.prototype.toString.call(i);if(console.log("k: ".concat(n,", value: ").concat(i,", type: ").concat(o)),"[object Array]"===o)for(var a=0;a<i.length;a++){var s=i[a];if("[object Boolean]"===Object.prototype.toString.call(s)){if(!1===s){t.formChecked=!1;break}}else if("[object Object]"===Object.prototype.toString.call(s)&&!1===s.status){t.formChecked=!1;break}}else"[object Boolean]"===o&&!1===i&&(t.formChecked=!1)}))},cleansingData:function(t){var e=this;return t.map((function(t,n){var i={content:t.content};return 0===e.toneType?0===n&&(i.tone_id=e.singleToneId):t.toneId&&(i.tone_id=t.toneId),i}))}}},S=x,D=(n("718b"),n("e3be"),Object(T["a"])(S,i,o,!1,null,"93ea59b6",null));e["default"]=D.exports},e3be:function(t,e,n){"use strict";n("0413")},e6ee:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAVFBMVEUAAAAsrP8srP8srP8sq/8trP8sq/8tq/8trP8zv/8sq/8trP8srP8trP8srP8trP8tq/8srf8uq/8urf8urP8uq/8urf8urf8ttP8urv8vrf8sq/+Hb4TNAAAAG3RSTlMAvsT669i6noEK9/bi07Oaj4V6Tk09MhwRXl2GaxmbAAAAb0lEQVQY04XR2QqAIBQE0NE22/d1/v8/i6gbSuKADx4QryMkpszgJiPpUN7wwbR/bdN8MeEMtNG9F5yoAfIL1ACkXGxMihUjjY0HO+SRshGxBurKQRVfq/Rg8PguFwVGkuF/nukpxF+dlOzGFPIdJ64YFV0IWOmGAAAAAElFTkSuQmCC"},fa18:function(t,e,n){}}]);