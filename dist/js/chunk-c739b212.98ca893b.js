(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-c739b212"],{"096b":function(t,e,n){"use strict";n.d(e,"a",(function(){return s})),n.d(e,"b",(function(){return o})),n.d(e,"c",(function(){return a}));var i=n("a358"),r=i["a"],s=function(t){return r({method:"post",url:"/cgi-bin/v1/yan/synth/modify_audio_draft",data:t})},o=function(t){return r({method:"post",url:"/cgi-bin/v1/yan/synth/del_audio_draft",data:{draft_id:t}})},a=function(t){return r({method:"post",url:"/cgi-bin/v1/yan/synth/get_audio_draft_detail",data:{draft_id:t}})}},"159b":function(t,e,n){var i=n("da84"),r=n("fdbc"),s=n("17c2"),o=n("9112");for(var a in r){var u=i[a],c=u&&u.prototype;if(c&&c.forEach!==s)try{o(c,"forEach",s)}catch(l){c.forEach=s}}},"17c2":function(t,e,n){"use strict";var i=n("b727").forEach,r=n("a640"),s=n("ae40"),o=r("forEach"),a=s("forEach");t.exports=o&&a?[].forEach:function(t){return i(this,t,arguments.length>1?arguments[1]:void 0)}},"1f1a":function(t,e,n){},"25f0":function(t,e,n){"use strict";var i=n("6eeb"),r=n("825a"),s=n("d039"),o=n("ad6d"),a="toString",u=RegExp.prototype,c=u[a],l=s((function(){return"/a/b"!=c.call({source:"a",flags:"b"})})),d=c.name!=a;(l||d)&&i(RegExp.prototype,a,(function(){var t=r(this),e=String(t.source),n=t.flags,i=String(void 0===n&&t instanceof RegExp&&!("flags"in u)?o.call(t):n);return"/"+e+"/"+i}),{unsafe:!0})},"3ca3":function(t,e,n){"use strict";var i=n("6547").charAt,r=n("69f3"),s=n("7dd0"),o="String Iterator",a=r.set,u=r.getterFor(o);s(String,"String",(function(t){a(this,{type:o,string:String(t),index:0})}),(function(){var t,e=u(this),n=e.string,r=e.index;return r>=n.length?{value:void 0,done:!0}:(t=i(n,r),e.index+=t.length,{value:t,done:!1})}))},4160:function(t,e,n){"use strict";var i=n("23e7"),r=n("17c2");i({target:"Array",proto:!0,forced:[].forEach!=r},{forEach:r})},"4d06":function(t,e,n){"use strict";n("e7d2")},"4df4":function(t,e,n){"use strict";var i=n("0366"),r=n("7b0b"),s=n("9bdd"),o=n("e95a"),a=n("50c4"),u=n("8418"),c=n("35a1");t.exports=function(t){var e,n,l,d,f,h,p=r(t),m="function"==typeof this?this:Array,v=arguments.length,b=v>1?arguments[1]:void 0,g=void 0!==b,y=c(p),_=0;if(g&&(b=i(b,v>2?arguments[2]:void 0,2)),void 0==y||m==Array&&o(y))for(e=a(p.length),n=new m(e);e>_;_++)h=g?b(p[_],_):p[_],u(n,_,h);else for(d=y.call(p),f=d.next,n=new m;!(l=f.call(d)).done;_++)h=g?s(d,b,[l.value,_],!0):l.value,u(n,_,h);return n.length=_,n}},6611:function(t,e,n){},"7db0":function(t,e,n){"use strict";var i=n("23e7"),r=n("b727").find,s=n("44d2"),o=n("ae40"),a="find",u=!0,c=o(a);a in[]&&Array(1)[a]((function(){u=!1})),i({target:"Array",proto:!0,forced:u||!c},{find:function(t){return r(this,t,arguments.length>1?arguments[1]:void 0)}}),s(a)},"8e6f":function(t,e,n){"use strict";n("a50c")},"9bdd":function(t,e,n){var i=n("825a"),r=n("2a62");t.exports=function(t,e,n,s){try{return s?e(i(n)[0],n[1]):e(n)}catch(o){throw r(t),o}}},"9d4c":function(t,e,n){},a2c6:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"edit-page"},[i("div",{staticClass:"main"},[t._m(0),i("div",{staticClass:"section"},[t._m(1),i("div",{staticClass:"lyric-edit-box"},[i("div",{staticClass:"lyric-item first-lyric-item"},[i("div",{staticClass:"title"},[t._v("原歌词:")]),i("div",{staticClass:"title"},[t._v("新歌词:")]),i("div",{class:0===t.toneType?"radio selected":"radio"},[i("div",{staticClass:"icon",on:{click:function(e){t.toneType=0}}}),i("input",{directives:[{name:"model",rawName:"v-model",value:t.toneType,expression:"toneType"}],attrs:{id:"0",type:"radio",hidden:""},domProps:{value:0,checked:t._q(t.toneType,0)},on:{change:function(e){t.toneType=0}}}),i("label",{attrs:{for:"0"}},[t._v("单个音源")])]),i("div",{class:1===t.toneType?"radio selected":"radio"},[i("div",{staticClass:"icon",on:{click:function(e){t.toneType=1}}}),i("input",{directives:[{name:"model",rawName:"v-model",value:t.toneType,expression:"toneType"}],attrs:{id:"1",type:"radio",hidden:""},domProps:{value:1,checked:t._q(t.toneType,1)},on:{change:function(e){t.toneType=1}}}),i("label",{attrs:{for:"1"}},[t._v("多个音源")])])]),t._l(t.oldLyricList,(function(e,r){return i("div",{key:e+r,staticClass:"lyric-item"},[i("div",{staticClass:"text"},[t._v(t._s(e))]),i("div",{class:!1===t.validateResult.contents[r].status?"input check-failed":"input"},[i("input",{directives:[{name:"model",rawName:"v-model",value:t.newLyricList[r].content,expression:"newLyricList[index].content"}],attrs:{autofocus:0===r?"autofocus":null,placeholder:"输入新歌词"},domProps:{value:t.newLyricList[r].content},on:{input:[function(e){e.target.composing||t.$set(t.newLyricList[r],"content",e.target.value)},function(e){return t.lyricInputChange(e,r)}],blur:function(e){return t.lyricInputBlur(e,r)}}}),i("span",{staticClass:"error-text"},[t._v(t._s(t.validateResult.contents[r].text))])]),0===t.toneType&&0===r?i("div",{class:!1===t.validateResult.singleTone?"tone-selector check-failed":"tone-selector"},[i("el-select",{staticClass:"selector",attrs:{filterable:"",placeholder:"选择谁来演唱这首歌"},on:{change:t.singleToneIdChange},model:{value:t.singleToneId,callback:function(e){t.singleToneId=e},expression:"singleToneId"}},t._l(t.toneList,(function(t){return i("el-option",{key:t.tone_id+r,attrs:{label:t.display_name,value:t.tone_id}})})),1),null!==t.singleToneId?i("img",{attrs:{src:n("e6ee"),alt:""},on:{click:function(e){return t.playerButtonClick(e,t.singleToneId)}}}):t._e()],1):t._e(),1===t.toneType?i("div",{class:!1===t.validateResult.tone[r]?"tone-selector check-failed":"tone-selector"},[i("el-select",{staticClass:"selector",attrs:{filterable:"",placeholder:"选择谁来演唱这首歌"},on:{change:function(e){return t.toneSelectorChange(e,r)}},model:{value:t.newLyricList[r].toneId,callback:function(e){t.$set(t.newLyricList[r],"toneId",e)},expression:"newLyricList[index].toneId"}},t._l(t.toneList,(function(t){return i("el-option",{key:t.tone_id+r,attrs:{label:t.display_name,value:t.tone_id}})})),1),t.newLyricList.findIndex((function(e){return e.toneId===t.newLyricList[r].toneId}))===r&&null!==t.newLyricList[r].toneId?i("img",{attrs:{src:n("e6ee"),alt:""},on:{click:function(e){return t.playerButtonClick(e,t.newLyricList[r].toneId)}}}):t._e()],1):t._e()])})),i("div",{staticClass:"audio-box"},t._l(t.toneList,(function(t){return i("audio",{key:t.tone_id,attrs:{id:"audio-"+t.tone_id,src:t.audit_url}})})),0)],2)]),i("div",{staticClass:"section"},[t._m(2),i("el-input-number",{staticClass:"bpm-input",attrs:{"controls-position":"right"},on:{input:t.bpmInputChange},model:{value:t.bpm,callback:function(e){t.bpm=e},expression:"bpm"}}),!1===t.validateResult.bpm?i("div",{staticClass:"bpm-error-text"},[t._v("曲速不能超过 50 - 200 (bpm) 的范围")]):t._e()],1),i("div",{staticClass:"section"},[t._m(3),i("el-select",{staticClass:"melody-selector",attrs:{disabled:!0===t.melodySelectorDisable,placeholder:!0===t.melodySelectorDisable?"请选择音源后再选择曲调":""},model:{value:t.melody,callback:function(e){t.melody=e},expression:"melody"}},t._l(t.melodyOptions,(function(t){return i("el-option",{key:t.value,attrs:{label:t.label,value:t.value}})})),1)],1)]),i("div",{staticClass:"footer"},[i("button",{staticClass:"main-button",on:{click:t.prevButtonClick}},[t._v("上一步")]),i("button",{staticClass:"main-button",on:{click:t.confirmButtonClick}},[t._v("确定")])]),i("el-dialog",{attrs:{visible:t.dialogVisible,width:"400px","custom-class":"dialog"},on:{"update:visible":function(e){t.dialogVisible=e}}},[i("div",{staticClass:"dialog-main"},[t._v("请先完善信息后再进行下一步")]),i("div",{staticClass:"dialog-confirm-button",on:{click:function(e){t.dialogVisible=!1}}},[t._v("确定")])])],1)},r=[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"page-title"},[i("img",{staticClass:"step",attrs:{src:n("b9af"),alt:""}}),i("div",{staticClass:"text"},[t._v("改编歌曲")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"title-box"},[n("div",{staticClass:"edit-title"},[n("div",{staticClass:"section-title"},[t._v("编辑歌词")]),n("div",{staticClass:"tips"},[t._v("将原歌词替换成新歌词")])]),n("div",{staticClass:"tone-title"},[n("div",{staticClass:"section-title"},[t._v("选择音源")]),n("div",{staticClass:"tips"},[t._v("选择谁来演唱这首歌")])])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"section-title"},[n("span",[t._v("调节曲速")]),n("span",{staticClass:"melody-tips"},[t._v("(单位: BPM)")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"section-title"},[t._v("选择曲调 "),n("span",{staticClass:"melody-tips"},[t._v("(单位: 1 度代表 1 半音)")])])}],s=(n("99af"),n("a623"),n("7db0"),n("4160"),n("a630"),n("d81d"),n("b64b"),n("d3b7"),n("25f0"),n("3ca3"),n("159b"),n("9d4c"),n("450d"),n("e450")),o=n.n(s),a=(n("a7cc"),n("df33")),u=n.n(a),c=(n("6611"),n("e772")),l=n.n(c),d=(n("1f1a"),n("4e4b")),f=n.n(d),h=(n("10cb"),n("f3ad")),p=n.n(h),m=n("d722"),v=n("096b"),b=n("3dc7"),g=n("b233"),y={name:"Home",components:{"el-input":p.a,"el-select":f.a,"el-option":l.a,"el-dialog":u.a,"el-input-number":o.a,Header:b["a"]},data:function(){return{submitSuccess:!1,edited:!1,maxTone:0,minTone:0,melodySelectorDisable:!0,defaultValue:{},showMelodyTips:!1,singleToneId:null,validateResult:{contents:[],tone:[],bpm:null,singleTone:null},firstSelectTone:!0,musicId:null,toneType:0,newLyricList:[],bpm:50,melody:null,formChecked:!0,dialogVisible:!1,melodyOptions:[],oldLyricList:[],toneList:[]}},watch:{toneType:function(t,e){t!==e&&(this.validateResult.tone=this.oldLyricList.map((function(t){return null})),this.validateResult.singleTone=null,0===t?this.singleToneId?this.melodySelectorDisable=!1:this.melodySelectorDisable=!0:1===t&&(this.newLyricList.every((function(t){return!t.toneId}))?this.melodySelectorDisable=!0:this.melodySelectorDisable=!1))}},created:function(){var t=this,e=parseInt(this.$route.params.musicId),n=this.$route.params.arrangeId,i=sessionStorage.getItem("draftId");this.musicId=e,this.arrangeId=n,this.draftId=i,Object(m["f"])(e).then((function(e){var n=e.data.data;t.toneList=n.tone_list})),n?this.getEditedInfo(n):i?this.getDraftInfo(i):this.getSongInfo()},mounted:function(){var t=this;Object(g["c"])("edit-page-exposure"),window.onbeforeunload=function(e){var n=t.comparisonFormData();if(!0===n)return t.submitDraft(),"您可能有数据没有保存"}},destroyed:function(){window.onbeforeunload=null},methods:{comparisonFormData:function(){var t=this.defaultForm,e=this.getFormData(),n=!1;return JSON.stringify(t)!==JSON.stringify(e)&&(n=!0),n},getDraftInfo:function(t){var e=this;Object(v["c"])(t).then((function(t){var n=t.data.data;e.initFormData(n)}))},getEditedInfo:function(t){var e=this;Object(m["a"])(t).then((function(t){var n=t.data.data;e.initFormData(n)}))},getSongInfo:function(){var t=this,e=this.musicId;Object(m["e"])(e).then((function(e){var n=e.data.data;t.initFormData(n)}))},initLyricData:function(t){this.arrangeId||this.draftId?0===this.toneType?(this.singleToneId=t.new_lyric_list[0].tone_id||null,this.newLyricList=t.new_lyric_list.map((function(t){return{content:t.content,toneId:null}}))):this.newLyricList=t.new_lyric_list.map((function(t){return{content:t.content,toneId:t.tone_id||null}})):this.newLyricList=this.oldLyricList.map((function(t){var e={content:t,toneId:null};return e}))},initFormData:function(t){var e=this,n="normal";this.arrangeId?n="edit":this.draftId&&(n="draft");var i={normal:function(){e.oldLyricList=t.lyric_list,e.bpm=t.avg_bpm,e.maxTone=0,e.minTone=0,e.countAdjust=t.count_adjust||[],e.initLyricData()},edit:function(){var n=t.edit_info;e.maxTone=t.max_tone,e.minTone=t.min_tone,e.bpm=n.bpm,e.melody=n.up_down_tone,e.toneType=n.tone_type,e.oldLyricList=t.lyric_list,e.countAdjust=t.count_adjust||[],e.initLyricData(n)},draft:function(){var n=t.audio_draft_info.content;e.bpm=n.bpm,e.melody=n.up_down_tone,e.toneType=n.tone_type,e.maxTone=n.max_tone,e.minTone=n.min_tone,e.oldLyricList=n.new_lyric_list.map((function(t){return t.content}));var i=e.musicId;Object(m["e"])(i).then((function(t){e.oldLyricList=t.data.data.lyric_list,e.initvalidateData()})),e.countAdjust=t.audio_draft_info.count_adjust||[],e.initLyricData(n)}};i[n](),this.$nextTick((function(){e.melodySelectorDisable=0===e.maxTone&&0===e.minTone})),this.initMelodyOption(),this.initvalidateData(),this.defaultForm=this.getFormData()},submitDraft:function(){var t=this.getFormData(),e=sessionStorage.getItem("draftId"),n=Object.assign({},t,{step:1,draft_id:e||""});Object(v["a"])(n).then((function(t){var e=t.data.data,n=e.draft_id;sessionStorage.setItem("draftId",n)}))},getFormData:function(){var t={music_id:this.musicId,tone_type:this.toneType,new_lyric_list:this.cleansingData(this.newLyricList),bpm:parseInt(this.bpm),up_down_tone:this.melody,max_tone:this.maxTone,min_tone:this.minTone};return t},initvalidateData:function(){this.validateResult={contents:this.oldLyricList.map((function(t){return{status:null,text:""}})),bpm:null,tone:this.oldLyricList.map((function(t){return null})),singleTone:null}},initMelodyOption:function(){for(var t=this.maxTone,e=this.minTone,n=[],i=e;i<=t;i++){var r={value:i};r.label=i>0?"升 ".concat(i," 度"):0===i?"曲调不变(默认)":"降 ".concat(Math.abs(i)," 度"),n.push(r)}this.melodyOptions=n},getMelodyConfig:function(t){var e=this,n=this.musicId;Object(m["b"])(n,t).then((function(t){e.melodySelectorDisable=!1;var n=t.data.data;e.maxTone=parseInt(n.tone_max),e.minTone=parseInt(n.tone_min),e.initMelodyOption(),e.melody=parseInt((e.maxTone+e.minTone)/2)}))},bpmInputChange:function(t){this.checkBpmInput()},toneSelectorChange:function(t,e){!0===this.firstSelectTone&&1===this.toneType&&(log("初次选择音源"),this.newLyricList.forEach((function(e){e.toneId=t})),this.getMelodyConfig(t),this.checkAllToneSelector(),this.firstSelectTone=!1),this.validateResult.tone[e]=!!t},singleToneIdChange:function(t){t?(this.getMelodyConfig(t),this.validateResult.singleTone=!0):this.validateResult.singleTone=!1},lyricInputChange:function(t,e){var n=t.target,i=n.value;this.checkSingleContentInput(i,e);this.edited=!0},lyricInputBlur:function(t,e){var n=t.target;n.value},playerButtonClick:function(t,e){var n=document.querySelectorAll("audio");n.forEach((function(t){t.pause()}));var i=document.querySelector("#audio-".concat(e));i.currentTime=0,i.play()},prevButtonClick:function(){Object(g["c"])("edit-page-prev-button"),this.$router.push("/search")},deleteDraft:function(){var t=sessionStorage.getItem("draftId");Object(v["b"])(t),sessionStorage.setItem("draftId","")},confirmButtonClick:function(){var t=this;Object(g["c"])("edit-page-confirm-button");var e=this.getFormData(),n=this.$route.params.arrangeId;n&&(e.arrange_id=n),log("提交数据",e),this.checkForm(),!0===this.formChecked?Object(m["c"])(e).then((function(n){var i=n.data.data,r=i.polyphonic_list;if(0===r.length)return e.fix_pinyin_list=[],Object(m["g"])(e);sessionStorage.setItem("form",JSON.stringify(e)),sessionStorage.setItem("polyphonicList",JSON.stringify(i.polyphonic_list)),sessionStorage.setItem("editPath",JSON.stringify(t.$router.history.current.path)),t.$router.push("/edit2")})).then((function(e){if(e){e.data.data;t.submitSuccess=!0,t.deleteDraft(),t.$router.push("/profile")}})):this.dialogVisible=!0,this.defaultForm.bpm!==this.bpm&&Object(g["c"])("edit-page-update-bpm"),this.defaultForm.melody!==this.melody&&Object(g["c"])("edit-page-update-melody")},fillValidateResult:function(t,e,n){var i={status:t,text:e};this.validateResult.contents[n]=i},checkBpmInput:function(){var t=this.bpm;this.validateResult.bpm=!(t<50||t>200)},checkSingleContentInput:function(t,e){var n=this.countAdjust.find((function(t){return t.line===e+1})),i={status:!0,text:""};if(this.validateResult.contents[e]=i,0===t.length)return this.fillValidateResult(!1,"请输入歌词",e),this.oldLyricList[e].length;if(!1===/^((?![\u3000-\u303F])[\u2E80-\uFE4F]|\·)*(?![\u3000-\u303F])[\u2E80-\uFE4F](\·)*$/.test(t))return this.fillValidateResult(!1,"只能输入中文",e),this.oldLyricList[e].length;if(n){if(Array.from(t).length!==n.count)return this.fillValidateResult(!1,"".concat(Array.from(t).length,"/").concat(n.count),e),n.count}else if(Array.from(t).length!==Array.from(this.oldLyricList[e]).length)return this.fillValidateResult(!1,"".concat(Array.from(t).length,"/").concat(Array.from(this.oldLyricList[e]).length),e),Array.from(this.oldLyricList[e]).length;return Array.from(this.oldLyricList[e]).length},checkAllContentInput:function(){var t=this;this.newLyricList.forEach((function(e,n){var i=e.content;t.checkSingleContentInput(i,n)}))},checkAllToneSelector:function(){var t=this;0===this.toneType?null!==this.singleToneId?this.validateResult.singleTone=!0:this.validateResult.singleTone=!1:this.newLyricList.forEach((function(e,n){var i=e.toneId;t.validateResult.tone[n]=null!==i}))},checkForm:function(){var t=this;this.checkBpmInput(),this.checkAllContentInput(),this.checkAllToneSelector(),log("validate result",this.validateResult),this.formChecked=!0;var e=this.validateResult;Object.keys(e).forEach((function(n){var i=e[n],r=Object.prototype.toString.call(i);if("[object Array]"===r)for(var s=0;s<i.length;s++){var o=i[s];if("[object Boolean]"===Object.prototype.toString.call(o)){if(!1===o){t.formChecked=!1;break}}else if("[object Object]"===Object.prototype.toString.call(o)&&!1===o.status){t.formChecked=!1;break}}else"[object Boolean]"===r&&!1===i&&(t.formChecked=!1)}))},cleansingData:function(t){var e=this;return t.map((function(t,n){var i={content:t.content};return 0===e.toneType?0===n&&(i.tone_id=e.singleToneId):t.toneId&&(i.tone_id=t.toneId),i}))}}},_=y,A=(n("4d06"),n("8e6f"),n("2877")),L=Object(A["a"])(_,i,r,!1,null,"59b06954",null);e["default"]=L.exports},a50c:function(t,e,n){},a623:function(t,e,n){"use strict";var i=n("23e7"),r=n("b727").every,s=n("a640"),o=n("ae40"),a=s("every"),u=o("every");i({target:"Array",proto:!0,forced:!a||!u},{every:function(t){return r(this,t,arguments.length>1?arguments[1]:void 0)}})},a630:function(t,e,n){var i=n("23e7"),r=n("4df4"),s=n("1c7e"),o=!s((function(t){Array.from(t)}));i({target:"Array",stat:!0,forced:o},{from:r})},b64b:function(t,e,n){var i=n("23e7"),r=n("7b0b"),s=n("df75"),o=n("d039"),a=o((function(){s(1)}));i({target:"Object",stat:!0,forced:a},{keys:function(t){return s(r(t))}})},b727:function(t,e,n){var i=n("0366"),r=n("44ad"),s=n("7b0b"),o=n("50c4"),a=n("65f0"),u=[].push,c=function(t){var e=1==t,n=2==t,c=3==t,l=4==t,d=6==t,f=7==t,h=5==t||d;return function(p,m,v,b){for(var g,y,_=s(p),A=r(_),L=i(m,v,3),I=o(A.length),x=0,C=b||a,S=e?C(p,I):n||f?C(p,0):void 0;I>x;x++)if((h||x in A)&&(g=A[x],y=L(g,x,_),t))if(e)S[x]=y;else if(y)switch(t){case 3:return!0;case 5:return g;case 6:return x;case 2:u.call(S,g)}else switch(t){case 4:return!1;case 7:u.call(S,g)}return d?-1:c||l?l:S}};t.exports={forEach:c(0),map:c(1),filter:c(2),some:c(3),every:c(4),find:c(5),findIndex:c(6),filterOut:c(7)}},b9af:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAArCAMAAAAwqkq2AAAAjVBMVEUAAAAtq/8srf9W4/8trP8srP8sq/8sq/8trP8trP8ztP9Lxv8trP8srP8trf8trv8urv8sq/8sq/8srP8srP8trP8srP8trP8urP8wrv8wrv8sq/8trP8trv8vrf8wsv8xtf8trP8tq/8srf8trf8trP8trP8trP8srP8trf8trP8trP8urf9Av/8sq//3dUWiAAAALnRSTlMAq4UD+7707eN6EQbpuW5FNffm3dbTzVE8KCDHllwxGAqikHJYSrCmnIiHfWMIyHqPAwAAAWhJREFUOMuNlOmWgjAMRiNlEZRFWUREcB8dnb7/483RpMwopeT+4+s9ITQ5QIcob07m2V7mWPEMRtj5nvxj6QdGe7WU78zPBvso+1iD9rfU4Q/YWyVk9d2/Ol1fK629dvF0k1AQ5xik2gsK8XAiumRGUaSxGzzK/5cKPHyfRv9CPXkLLQzbni20hUrU456eaNtsMd0OTaj52Imhbz28clu8p9VQ9T3u1EcaD/W+nz4JP9Ia9QpY0L0XPFvt3J1nl/bLdgOWvZ6rDeaQkJ3tOPZ2gba7ZsizWiL2mdN2TrbLsaMF2dNmXG5DSTjtuL3yVNu+GP/GgyTSEkapCmXXO/5o5DIGRtvqRiYBx7ZRXjyAQUO15yXHDlK6kQo47Km2yf655W5xFM81odkkpqEUOGzR/fQOYMCSSAQB3Uo40XAiPSfdgZM0YJHuqkWFK0cvuuobju5L5AEpRxfO6/GCbZl08qMwu5wAfgEAgWxGqClQhAAAAABJRU5ErkJggg=="},d722:function(t,e,n){"use strict";n.d(e,"d",(function(){return s})),n.d(e,"a",(function(){return o})),n.d(e,"e",(function(){return a})),n.d(e,"f",(function(){return u})),n.d(e,"c",(function(){return c})),n.d(e,"g",(function(){return l})),n.d(e,"b",(function(){return d}));var i=n("a358"),r=i["a"],s=function(t){return r({method:"get",url:"/cgi-bin/musicx/kuwa/search_music",params:t})},o=function(t){return r({method:"get",url:"/cgi-bin/musicx/kuwa/get_music_edit_detail",params:{arrange_id:t}})},a=function(t){return r({method:"get",url:"/cgi-bin/musicx/kuwa/get_music_info",params:{music_id:t}})},u=function(t){return r({method:"get",url:"/cgi-bin/musicx/kuwa/get_music_ext_info",params:{music_id:t}})},c=function(t){return r({method:"post",url:"/cgi-bin/musicx/kuwa/pre_arrange_music",data:t})},l=function(t){return r({method:"post",url:"/cgi-bin/musicx/kuwa/arrange_music",data:t})},d=function(t,e){return r({method:"get",url:"/cgi-bin/musicx/kuwa/tone",params:{music_id:t,singer:e}})}},d81d:function(t,e,n){"use strict";var i=n("23e7"),r=n("b727").map,s=n("1dde"),o=n("ae40"),a=s("map"),u=o("map");i({target:"Array",proto:!0,forced:!a||!u},{map:function(t){return r(this,t,arguments.length>1?arguments[1]:void 0)}})},e450:function(t,e,n){t.exports=function(t){var e={};function n(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(i,r,function(e){return t[e]}.bind(null,r));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/dist/",n(n.s=114)}({0:function(t,e,n){"use strict";function i(t,e,n,i,r,s,o,a){var u,c="function"===typeof t?t.options:t;if(e&&(c.render=e,c.staticRenderFns=n,c._compiled=!0),i&&(c.functional=!0),s&&(c._scopeId="data-v-"+s),o?(u=function(t){t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,t||"undefined"===typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),r&&r.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(o)},c._ssrRegister=u):r&&(u=a?function(){r.call(this,this.$root.$options.shadowRoot)}:r),u)if(c.functional){c._injectStyles=u;var l=c.render;c.render=function(t,e){return u.call(e),l(t,e)}}else{var d=c.beforeCreate;c.beforeCreate=d?[].concat(d,u):[u]}return{exports:t,options:c}}n.d(e,"a",(function(){return i}))},10:function(t,e){t.exports=n("f3ad")},114:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{class:["el-input-number",t.inputNumberSize?"el-input-number--"+t.inputNumberSize:"",{"is-disabled":t.inputNumberDisabled},{"is-without-controls":!t.controls},{"is-controls-right":t.controlsAtRight}],on:{dragstart:function(t){t.preventDefault()}}},[t.controls?n("span",{directives:[{name:"repeat-click",rawName:"v-repeat-click",value:t.decrease,expression:"decrease"}],staticClass:"el-input-number__decrease",class:{"is-disabled":t.minDisabled},attrs:{role:"button"},on:{keydown:function(e){return!("button"in e)&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.decrease(e)}}},[n("i",{class:"el-icon-"+(t.controlsAtRight?"arrow-down":"minus")})]):t._e(),t.controls?n("span",{directives:[{name:"repeat-click",rawName:"v-repeat-click",value:t.increase,expression:"increase"}],staticClass:"el-input-number__increase",class:{"is-disabled":t.maxDisabled},attrs:{role:"button"},on:{keydown:function(e){return!("button"in e)&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.increase(e)}}},[n("i",{class:"el-icon-"+(t.controlsAtRight?"arrow-up":"plus")})]):t._e(),n("el-input",{ref:"input",attrs:{value:t.displayValue,placeholder:t.placeholder,disabled:t.inputNumberDisabled,size:t.inputNumberSize,max:t.max,min:t.min,name:t.name,label:t.label},on:{blur:t.handleBlur,focus:t.handleFocus,input:t.handleInput,change:t.handleInputChange},nativeOn:{keydown:[function(e){return!("button"in e)&&t._k(e.keyCode,"up",38,e.key,["Up","ArrowUp"])?null:(e.preventDefault(),t.increase(e))},function(e){return!("button"in e)&&t._k(e.keyCode,"down",40,e.key,["Down","ArrowDown"])?null:(e.preventDefault(),t.decrease(e))}]}})],1)},r=[];i._withStripped=!0;var s=n(10),o=n.n(s),a=n(22),u=n.n(a),c=n(30),l={name:"ElInputNumber",mixins:[u()("input")],inject:{elForm:{default:""},elFormItem:{default:""}},directives:{repeatClick:c["a"]},components:{ElInput:o.a},props:{step:{type:Number,default:1},stepStrictly:{type:Boolean,default:!1},max:{type:Number,default:1/0},min:{type:Number,default:-1/0},value:{},disabled:Boolean,size:String,controls:{type:Boolean,default:!0},controlsPosition:{type:String,default:""},name:String,label:String,placeholder:String,precision:{type:Number,validator:function(t){return t>=0&&t===parseInt(t,10)}}},data:function(){return{currentValue:0,userInput:null}},watch:{value:{immediate:!0,handler:function(t){var e=void 0===t?t:Number(t);if(void 0!==e){if(isNaN(e))return;if(this.stepStrictly){var n=this.getPrecision(this.step),i=Math.pow(10,n);e=Math.round(e/this.step)*i*this.step/i}void 0!==this.precision&&(e=this.toPrecision(e,this.precision))}e>=this.max&&(e=this.max),e<=this.min&&(e=this.min),this.currentValue=e,this.userInput=null,this.$emit("input",e)}}},computed:{minDisabled:function(){return this._decrease(this.value,this.step)<this.min},maxDisabled:function(){return this._increase(this.value,this.step)>this.max},numPrecision:function(){var t=this.value,e=this.step,n=this.getPrecision,i=this.precision,r=n(e);return void 0!==i?(r>i&&console.warn("[Element Warn][InputNumber]precision should not be less than the decimal places of step"),i):Math.max(n(t),r)},controlsAtRight:function(){return this.controls&&"right"===this.controlsPosition},_elFormItemSize:function(){return(this.elFormItem||{}).elFormItemSize},inputNumberSize:function(){return this.size||this._elFormItemSize||(this.$ELEMENT||{}).size},inputNumberDisabled:function(){return this.disabled||!!(this.elForm||{}).disabled},displayValue:function(){if(null!==this.userInput)return this.userInput;var t=this.currentValue;if("number"===typeof t){if(this.stepStrictly){var e=this.getPrecision(this.step),n=Math.pow(10,e);t=Math.round(t/this.step)*n*this.step/n}void 0!==this.precision&&(t=t.toFixed(this.precision))}return t}},methods:{toPrecision:function(t,e){return void 0===e&&(e=this.numPrecision),parseFloat(Math.round(t*Math.pow(10,e))/Math.pow(10,e))},getPrecision:function(t){if(void 0===t)return 0;var e=t.toString(),n=e.indexOf("."),i=0;return-1!==n&&(i=e.length-n-1),i},_increase:function(t,e){if("number"!==typeof t&&void 0!==t)return this.currentValue;var n=Math.pow(10,this.numPrecision);return this.toPrecision((n*t+n*e)/n)},_decrease:function(t,e){if("number"!==typeof t&&void 0!==t)return this.currentValue;var n=Math.pow(10,this.numPrecision);return this.toPrecision((n*t-n*e)/n)},increase:function(){if(!this.inputNumberDisabled&&!this.maxDisabled){var t=this.value||0,e=this._increase(t,this.step);this.setCurrentValue(e)}},decrease:function(){if(!this.inputNumberDisabled&&!this.minDisabled){var t=this.value||0,e=this._decrease(t,this.step);this.setCurrentValue(e)}},handleBlur:function(t){this.$emit("blur",t)},handleFocus:function(t){this.$emit("focus",t)},setCurrentValue:function(t){var e=this.currentValue;"number"===typeof t&&void 0!==this.precision&&(t=this.toPrecision(t,this.precision)),t>=this.max&&(t=this.max),t<=this.min&&(t=this.min),e!==t&&(this.userInput=null,this.$emit("input",t),this.$emit("change",t,e),this.currentValue=t)},handleInput:function(t){this.userInput=t},handleInputChange:function(t){var e=""===t?void 0:Number(t);isNaN(e)&&""!==t||this.setCurrentValue(e),this.userInput=null},select:function(){this.$refs.input.select()}},mounted:function(){var t=this.$refs.input.$refs.input;t.setAttribute("role","spinbutton"),t.setAttribute("aria-valuemax",this.max),t.setAttribute("aria-valuemin",this.min),t.setAttribute("aria-valuenow",this.currentValue),t.setAttribute("aria-disabled",this.inputNumberDisabled)},updated:function(){if(this.$refs&&this.$refs.input){var t=this.$refs.input.$refs.input;t.setAttribute("aria-valuenow",this.currentValue)}}},d=l,f=n(0),h=Object(f["a"])(d,i,r,!1,null,null,null);h.options.__file="packages/input-number/src/input-number.vue";var p=h.exports;p.install=function(t){t.component(p.name,p)};e["default"]=p},2:function(t,e){t.exports=n("5924")},22:function(t,e){t.exports=n("12f2")},30:function(t,e,n){"use strict";var i=n(2);e["a"]={bind:function(t,e,n){var r=null,s=void 0,o=function(){return n.context[e.expression].apply()},a=function(){Date.now()-s<100&&o(),clearInterval(r),r=null};Object(i["on"])(t,"mousedown",(function(t){0===t.button&&(s=Date.now(),Object(i["once"])(document,"mouseup",a),clearInterval(r),r=setInterval(o,100))}))}}}})},e6ee:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAVFBMVEUAAAAsrP8srP8srP8sq/8trP8sq/8tq/8trP8zv/8sq/8trP8srP8trP8srP8trP8tq/8srf8uq/8urf8urP8uq/8urf8urf8ttP8urv8vrf8sq/+Hb4TNAAAAG3RSTlMAvsT669i6noEK9/bi07Oaj4V6Tk09MhwRXl2GaxmbAAAAb0lEQVQY04XR2QqAIBQE0NE22/d1/v8/i6gbSuKADx4QryMkpszgJiPpUN7wwbR/bdN8MeEMtNG9F5yoAfIL1ACkXGxMihUjjY0HO+SRshGxBurKQRVfq/Rg8PguFwVGkuF/nukpxF+dlOzGFPIdJ64YFV0IWOmGAAAAAElFTkSuQmCC"},e7d2:function(t,e,n){},fdbc:function(t,e){t.exports={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}}}]);
//# sourceMappingURL=chunk-c739b212.98ca893b.js.map