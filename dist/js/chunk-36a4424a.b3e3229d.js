(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-36a4424a"],{"096b":function(t,i,n){"use strict";n.d(i,"a",(function(){return o})),n.d(i,"b",(function(){return a})),n.d(i,"c",(function(){return s}));var r=n("a358"),e=r["a"],o=function(t){return e({method:"post",url:"/cgi-bin/v1/yan/synth/modify_audio_draft",data:t})},a=function(t){return e({method:"post",url:"/cgi-bin/v1/yan/synth/del_audio_draft",data:{draft_id:t}})},s=function(t){return e({method:"post",url:"/cgi-bin/v1/yan/synth/get_audio_draft_detail",data:{draft_id:t}})}},"159b":function(t,i,n){var r=n("da84"),e=n("fdbc"),o=n("17c2"),a=n("9112");for(var s in e){var c=r[s],u=c&&c.prototype;if(u&&u.forEach!==o)try{a(u,"forEach",o)}catch(d){u.forEach=o}}},"17c2":function(t,i,n){"use strict";var r=n("b727").forEach,e=n("a640"),o=n("ae40"),a=e("forEach"),s=o("forEach");t.exports=a&&s?[].forEach:function(t){return r(this,t,arguments.length>1?arguments[1]:void 0)}},4160:function(t,i,n){"use strict";var r=n("23e7"),e=n("17c2");r({target:"Array",proto:!0,forced:[].forEach!=e},{forEach:e})},4326:function(t,i,n){"use strict";n("fbbf")},"4de4":function(t,i,n){"use strict";var r=n("23e7"),e=n("b727").filter,o=n("1dde"),a=n("ae40"),s=o("filter"),c=a("filter");r({target:"Array",proto:!0,forced:!s||!c},{filter:function(t){return e(this,t,arguments.length>1?arguments[1]:void 0)}})},"62a9":function(t,i,n){"use strict";n.r(i);var r=function(){var t=this,i=t.$createElement,n=t._self._c||i;return n("div",{staticClass:"re-edit-page"},[t._m(0),n("div",{staticClass:"tips"},[t._v("您的歌词中含有多音字（标红显示），请确保下面每个字对应的拼音是正确的")]),n("div",{staticClass:"lyric"},t._l(t.lyricList,(function(i,r){return n("div",{key:i.content+r,staticClass:"item"},t._l(Array.from(i.content),(function(i,e){return n("span",{key:i+e},[n("span",{class:t.polyphonicMap[r]&&t.polyphonicMap[r][e]?"strong":""},[t._v(t._s(i))]),t.polyphonicMap[r]&&t.polyphonicMap[r][e]?n("span",{staticClass:"pinyin-selector-box"},[n("span",{staticClass:"bracket"},[t._v("[")]),t._l(t.polyphonicMap[r][e].options,(function(o){return n("span",{key:o+e,class:t.polyphonicMap[r][e].model===o?"selected":""},[n("span",{staticClass:"radio-icon",on:{click:function(i){return t.radioClick(r,e,o)}}}),n("input",{directives:[{name:"model",rawName:"v-model",value:t.polyphonicMap[r][e].model,expression:"polyphonicMap[lineIndex][charIndex].model"}],attrs:{type:"radio",name:i+r+e,hidden:""},domProps:{value:o,checked:t._q(t.polyphonicMap[r][e].model,o)},on:{change:[function(i){return t.$set(t.polyphonicMap[r][e],"model",o)},t.radioChange]}}),n("span",{staticClass:"pinyin",on:{click:function(i){return t.radioClick(r,e,o)}}},[t._v(t._s(o))])])})),n("span",{staticClass:"bracket"},[t._v("]")])],2):t._e()])})),0)})),0),n("div",{staticClass:"footer"},[n("button",{staticClass:"main-button",on:{click:t.prevButtonClick}},[t._v("上一步")]),n("button",{staticClass:"main-button",on:{click:t.confirmButtonClick}},[t._v("完成")])])])},e=[function(){var t=this,i=t.$createElement,r=t._self._c||i;return r("div",{staticClass:"page-title"},[r("img",{staticClass:"step",attrs:{src:n("c2e4"),alt:""}}),r("div",{staticClass:"text"},[t._v("校正歌词")])])}],o=(n("4de4"),n("7db0"),n("4160"),n("d81d"),n("159b"),n("d722")),a=n("096b"),s=n("3dc7"),c=n("b233"),u={name:"Home",components:{Header:s["a"]},data:function(){return{submitSuccess:!1,oldForm:{},lyricList:[],polyphonicList:[],polyphonicMap:{}}},created:function(){var t=sessionStorage.getItem("draftId");t?this.getDraftInfo(t):this.getDefaultInfo()},mounted:function(){var t=this;Object(c["c"])("edit-page-2-exposure"),window.onbeforeunload=function(i){var n=t.comparisonFormData();if(!0===n)return t.submitDraft(),"您可能有数据没有保存"}},destroyed:function(){window.onbeforeunload=null},methods:{getDefaultInfo:function(){this.oldForm=JSON.parse(sessionStorage.getItem("form")),this.polyphonicList=JSON.parse(sessionStorage.getItem("polyphonicList")),this.initFormData()},getDraftInfo:function(t){var i=this;Object(a["c"])(t).then((function(t){var n=t.data.data,r=n.audio_draft_info.content;return i.oldForm=r,Object(o["c"])(r)})).then((function(t){var n=t.data.data;i.polyphonicList=n.polyphonic_list,i.initFormData()}))},initFormData:function(){this.lyricList=this.oldForm.new_lyric_list,this.initPolyphonicMap(),this.defaultForm=this.getFormData()},initPolyphonicMap:function(){var t=this;this.polyphonicList.forEach((function(i){var n=i.x,r=i.y,e=i.pinyin_list;t.polyphonicMap[n]||(t.polyphonicMap[n]={}),t.polyphonicMap[n][r]={options:e},t.oldForm.fix_pinyin_list&&0!==t.oldForm.fix_pinyin_list.length?t.polyphonicMap[n][r].model=t.oldForm.fix_pinyin_list.filter((function(t){return t.x===n})).find((function(t){return t.y===r})).pinyin:t.polyphonicMap[n][r].model=e[0]}))},deleteDraft:function(){var t=sessionStorage.getItem("draftId");Object(a["b"])(t),sessionStorage.setItem("draftId","")},getFormData:function(){var t=this,i=this.polyphonicList.map((function(i){var n=i.x,r=i.y;if(t.polyphonicMap[n][r]){var e=t.polyphonicMap[n][r].model,o={x:n,y:r,pinyin:e};return o}}));return JSON.stringify(i)},comparisonFormData:function(){var t=this.defaultForm,i=this.getFormData(),n=!1;return t!==i&&(n=!0),n},submitDraft:function(){var t=this.oldForm,i=sessionStorage.getItem("draftId"),n=Object.assign({},t,{step:2,draft_id:i||"",fix_pinyin_list:JSON.parse(this.getFormData())});Object(a["a"])(n).then((function(t){var i=t.data.data,n=i.draft_id;sessionStorage.setItem("draftId",n)}))},radioClick:function(t,i,n){this.polyphonicMap[t][i].model=n,this.$forceUpdate()},radioChange:function(){Object(c["c"])("edit-page-2-polyphoic-update"),this.$forceUpdate()},prevButtonClick:function(){Object(c["c"])("edit-page-2-prev-button");var t=sessionStorage.getItem("editPath");t?this.$router.push(JSON.parse(t)):this.$router.push("/edit/"+this.oldForm.music_id)},confirmButtonClick:function(){var t=this;Object(c["c"])("edit-page-2-confirm-button");var i=this.oldForm;i.fix_pinyin_list=JSON.parse(this.getFormData()),Object(o["g"])(i).then((function(i){var n=i.data,r=(n.data,n.ret_code);0===r?(t.deleteDraft(),t.submitSuccess=!0,t.$router.push("/profile")):Message.error(i.data.err_msg)}))}}},d=u,f=(n("4326"),n("2877")),l=Object(f["a"])(d,r,e,!1,null,"1071a414",null);i["default"]=l.exports},"7db0":function(t,i,n){"use strict";var r=n("23e7"),e=n("b727").find,o=n("44d2"),a=n("ae40"),s="find",c=!0,u=a(s);s in[]&&Array(1)[s]((function(){c=!1})),r({target:"Array",proto:!0,forced:c||!u},{find:function(t){return e(this,t,arguments.length>1?arguments[1]:void 0)}}),o(s)},b727:function(t,i,n){var r=n("0366"),e=n("44ad"),o=n("7b0b"),a=n("50c4"),s=n("65f0"),c=[].push,u=function(t){var i=1==t,n=2==t,u=3==t,d=4==t,f=6==t,l=7==t,p=5==t||f;return function(h,m,g,y){for(var v,b,_=o(h),A=e(_),P=r(m,g,3),S=a(A.length),k=0,C=y||s,x=i?C(h,S):n||l?C(h,0):void 0;S>k;k++)if((p||k in A)&&(v=A[k],b=P(v,k,_),t))if(i)x[k]=b;else if(b)switch(t){case 3:return!0;case 5:return v;case 6:return k;case 2:c.call(x,v)}else switch(t){case 4:return!1;case 7:c.call(x,v)}return f?-1:u||d?d:x}};t.exports={forEach:u(0),map:u(1),filter:u(2),some:u(3),every:u(4),find:u(5),findIndex:u(6),filterOut:u(7)}},c2e4:function(t,i){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAsCAMAAAAtr3oOAAAAkFBMVEUAAAAurv8srP9Dxf8sq/8sq/8tq/8srP8srP8urf8trP8ytv8trf8urf8wrv9M4/8srP8tq/8sq/8srP8srP8srP8srP8trP8trP8srP8trP8trP8srP8tq/8srf8srP8trf8xsv8ys/8srP8srP8srP8srP8sq/8trP8urP8trv8srP8vrP8srP8trv8sq/+7WJ8cAAAAL3RSTlMAK+0H+/Pl2r1WTwxlQRcD9+nW0babl3h04M2wp4+JbFsbE8jCraKVcUUygzncXwCFx2UAAAGqSURBVEjHjZXZkoIwEEUju+wgiyACiqC45f//bmrSpMAkaM7b3JzqGrvbFs088ySONN2ID7kXoO+orokXGA//m303MYPyXrddDfOkqzYWkoltm76Hl7TOkjikf9si2zHgMWocCM43HZJCFehHeOsWvdjoq+UdeCrOy7ABfeD1Fl62nyk01uT1HubCpFeS6rwOda5MmmOCyk0fJuQy8R5Gy3/SLcEXtqtEkuyIXknaHiZ4cvapIPZFzrYNaOP9R1HPG233+pp2iLP57s1YGySvH54QSeqxq8rqgNL80scsS6ukwBOpKtf1XAHfCpAU/gX8B5LDgZ0JfUl/hPI3JEkE7WfjDeHE6QnRd2wM29Rzegr3gY2tla/NIK6ekVhz2BxambDxGxNaJj5r4qvqhHCAmIHXa1evx4JD40HxkP6Pah3r5f5/J54YOAazbStTRu1y3qFh8ruRjqKiO0zP7APPQ/YjPGFUdV4PL0zZzlcHsEg1BTOwC6PTevC7FwnkEL5NTHXocsXZ5Ya/x/Ph9XptKVufDQ8sbj/99tiZiqaYXdpyCxo0SXxoEfoD0FNwFFuW6YUAAAAASUVORK5CYII="},d722:function(t,i,n){"use strict";n.d(i,"d",(function(){return o})),n.d(i,"a",(function(){return a})),n.d(i,"e",(function(){return s})),n.d(i,"f",(function(){return c})),n.d(i,"c",(function(){return u})),n.d(i,"g",(function(){return d})),n.d(i,"b",(function(){return f}));var r=n("a358"),e=r["a"],o=function(t){return e({method:"get",url:"/cgi-bin/musicx/kuwa/search_music",params:t})},a=function(t){return e({method:"get",url:"/cgi-bin/musicx/kuwa/get_music_edit_detail",params:{arrange_id:t}})},s=function(t){return e({method:"get",url:"/cgi-bin/musicx/kuwa/get_music_info",params:{music_id:t}})},c=function(t){return e({method:"get",url:"/cgi-bin/musicx/kuwa/get_music_ext_info",params:{music_id:t}})},u=function(t){return e({method:"post",url:"/cgi-bin/musicx/kuwa/pre_arrange_music",data:t})},d=function(t){return e({method:"post",url:"/cgi-bin/musicx/kuwa/arrange_music",data:t})},f=function(t,i){return e({method:"get",url:"/cgi-bin/musicx/kuwa/tone",params:{music_id:t,singer:i}})}},d81d:function(t,i,n){"use strict";var r=n("23e7"),e=n("b727").map,o=n("1dde"),a=n("ae40"),s=o("map"),c=a("map");r({target:"Array",proto:!0,forced:!s||!c},{map:function(t){return e(this,t,arguments.length>1?arguments[1]:void 0)}})},fbbf:function(t,i,n){},fdbc:function(t,i){t.exports={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}}}]);
//# sourceMappingURL=chunk-36a4424a.b3e3229d.js.map