(function(t){function e(e){for(var o,a,s=e[0],r=e[1],u=e[2],d=0,l=[];d<s.length;d++)a=s[d],Object.prototype.hasOwnProperty.call(i,a)&&i[a]&&l.push(i[a][0]),i[a]=0;for(o in r)Object.prototype.hasOwnProperty.call(r,o)&&(t[o]=r[o]);f&&f(e);while(l.length)l.shift()();return c.push.apply(c,u||[]),n()}function n(){for(var t,e=0;e<c.length;e++){for(var n=c[e],o=!0,a=1;a<n.length;a++){var s=n[a];0!==i[s]&&(o=!1)}o&&(c.splice(e--,1),t=r(r.s=n[0]))}return t}var o={},a={app:0},i={app:0},c=[];function s(t){return r.p+"js/"+({}[t]||t)+"."+{"chunk-27d35730":"424d06c2","chunk-4ee74866":"858d81c9","chunk-5961b19c":"7e969076","chunk-68b8805b":"59d28875","chunk-75c21f4a":"5fe9ffe8","chunk-783829b8":"57508299","chunk-93dff0b4":"bb9c17ac","chunk-00a64d95":"1d9fc1c5","chunk-a10b38c6":"10d5fb79","chunk-aa6e5fe0":"227e6ddd","chunk-19fa1fd5":"8e7e7b49","chunk-1a52210a":"5c590747","chunk-96aedf96":"deff23ef","chunk-4be1e144":"d258eaaa","chunk-dee42d1e":"2518104a","chunk-ea4fbbd2":"fa7787d5"}[t]+".js"}function r(e){if(o[e])return o[e].exports;var n=o[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,r),n.l=!0,n.exports}r.e=function(t){var e=[],n={"chunk-27d35730":1,"chunk-4ee74866":1,"chunk-5961b19c":1,"chunk-68b8805b":1,"chunk-75c21f4a":1,"chunk-783829b8":1,"chunk-93dff0b4":1,"chunk-00a64d95":1,"chunk-a10b38c6":1,"chunk-19fa1fd5":1,"chunk-1a52210a":1,"chunk-96aedf96":1,"chunk-4be1e144":1,"chunk-dee42d1e":1,"chunk-ea4fbbd2":1};a[t]?e.push(a[t]):0!==a[t]&&n[t]&&e.push(a[t]=new Promise((function(e,n){for(var o="css/"+({}[t]||t)+"."+{"chunk-27d35730":"ea51d8d9","chunk-4ee74866":"47d876f4","chunk-5961b19c":"a08f34f4","chunk-68b8805b":"a3f0c1b6","chunk-75c21f4a":"15c56dd9","chunk-783829b8":"67af4f4c","chunk-93dff0b4":"15766772","chunk-00a64d95":"2ed57cd4","chunk-a10b38c6":"52f18c27","chunk-aa6e5fe0":"31d6cfe0","chunk-19fa1fd5":"77ec4167","chunk-1a52210a":"f81e94bd","chunk-96aedf96":"234e782d","chunk-4be1e144":"648d75fb","chunk-dee42d1e":"287d3c7d","chunk-ea4fbbd2":"810c79ab"}[t]+".css",i=r.p+o,c=document.getElementsByTagName("link"),s=0;s<c.length;s++){var u=c[s],d=u.getAttribute("data-href")||u.getAttribute("href");if("stylesheet"===u.rel&&(d===o||d===i))return e()}var l=document.getElementsByTagName("style");for(s=0;s<l.length;s++){u=l[s],d=u.getAttribute("data-href");if(d===o||d===i)return e()}var f=document.createElement("link");f.rel="stylesheet",f.type="text/css",f.onload=e,f.onerror=function(e){var o=e&&e.target&&e.target.src||i,c=new Error("Loading CSS chunk "+t+" failed.\n("+o+")");c.code="CSS_CHUNK_LOAD_FAILED",c.request=o,delete a[t],f.parentNode.removeChild(f),n(c)},f.href=i;var h=document.getElementsByTagName("head")[0];h.appendChild(f)})).then((function(){a[t]=0})));var o=i[t];if(0!==o)if(o)e.push(o[2]);else{var c=new Promise((function(e,n){o=i[t]=[e,n]}));e.push(o[2]=c);var u,d=document.createElement("script");d.charset="utf-8",d.timeout=120,r.nc&&d.setAttribute("nonce",r.nc),d.src=s(t);var l=new Error;u=function(e){d.onerror=d.onload=null,clearTimeout(f);var n=i[t];if(0!==n){if(n){var o=e&&("load"===e.type?"missing":e.type),a=e&&e.target&&e.target.src;l.message="Loading chunk "+t+" failed.\n("+o+": "+a+")",l.name="ChunkLoadError",l.type=o,l.request=a,n[1](l)}i[t]=void 0}};var f=setTimeout((function(){u({type:"timeout",target:d})}),12e4);d.onerror=d.onload=u,document.head.appendChild(d)}return Promise.all(e)},r.m=t,r.c=o,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="/",r.oe=function(t){throw console.error(t),t};var u=window["webpackJsonp"]=window["webpackJsonp"]||[],d=u.push.bind(u);u.push=e,u=u.slice();for(var l=0;l<u.length;l++)e(u[l]);var f=d;c.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"0804":function(t,e,n){"use strict";n.d(e,"a",(function(){return a})),n.d(e,"c",(function(){return i})),n.d(e,"b",(function(){return c}));var o=[{pitch:45,str:"A2",type:0,show:0},{pitch:46,str:"A2#",type:1,show:0},{pitch:47,str:"B2",type:0,show:0},{pitch:48,str:"C3",type:0,show:1},{pitch:49,str:"C3#",type:1,show:0},{pitch:50,str:"D3",type:0,show:0},{pitch:51,str:"D3#",type:1,show:0},{pitch:52,str:"E3",type:0,show:0},{pitch:53,str:"F3",type:0,show:0},{pitch:54,str:"F3#",type:1,show:0},{pitch:55,str:"G3",type:0,show:0},{pitch:56,str:"G3#",type:1,show:0},{pitch:57,str:"A3",type:0,show:0},{pitch:58,str:"A3#",type:1,show:0},{pitch:59,str:"B3",type:0,show:0},{pitch:60,str:"C4",type:0,show:1},{pitch:61,str:"C4#",type:1,show:0},{pitch:62,str:"D4",type:0,show:0},{pitch:63,str:"D4#",type:1,show:0},{pitch:64,str:"E4",type:0,show:0},{pitch:65,str:"F4",type:0,show:0},{pitch:66,str:"F4#",type:1,show:0},{pitch:67,str:"G4",type:0,show:0},{pitch:68,str:"G4#",type:1,show:0},{pitch:69,str:"A4",type:0,show:0},{pitch:70,str:"A4#",type:1,show:0},{pitch:71,str:"B4",type:0,show:0},{pitch:72,str:"C5",type:0,show:1},{pitch:73,str:"C5#",type:1,show:0},{pitch:74,str:"D5",type:0,show:0},{pitch:75,str:"D5#",type:1,show:0},{pitch:76,str:"E5",type:0,show:0},{pitch:77,str:"F5",type:0,show:0},{pitch:78,str:"F5#",type:1,show:0},{pitch:79,str:"G5",type:0,show:0},{pitch:80,str:"G5#",type:1,show:0},{pitch:81,str:"A5",type:0,show:0}],a=o.reverse(),i={0:0,1:15,2:30,3:80,4:100},c={StateNone:0,StatePlaying:1,StatePaused:2,StateEnded:3}},3998:function(t,e,n){"use strict";n("d200")},"3b61":function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAYCAMAAABdhlSLAAAAnFBMVEUAAAD7Sij7SSf7SSf/VSv6SSb////6YkT6WTn++fj+2tL8kHv6VTX91Mv8sKH7eF/7bE/6TSv+6OT9ysD9tqj8s6T+8/D8lYH6Zkj6UjH+/Pz+9fP+4tz9zsT9y8H9w7f8rp77clf6X0H918/7fWT+7+z+7ur8oY/7iXP7g2v7f2f7cFT+3tj9xrv8qZn8nIn7jnj7h3D7dlz9uq1QyqGwAAAABXRSTlMAgOaIBphkq+4AAAFFSURBVDjLpZTpjoIwEIB3wZm2QNWCIKdyed/u+7/bDojBGEwgfj8mneTLDLTT/tSMdA16oOmjh69DT/SHr/X1tYcPvfnK51azYFvWKvmFf/ClPc3Sv5P0EMeUpkuihAlO3/zfZ/3EuxvSCeW+bjRbEPt3v9XBVyywLCtyKShokDEei8JvsledCcklNsyBzSvM4IaHtkWrE6WQe9M0RULBhy1WeGAiz1qf9JbsAISX1knAioSxHDaoPvlsAifDCNeGsaFMict2BuB6cEe/63sgFYFtO0REXrUx1zCHYkGrrv8FtVqCPQYirnx3DVykOW6gxLxrP29Yvvg8ipMQozMy2CHvOq9kpcA+jgmP/APG7m7qCIc6hapjHoI11bZXBiHIh7qmG7GzQLdzfpQFYE6AuFJsimTAd/6389ybofdx6H0f+p78A+seJKSa9MxvAAAAAElFTkSuQmCC"},"3dc7":function(t,e,n){"use strict";var o=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"header"},[o("div",{staticClass:"main"},[o("img",{attrs:{src:n("cf05"),alt:""},on:{click:t.openHomePage}}),o("div",{staticClass:"header-text",on:{click:t.openHomePage}},[t._v("盐料视频 - 百万调音合成工具")]),o("div",{staticClass:"beta-icon",on:{click:t.openHomePage}},[t._v("Beta")])]),t._m(0),t.mxIsLogin||t.nickName?o("div",{staticClass:"user-info"},[o("img",{staticClass:"user-ava",attrs:{src:t.userLogo,alt:""},on:{click:function(e){return t.openProfilePage("im")}}}),o("div",{staticClass:"user-name",on:{click:function(e){return t.openProfilePage("name")}}},[t._v(t._s(t.nickName))]),t.showBind||"/profile"!==t.currentPath?t._e():o("button",{staticClass:"user-info-button",on:{click:t.bindKugou}},[t._v("绑定酷狗账号")]),"/profile"===t.currentPath?o("button",{staticClass:"user-info-button",on:{click:t.logoutButtonClick}},[t._v("退出登录")]):t._e()]):o("button",{staticClass:"login-button",on:{click:t.loginButtonClick}},[t._v("登录")]),o("el-dialog",{attrs:{visible:t.loginDialogShow,width:"400px","custom-class":"login-dialog",top:"15%","before-close":t.loginDialogBeforeClose},on:{"update:visible":function(e){t.loginDialogShow=e},open:t.loginDialogOpen}},[o("div",{staticClass:"login-dialog-title"},[t._v("账号登录")]),o("el-form",{ref:"loginForm",attrs:{model:t.loginForm,rules:t.rules}},[o("el-form-item",{attrs:{prop:"phone"}},[o("el-input",{staticClass:"phone-number-input",attrs:{placeholder:"请输入手机号"},model:{value:t.loginForm.phone,callback:function(e){t.$set(t.loginForm,"phone",e)},expression:"loginForm.phone"}})],1),o("el-form-item",{attrs:{prop:"authCode"}},[o("div",{staticClass:"auth-code-input-box"},[o("el-input",{staticClass:"auth-code-input",attrs:{placeholder:"请输入验证码"},model:{value:t.loginForm.authCode,callback:function(e){t.$set(t.loginForm,"authCode",e)},expression:"loginForm.authCode"}}),60===t.timeLeft?o("div",{staticClass:"get-auth-code-button",on:{click:t.getAuthCode}},[t._v(t._s(t.sendAuthCodeText))]):t._e(),t.timeLeft<=59?o("div",{staticClass:"get-auth-code-button"},[t._v(t._s(t.sendAuthCodeText)+"("+t._s(t.timeLeft)+"s)")]):t._e()],1)])],1),o("button",{staticClass:"login-confirm-button",on:{click:t.confirmLoginButtonClick}},[t._v("登录")]),o("div",{staticClass:"login-tips"},[o("div",[t._v("未注册的手机号将帮您注册新账号，登录即代表")]),o("div",[t._v("您同意 "),o("a",{attrs:{href:"/userAgreement",target:"_blank"}},[t._v("用户协议")]),t._v(" 和 "),o("a",{attrs:{href:"/privacyPolicy",target:"_blank"}},[t._v("隐私政策")])])])],1),o("el-dialog",{attrs:{visible:t.logoutDialogShow,width:"400px","custom-class":"logout-dialog",top:"15%"},on:{"update:visible":function(e){t.logoutDialogShow=e}}},[o("div",{staticClass:"logout-dialog-title"},[t._v("确定退出登录吗?")]),o("div",{staticClass:"logout-footer"},[o("button",{staticClass:"logout-confirm-button logout-button",on:{click:t.confirmLogoutButtonClick}},[t._v("确定")]),o("button",{staticClass:"logout-cancel-button logout-button",on:{click:function(e){t.logoutDialogShow=!1}}},[t._v("取消")])])]),o("el-dialog",{attrs:{visible:t.kugouBindShow,width:"400px","custom-class":"logout-dialog",top:"15%"},on:{"update:visible":function(e){t.kugouBindShow=e}}},[o("img",{staticClass:"success-icon",attrs:{src:n("7ad9"),alt:"success-icon"}}),o("div",{staticClass:"bind-success__title"},[t._v("绑定成功")]),o("div",{staticClass:"bind-success__kugou"},[t._v("您已经绑定酷狗音乐账号")]),o("div",{staticClass:"bind-success__nickname"},[t._v(t._s(t.kugouNickName))]),o("div",[t._v("绑定有效期为3个月, 超过有效期重新绑定")]),o("div",{staticClass:"bind-success__validity"},[t._v("在个人主页发布视频同步到酷狗可获得"),o("a",{attrs:{href:"/playIncentives",target:"_blank",title:"播放激励"}},[t._v("播放激励")])])])],1)},a=[function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("a",{staticClass:"subhead",attrs:{href:"/activityPage",target:"_blank"}},[o("div",{staticClass:"subhead-text"},[t._v("爆款视频悬赏活动")]),o("img",{attrs:{src:n("3b61"),alt:""}})])}],i=(n("99af"),n("0fb7"),n("450d"),n("f529")),c=n.n(i),s=(n("eca7"),n("3787")),r=n.n(s),u=(n("425f"),n("4105")),d=n.n(u),l=(n("10cb"),n("f3ad")),f=n.n(l),h=(n("a7cc"),n("df33")),p=n.n(h),g=n("b233"),b=n("7ded"),m=n("a358"),v=m["a"],k=function(t){return v({method:"post",url:"/cgi-bin/v1/yan/kugou/bind",data:{code:t}})},j=function(){return v({method:"post",url:"/cgi-bin/v1/yan/kugou/show"})},y={props:{currentPath:String,loginDialogShow:Boolean,openLoginDialog:Function,closeLoginDialog:Function},components:{"el-dialog":p.a,"el-input":f.a,"el-form":d.a,"el-form-item":r.a},data:function(){var t=this;return{sendAuthCodeText:"获取验证码",validatePass:"",nickName:"",kugouNickName:"",userLogo:"",timeLeft:60,logoutDialogShow:!1,loginForm:{phone:"",authCode:""},mxIsLogin:Object(g["a"])("mx_is_login"),showBind:1,kugouBindShow:!1,code:Object(g["b"])().code,rules:{phone:[{required:!0,message:"请输入正确的手机号码",pattern:/^1[3-9]\d{9}$/,trigger:"submit"}],authCode:[{required:!0,message:"请输入正确的验证码",pattern:/^\d{6}$/,trigger:"submit"},{validator:function(e,n,o){var a={phone:t.loginForm.phone,code:t.loginForm.authCode};Object(b["b"])(a).then((function(t){var e=t.data.data,n=e.code;e.msg;0!==n?o("请输入正确的验证码"):(c.a.success("登录成功"),setTimeout((function(){o()}),500))}))},trigger:"submit"}]}}},mounted:function(){this.toGetUserInfo(),this.toShowBindKugou(),this.toBindKugouAccrossCode()},methods:{toGetUserInfo:function(){var t=this;Object(b["d"])().then((function(e){var n=e.data,o=n.data,a=n.ret_code;1e5===a?t.openLoginDialog():1e5!==a&&null!==o&&(sessionStorage.setItem("userInfo",JSON.stringify(o)),t.nickName=o.nick_name,t.userLogo=o.user_logo)}))},openHomePage:function(){this.$router.push("/")},loginDialogBeforeClose:function(){this.closeLoginDialog()},openProfilePage:function(t){var e=this.$router.history.current.path;Object(g["e"])("user_".concat(t,"_click"),"user_".concat(t,"_click"),{path:e}),this.$router.push("/profile")},loginDialogOpen:function(){Object(g["e"])("login-page-exposure")},loginButtonClick:function(){this.openLoginDialog()},logoutButtonClick:function(){Object(g["e"])("logout-button"),this.logoutDialogShow=!0},getAuthCode:function(){var t=this;log("getAuthCode"),this.$refs.loginForm.validateField("phone",(function(e){if(""===e){var n=t.loginForm.phone;Object(b["a"])(n).then((function(e){log("fetchAuthCode",e);var n=e.data.data,o=n.code,a=n.msg;if(0===o){t.sendAuthCodeText="重新发送",c.a.success("验证码发送成功 !"),t.timeLeft=59;var i=setInterval((function(){t.timeLeft>0?t.timeLeft--:(t.timeLeft=60,clearInterval(i))}),1e3)}else c.a.error("[".concat(o,"]: ").concat(a))}))}}))},confirmLoginButtonClick:function(){this.$refs.loginForm.validate((function(t){!0===t&&location.reload()}))},confirmLogoutButtonClick:function(){Object(b["c"])().then((function(t){var e=t.data,n=e.data,o=e.ret_code;if(1e5!==o){var a=n.code,i=n.msg;0===a?location.href=location.origin:c.a.error("[".concat(a,"]: ").concat(i))}else location.href=location.origin}))},bindKugou:function(){Object(g["e"])("person-page-userconnect_button");var t="https://h5.kugou.com/apps/vo-activity/1559c530-3925-11eb-b63e-b5551d784bc1/index.html?openappid=10073&url=".concat(encodeURIComponent("https://test-yan.qq.com"),"&scpoe=").concat(encodeURIComponent("userinfo|upload")),e="https://h5.kugou.com/apps/vo-activity/1559c530-3925-11eb-b63e-b5551d784bc1/index.html?openappid=10076&url=".concat(encodeURIComponent("https://yan.qq.com"),"&scpoe=").concat(encodeURIComponent("userinfo|upload"));g["c"]?location.href=t:location.href=e,console.log("location.href:",location.href)},toBindKugouAccrossCode:function(){var t=this;this.code&&(this.kugouBindShow=!0,k(this.code).then((function(e){var n=e.data,o=n.data,a=n.ret_code;console.log("bindKugou:",e),0===a?(t.kugouNickName=o.nickname,t.toShowBindKugou()):t.toGetUserInfo()})))},toShowBindKugou:function(){var t=this;j().then((function(e){var n=e.data,o=n.data,a=n.ret_code;0===a&&null!==o&&(t.showBind=o.show_bind,t.$store.dispatch("updateShowBindKugou",t.showBind))}))},toAudioEditor:function(){this.$router.push("/audioEditor")}}},w=y,A=(n("3998"),n("5b32"),n("2877")),C=Object(A["a"])(w,o,a,!1,null,"721fd2f2",null);e["a"]=C.exports},"437b":function(t,e,n){},4412:function(t,e,n){t.exports=n.p+"img/bg-home.9813db74.png"},4678:function(t,e,n){var o={"./af":"2bfb","./af.js":"2bfb","./ar":"8e73","./ar-dz":"a356","./ar-dz.js":"a356","./ar-kw":"423e","./ar-kw.js":"423e","./ar-ly":"1cfd","./ar-ly.js":"1cfd","./ar-ma":"0a84","./ar-ma.js":"0a84","./ar-sa":"8230","./ar-sa.js":"8230","./ar-tn":"6d83","./ar-tn.js":"6d83","./ar.js":"8e73","./az":"485c","./az.js":"485c","./be":"1fc1","./be.js":"1fc1","./bg":"84aa","./bg.js":"84aa","./bm":"a7fa","./bm.js":"a7fa","./bn":"9043","./bn-bd":"9686","./bn-bd.js":"9686","./bn.js":"9043","./bo":"d26a","./bo.js":"d26a","./br":"6887","./br.js":"6887","./bs":"2554","./bs.js":"2554","./ca":"d716","./ca.js":"d716","./cs":"3c0d","./cs.js":"3c0d","./cv":"03ec","./cv.js":"03ec","./cy":"9797","./cy.js":"9797","./da":"0f14","./da.js":"0f14","./de":"b469","./de-at":"b3eb","./de-at.js":"b3eb","./de-ch":"bb71","./de-ch.js":"bb71","./de.js":"b469","./dv":"598a","./dv.js":"598a","./el":"8d47","./el.js":"8d47","./en-au":"0e6b","./en-au.js":"0e6b","./en-ca":"3886","./en-ca.js":"3886","./en-gb":"39a6","./en-gb.js":"39a6","./en-ie":"e1d3","./en-ie.js":"e1d3","./en-il":"7333","./en-il.js":"7333","./en-in":"ec2e","./en-in.js":"ec2e","./en-nz":"6f50","./en-nz.js":"6f50","./en-sg":"b7e9","./en-sg.js":"b7e9","./eo":"65db","./eo.js":"65db","./es":"898b","./es-do":"0a3c","./es-do.js":"0a3c","./es-mx":"b5b7","./es-mx.js":"b5b7","./es-us":"55c9","./es-us.js":"55c9","./es.js":"898b","./et":"ec18","./et.js":"ec18","./eu":"0ff2","./eu.js":"0ff2","./fa":"8df4","./fa.js":"8df4","./fi":"81e9","./fi.js":"81e9","./fil":"d69a","./fil.js":"d69a","./fo":"0721","./fo.js":"0721","./fr":"9f26","./fr-ca":"d9f8","./fr-ca.js":"d9f8","./fr-ch":"0e49","./fr-ch.js":"0e49","./fr.js":"9f26","./fy":"7118","./fy.js":"7118","./ga":"5120","./ga.js":"5120","./gd":"f6b4","./gd.js":"f6b4","./gl":"8840","./gl.js":"8840","./gom-deva":"aaf2","./gom-deva.js":"aaf2","./gom-latn":"0caa","./gom-latn.js":"0caa","./gu":"e0c5","./gu.js":"e0c5","./he":"c7aa","./he.js":"c7aa","./hi":"dc4d","./hi.js":"dc4d","./hr":"4ba9","./hr.js":"4ba9","./hu":"5b14","./hu.js":"5b14","./hy-am":"d6b6","./hy-am.js":"d6b6","./id":"5038","./id.js":"5038","./is":"0558","./is.js":"0558","./it":"6e98","./it-ch":"6f12","./it-ch.js":"6f12","./it.js":"6e98","./ja":"079e","./ja.js":"079e","./jv":"b540","./jv.js":"b540","./ka":"201b","./ka.js":"201b","./kk":"6d79","./kk.js":"6d79","./km":"e81d","./km.js":"e81d","./kn":"3e92","./kn.js":"3e92","./ko":"22f8","./ko.js":"22f8","./ku":"2421","./ku.js":"2421","./ky":"9609","./ky.js":"9609","./lb":"440c","./lb.js":"440c","./lo":"b29d","./lo.js":"b29d","./lt":"26f9","./lt.js":"26f9","./lv":"b97c","./lv.js":"b97c","./me":"293c","./me.js":"293c","./mi":"688b","./mi.js":"688b","./mk":"6909","./mk.js":"6909","./ml":"02fb","./ml.js":"02fb","./mn":"958b","./mn.js":"958b","./mr":"39bd","./mr.js":"39bd","./ms":"ebe4","./ms-my":"6403","./ms-my.js":"6403","./ms.js":"ebe4","./mt":"1b45","./mt.js":"1b45","./my":"8689","./my.js":"8689","./nb":"6ce3","./nb.js":"6ce3","./ne":"3a39","./ne.js":"3a39","./nl":"facd","./nl-be":"db29","./nl-be.js":"db29","./nl.js":"facd","./nn":"b84c","./nn.js":"b84c","./oc-lnc":"167b","./oc-lnc.js":"167b","./pa-in":"f3ff","./pa-in.js":"f3ff","./pl":"8d57","./pl.js":"8d57","./pt":"f260","./pt-br":"d2d4","./pt-br.js":"d2d4","./pt.js":"f260","./ro":"972c","./ro.js":"972c","./ru":"957c","./ru.js":"957c","./sd":"6784","./sd.js":"6784","./se":"ffff","./se.js":"ffff","./si":"eda5","./si.js":"eda5","./sk":"7be6","./sk.js":"7be6","./sl":"8155","./sl.js":"8155","./sq":"c8f3","./sq.js":"c8f3","./sr":"cf1e","./sr-cyrl":"13e9","./sr-cyrl.js":"13e9","./sr.js":"cf1e","./ss":"52bd","./ss.js":"52bd","./sv":"5fbd","./sv.js":"5fbd","./sw":"74dc","./sw.js":"74dc","./ta":"3de5","./ta.js":"3de5","./te":"5cbb","./te.js":"5cbb","./tet":"576c","./tet.js":"576c","./tg":"3b1b","./tg.js":"3b1b","./th":"10e8","./th.js":"10e8","./tk":"5aff","./tk.js":"5aff","./tl-ph":"0f38","./tl-ph.js":"0f38","./tlh":"cf75","./tlh.js":"cf75","./tr":"0e81","./tr.js":"0e81","./tzl":"cf51","./tzl.js":"cf51","./tzm":"c109","./tzm-latn":"b53d","./tzm-latn.js":"b53d","./tzm.js":"c109","./ug-cn":"6117","./ug-cn.js":"6117","./uk":"ada2","./uk.js":"ada2","./ur":"5294","./ur.js":"5294","./uz":"2e8c","./uz-latn":"010e","./uz-latn.js":"010e","./uz.js":"2e8c","./vi":"2921","./vi.js":"2921","./x-pseudo":"fd7e","./x-pseudo.js":"fd7e","./yo":"7f33","./yo.js":"7f33","./zh-cn":"5c3a","./zh-cn.js":"5c3a","./zh-hk":"49ab","./zh-hk.js":"49ab","./zh-mo":"3a6c","./zh-mo.js":"3a6c","./zh-tw":"90ea","./zh-tw.js":"90ea"};function a(t){var e=i(t);return n(e)}function i(t){if(!n.o(o,t)){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}return o[t]}a.keys=function(){return Object.keys(o)},a.resolve=i,t.exports=a,a.id="4678"},"56d7":function(t,e,n){"use strict";n.r(e);n("b0c0"),n("e260"),n("e6cf"),n("cca6"),n("a79d");var o=n("2b0e"),a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{style:{backgroundImage:"url("+t.pageBg+")"},attrs:{id:"app"}},["noLogin"!==t.$router.history.current.meta.auth||"/"===t.$router.history.current.path?n("Header",{ref:"header",attrs:{currentPath:t.$router.history.current.path,loginDialogShow:t.loginDialogShow,openLoginDialog:t.openLoginDialog,closeLoginDialog:t.closeLoginDialog}}):t._e(),n("router-view",{on:{changeBg:t.changeBg,openLoginDialog:t.openLoginDialog}}),"noLogin"!==t.$router.history.current.meta.auth||"/"===t.$router.history.current.path?n("Footer"):t._e()],1)},i=[],c=n("3dc7"),s=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},r=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"footer"},[n("div",{staticClass:"footer-link"},[n("a",{staticClass:"footer-link-box",attrs:{href:"https://support.qq.com/product/295341",title:"用户反馈论坛",target:"_blank"}},[t._v("用户反馈论坛")]),n("a",{staticClass:"footer-link-box",attrs:{href:"https://www.tencentmusic.com/zh-cn/contact.html",target:"_blank",title:"联系我们"}},[t._v("联系我们")]),n("a",{staticClass:"footer-link-box",attrs:{href:"/userAgreement",target:"_blank",title:"服务协议"}},[t._v("服务协议")]),n("a",{staticClass:"footer-link-box",attrs:{href:"/privacypolicy",target:"_blank",title:"隐私政策"}},[t._v("隐私政策")]),n("a",{staticClass:"footer-link-box",attrs:{href:"https://www.tencentmusic.com/zh-cn/right.html",title:"权利声明",target:"_blank"}},[t._v("权利声明")]),n("a",{staticClass:"footer-link-box",attrs:{href:"https://www.tencentmusic.com/zh-cn/whistleblower.html",title:"监督举报",target:"_blank"}},[t._v("监督举报")]),n("a",{staticClass:"footer-link-box",attrs:{href:"https://beian.miit.gov.cn",target:"_blank",rel:"nofollow",title:"粤ICP备17078037号"}},[t._v("粤ICP备17078037号")]),n("a",{attrs:{target:"_blank",href:"http://wpa.qq.com/msgrd?v=3&uin=291243638&site=qq&menu=yes"}},[n("img",{attrs:{border:"0",src:"http://wpa.qq.com/pa?p=2:291243638:51",alt:"点击这里给我发消息",title:"点击这里给我发消息"}})])]),n("div",{staticClass:"footer-copyright"},[t._v("© 2016 - 2020 腾讯音乐娱乐（深圳）有限公司 版权所有")]),n("div",{staticClass:"footer-copyright"},[t._v("创作工具交流QQ：291243638")])])}],u={components:{},data:function(){return{}},mounted:function(){},methods:{}},d=u,l=(n("8fc2"),n("2877")),f=Object(l["a"])(d,s,r,!1,null,"7f8fedcf",null),h=f.exports,p=n("4412"),g=n.n(p),b=n("d68e"),m=n.n(b),v=n("db43"),k=n.n(v),j={name:"App",components:{Header:c["a"],Footer:h},data:function(){return{pageBg:"",loginDialogShow:!1}},mounted:function(){},computed:{},methods:{changeBg:function(t){this.pageBg=0===t?g.a:1===t?m.a:k.a},openLoginDialog:function(){this.loginDialogShow=!0},closeLoginDialog:function(){this.loginDialogShow=!1}}},y=j,w=(n("c8de"),Object(l["a"])(y,a,i,!1,null,null,null)),A=w.exports,C=(n("d3b7"),n("8c4f"));o["default"].use(C["a"]);var _=[{path:"/",name:"Home",meta:{auth:"noLogin"},component:function(){return n.e("chunk-ea4fbbd2").then(n.bind(null,"ed00"))}},{path:"/search",name:"Search",meta:{rank:2},component:function(){return Promise.all([n.e("chunk-aa6e5fe0"),n.e("chunk-19fa1fd5"),n.e("chunk-96aedf96")]).then(n.bind(null,"f2c2"))}},{path:"/edit/:musicId/:arrangeId?/:toneId?",name:"Edit",meta:{rank:3},component:function(){return Promise.all([n.e("chunk-aa6e5fe0"),n.e("chunk-93dff0b4"),n.e("chunk-4be1e144")]).then(n.bind(null,"e151"))}},{path:"/rectify",name:"Rectify",meta:{rank:4},component:function(){return n.e("chunk-75c21f4a").then(n.bind(null,"af83"))}},{path:"/exception",name:"Exception",meta:{rank:2},component:function(){return n.e("chunk-dee42d1e").then(n.bind(null,"230f"))}},{path:"/profile",name:"Profile",meta:{rank:1},component:function(){return Promise.all([n.e("chunk-aa6e5fe0"),n.e("chunk-19fa1fd5"),n.e("chunk-1a52210a")]).then(n.bind(null,"246c"))}},{path:"/audio/:arrangeId",name:"Audio",meta:{rank:2},component:function(){return n.e("chunk-68b8805b").then(n.bind(null,"c662"))}},{path:"/videoUpload",name:"VideoUpload",meta:{},component:function(){return n.e("chunk-5961b19c").then(n.bind(null,"cd4a"))}},{path:"/activityPage",name:"ActivityPage",meta:{auth:"noLogin"},component:function(){return n.e("chunk-27d35730").then(n.bind(null,"eddd"))}},{path:"/privacyPolicy",name:"PrivacyPolicy",meta:{auth:"noLogin"},component:function(){return n.e("chunk-a10b38c6").then(n.bind(null,"0c0c"))}},{path:"/userAgreement",name:"UserAgreement",meta:{auth:"noLogin"},component:function(){return n.e("chunk-783829b8").then(n.bind(null,"d797"))}},{path:"/playIncentives",name:"PlayIncentives",meta:{auth:"noLogin"},component:function(){return n.e("chunk-4ee74866").then(n.bind(null,"c14d"))}},{path:"/audioEditor",name:"AudioEditor",meta:{},component:function(){return Promise.all([n.e("chunk-93dff0b4"),n.e("chunk-00a64d95")]).then(n.bind(null,"9ef1"))}}],S=new C["a"]({mode:"history",base:"/",routes:_}),P=S,B=(n("4160"),n("b64b"),n("159b"),n("5530")),x=n("2f62"),z={showBindKugou:!1},L={updateShowBindKugou:function(t,e){console.log("updateShowBindKugou:",e),t.showBindKugou=e}},E={updateShowBindKugou:function(t,e){t.commit("updateShowBindKugou",e)}},F={},D={state:z,mutations:L,actions:E,getters:F},O=n("0804");o["default"].use(x["a"]);var I=new x["a"].Store({state:{beatForm:{fenzi:4,fenmu:4},lineLeft:6,matter:15,noteWidth:20,noteHeight:25,bpm:90,isSynthetizing:!1,stageSize:{},maxPitchRight:0,mode:0,playState:O["b"].StateNone,stagePitches:[],isStagePitchesChanged:!1},getters:{stageWidth:function(t){return t.noteWidth*(32/t.beatForm.fenmu)*t.beatForm.fenzi*t.matter},stageHeight:function(t){return O["a"].length*t.noteHeight},beatWidth:function(t){return t.noteWidth*(32/t.beatForm.fenmu)*t.beatForm.fenzi},firstPitch:function(t){return O["a"][0].pitch}},mutations:{updateBeatForm:function(t,e){t.beatForm=Object(B["a"])(Object(B["a"])({},t.beatForm),e)},updateMatter:function(t,e){t.matter+=e},changeStoreState:function(t,e){Object.keys(e).forEach((function(n){console.log("changeStoreState",n,e[n]),t[n]=e[n]}))}},actions:{updateBeatForm:function(t,e){t.commit("updateBeatForm",e)},updateMatter:function(t,e){t.commit("updateMatter",e)},changeStoreState:function(t,e){var n=t.commit;n("changeStoreState",e)}},modules:{profile:D}}),T=function(){var t=window.innerWidth,e=t-186-50;I.state.stageSize={width:e}};T(),window.addEventListener("resize",(function(){T()}));var q=I,H=n("c1df"),M=n.n(H),U=n("7707"),K=n.n(U),G=n("7ded"),N=function(){Object(G["d"])().then((function(t){var e=t.data,n=e.data,o=e.ret_code;1e5!==o?null!==n&&sessionStorage.setItem("userInfo",JSON.stringify(n)):sessionStorage.setItem("userInfo","")}))};P.beforeEach((function(t,e,n){document.querySelector("#app").scrollTo(0,0),N();var o=sessionStorage.getItem("userInfo");""===o&&"noLogin"!==t.meta.auth?n("/"):n()})),K.a.polyfill(),o["default"].prototype.$moment=M.a,o["default"].config.productionTip=!1,o["default"].mixin({beforeRouteEnter:function(t,e,n){n((function(e){var n=t.fullPath;"/"==n?e.$emit("changeBg",0):e.$emit("changeBg",1)}))},beforeRouteLeave:function(t,e,n){if("Edit"===e.name||"Rectify"===e.name){var o=this.comparisonFormData();!0===o&&!1===this.submitSuccess&&this.submitDraft()}n()}}),new o["default"]({el:"#app",router:P,store:q,render:function(t){return t(A)}})},"5b32":function(t,e,n){"use strict";n("989c")},6187:function(t,e,n){},"7ad9":function(t,e,n){t.exports=n.p+"img/icon-complete.47e9c802.png"},"7ded":function(t,e,n){"use strict";n.d(e,"a",(function(){return i})),n.d(e,"b",(function(){return c})),n.d(e,"c",(function(){return s})),n.d(e,"d",(function(){return r}));var o=n("a358"),a=o["a"],i=function(t){return a({method:"post",url:"/cgi-bin/musicx/user/send_captcha",data:{phone:t}})},c=function(t){var e={src:68,opentype:0,openid:"",appid:1};return a({method:"post",url:"/cgi-bin/musicx/user/phone_login",data:Object.assign({},e,t)})},s=function(){return a({method:"post",url:"/cgi-bin/musicx/user/logout"})},r=function(){return a({method:"post",url:"/cgi-bin/v1/yan/user/get_personal_info"})}},"8fc2":function(t,e,n){"use strict";n("6187")},"989c":function(t,e,n){},a358:function(t,e,n){"use strict";n("d3b7"),n("0fb7"),n("450d");var o=n("f529"),a=n.n(o),i=n("bc3a"),c=n.n(i),s=c.a.create({timeout:5e3});s.interceptors.response.use((function(t){if(t&&t.data){var e=t.data||{};e&&0!==e.ret_code&&1e5!==e.ret_code&&a.a.error("请求失败: "+e.err_msg)}return t}),(function(t){var e={success:!1,message:"系统错误，请重试！"};return a.a.error("系统错误，请重试！"),Promise.resolve(e)})),e["a"]=s},b233:function(t,e,n){"use strict";(function(t){n.d(e,"e",(function(){return o})),n.d(e,"c",(function(){return i})),n.d(e,"b",(function(){return c})),n.d(e,"f",(function(){return s})),n.d(e,"a",(function(){return r})),n.d(e,"d",(function(){return u}));n("c975"),n("13d5"),n("fb6a"),n("d3b7"),n("4d63"),n("ac1f"),n("25f0"),n("466d"),n("841c");var o=function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"";console.log("reportEvent:",t,e,n),BeaconAction.onEvent(e||t,t,n)},a="yan.qq.com"===location.hostname,i=!a,c=function(e){var n=window.location.search.match(/([^?=&]+)(=([^&]*))/g);return n?n.reduce((function(e,n){return e[n.slice(0,n.indexOf("="))]=t.browser&&decodeURIComponent(n.slice(n.indexOf("=")+1)),e}),{}):{}},s=function(t){return new Promise((function(e){return setTimeout(e,t)}))},r=function(t){var e=new RegExp("(^| )".concat(t,"=([^;]*)(;|$)")),n=document.cookie.match(e);return n?unescape(n[2]):""},u=function(t,e,n){return Math.floor(parseInt(t,10)/e*60*1e3/(8*n))}}).call(this,n("4362"))},c8de:function(t,e,n){"use strict";n("437b")},cf05:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAb1BMVEUAAABszP9tzP9ty/9ty/9x0P+A1f9tzP9sy/////+/6P9wzP/4/f+B0/+v4v94z//v+f+e3f+55v90zv+N1//b8v/V8P+W2v+I1f/1+//n9//D6f+k3//h9P/Q7v990f/s+P/K7P/y+v+s4v+x4/8KxF02AAAACHRSTlMA89WUjysGveasGXIAAAFbSURBVEjH1dbLboMwFEVREkhyDoYEzJvwTPr/31hwO0GyCzez7pklrwHClq+3dgnOJ+x2OgcX76erj8P5VyNuEHRbjQ9R/vIdEHbxAikJvLOUnL2TlJy8zTLu7pa6erNpQzQdzcpBOnIILc0RtYP0TGEtZ+MgZAZ7L44uohwkYfxPSTYMSkg6MhWSckpKGXlQh+YPjc++CLMj5M08ZweoKRoKlkdIPwGvAojLxQ3M9klMDTzNCanuumC8TzSbJGn4BVWwLVqzuWcG5SbT67nUtHgzBUJDxhqaqYvk1FgKWWvmiJuVmDVzOzF7ASNzRm1UrsSIFC5SpTClFWp9r8c0+xWyY2mEiBghIkaIiBEiYsQOsYm5VYdJtQjh3Y/LCn+Rhg/Yi5jZSck5swGl2cJO4oiMLJGsHAR1EdFWX8FKTOphSWHTJw+f/Hn95BGXjwrygeSzsUc+XMlHuG+EKFfjt78VEAAAAABJRU5ErkJggg=="},d200:function(t,e,n){},d68e:function(t,e,n){t.exports=n.p+"img/bg.ac5e559d.png"},db43:function(t,e,n){t.exports=n.p+"img/activity-bg.af5b1115.jpg"}});
//# sourceMappingURL=app.306ad182.js.map