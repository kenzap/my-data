!function(){"use strict";function e(e){return function(e){if(Array.isArray(e))return t(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,n){if(!e)return;if("string"==typeof e)return t(e,n);var a=Object.prototype.toString.call(e).slice(8,-1);"Object"===a&&e.constructor&&(a=e.constructor.name);if("Map"===a||"Set"===a)return Array.from(e);if("Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a))return t(e,n)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function t(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=new Array(t);n<t;n++)a[n]=e[n];return a}const n=(e,...t)=>{if(0===(e=String(e)).length)return"";return((e,t,...n)=>{let a=(e,t)=>(t.forEach(((t,n)=>{e=e.replace("%"+(n+1)+"$",t)})),e);return void 0===window.i18n||void 0===window.i18n.state.locale.values[e]?a(e,n):a(t(window.i18n.state.locale.values[e]),n)})(e,(e=>e.replace(/[&<>'"]/g,(e=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&apos;",'"':"&quot;"}[e])))),...t)},a=e=>{let t=new URLSearchParams(window.location.search),n=t.get("sid")?t.get("sid"):"",a=-1==e.indexOf("?")?"?sid="+n:"&sid="+n;return e+a},o=()=>{let e=new URLSearchParams(window.location.search);return e.get("sid")?e.get("sid"):""},r=e=>{let t=e+"=",n=decodeURIComponent(document.cookie).split(";");for(let e=0;e<n.length;e++){let a=n[e];for(;" "==a.charAt(0);)a=a.substring(1);if(0==a.indexOf(t))return a.substring(t.length,a.length)}return""},s={Accept:"application/json","Content-Type":"application/json",Authorization:"Bearer "+r("kenzap_api_key"),"Kenzap-Locale":r("locale")?r("locale"):"en","Kenzap-Header":(()=>{let e=localStorage.hasOwnProperty("header")&&localStorage.hasOwnProperty("header-version")?localStorage.getItem("header-version"):0,t=window.location.hostname+"/"+o()+"/"+r("locale");return t!=r("check")&&(e=0,console.log("refresh")),((e,t,n)=>{let a="";if(n){let e=new Date;e.setTime(e.getTime()+24*n*60*60*1e3),a=";expires="+e.toUTCString()}document.cookie=e+"="+(escape(t)||"")+a+";path=/;domain=.kenzap.cloud"})("check",t,5),e})(),"Kenzap-Token":r("kenzap_token"),"Kenzap-Sid":o()},i=e=>{if(console.log(e),isNaN(e.code)){let t=e;try{t=JSON.stringify(t)}catch(e){}let n=new URLSearchParams;return n.append("cmd","report"),n.append("sid",o()),n.append("token",r("kenzap_token")),n.append("data",t),fetch("https://api-v1.kenzap.cloud/error/",{method:"post",headers:{Accept:"application/json","Content-type":"application/x-www-form-urlencoded"},body:n}),void alert("Can not connect to Kenzap Cloud")}if(401===e.code){if(-1!=window.location.href.indexOf("localhost"))return void alert(e.reason);location.href="https://auth.kenzap.com/?app=65432108792785&redirect="+window.location.href}else alert(e.reason)},l=(e,t)=>{if(document.querySelector(e))for(let n of document.querySelectorAll(e))n.removeEventListener("click",t,!0),n.addEventListener("click",t,!0)},d=()=>{let e=new URLSearchParams(window.location.search),t=e.get("page")?e.get("page"):1;return parseInt(t)};var c=function(e){for(var t=e+"=",n=decodeURIComponent(document.cookie).split(";"),a=0;a<n.length;a++){for(var o=n[a];" "==o.charAt(0);)o=o.substring(1);if(0==o.indexOf(t))return o.substring(t.length,o.length)}return""},u={state:{firstLoad:!0,html:"",data:{},ajaxQueue:0,limit:25,responseKey:[],modal:null,modalCont:null,editor:{}},init:function(){u.getData()},getData:function(){u.state.firstLoad&&(()=>{let e=document.querySelector(".loader");e&&(e.style.display="block")})(),fetch("https://api-v1.kenzap.cloud/",{method:"post",headers:{Accept:"application/json","Content-Type":"text/plain",Authorization:"Bearer "+c("kenzap_api_key"),"Kenzap-Header":localStorage.hasOwnProperty("header"),"Kenzap-Token":c("kenzap_token"),"Kenzap-Sid":o()},body:JSON.stringify({query:{keys:{type:"api-key",keys:["private"]},locale:{type:"locale",id:c("lang")},mydata:{type:"mydata"},dashboard:{type:"dashboard"}}})}).then((function(e){return e.json()})).then((function(e){e.success?((e=>{if(e.header&&localStorage.setItem("header",e.header),!document.querySelector("#k-script")){let e=document.createElement("div");e.innerHTML=localStorage.getItem("header"),e=e.firstChild,document.body.prepend(e),Function(document.querySelector("#k-script").innerHTML).call("test")}e.locale&&window.i18n.init(e.locale)})(e),u.loadHomeStructure(),u.renderPage(e),u.initListeners(),u.initFooter(),u.state.firstLoad=!1,console.log(e)):i(e)})).catch((function(e){console.error("Error:",e)}))},getExtensions:function(){var e=new URLSearchParams;e.append("cmd","preview_extensions"),e.append("s",""),e.append("token",c("kenzap_token")),fetch("https://siteapi.kenzap.cloud/v1/",{method:"post",headers:{Accept:"application/json","Content-type":"application/x-www-form-urlencoded"},body:e}).then((function(e){return e.json()})).then((function(e){e.success&&console.log(e)})).catch((function(e){console.error("Error:",e)}))},renderPage:function(e){(e=>{let t='<ol class="breadcrumb mt-2 mb-0">';for(let n of e)void 0===n.link?t+=`<li class="breadcrumb-item">${n.text}</li>`:t+=`<li class="breadcrumb-item"><a href="${n.link}">${n.text}</a></li>`;t+="</ol>",document.querySelector(".bc").innerHTML=t})([{link:a("https://dashboard.kenzap.cloud?launcher=mydata"),text:__("Dashboard")},{text:__("My Data")}]),u.state.dashboard=e.dashboard,am4core.useTheme(am4themes_animated);var t=am4core.create("mydata-chart",am4plugins_forceDirected.ForceDirectedTree).series.push(new am4plugins_forceDirected.ForceDirectedSeries),n=[],o={};e.mydata.data.forEach((function(e,t){var n=e.key.split("-");n.length>1?o[n[0]]?o[n[0]]+=e.count:o[n[0]]=e.count:o[e.key]?o[e.key]+=e.count:o[e.key]=e.count})),console.log(o),Object.entries(o).forEach((function(t,a){console.log(t);var o=t[0].split("-"),r=[];e.mydata.data.forEach((function(e,t){e.key.startsWith(o[0]+"-")&&r.push({name:e.key+" "+e.count,value:5})})),r.push({name:t[0]+" "+t[1],value:5}),n.push({name:t[0],value:8,children:r})})),console.log(n),t.data=n,t.dataFields.linkWith="linkWith",t.dataFields.category="category",t.dataFields.name="name",t.dataFields.id="name",t.dataFields.value="value",t.dataFields.children="children",t.dataFields.fixed="fixed",t.nodes.template.propertyFields.x="x",t.nodes.template.propertyFields.y="y",t.nodes.template.tooltipText="{name}",t.nodes.template.fillOpacity=1,t.nodes.template.label.text="{name}",t.fontSize=8,t.maxLevels=3,t.nodes.template.label.hideOversized=!0,t.nodes.template.label.truncate=!0,t.nodes.template.draggable=!0,t.nodePadding=10,t.nodes.template.events.on("hit",(function(e){var t=e.target.label.currentText.split(" ");u.state.modalCont=null,t.length>1&&u.getKeyData(t[0])}),undefined),(()=>{let e=document.querySelector(".loader");e&&(e.style.display="none")})()},getKeyData:function(e){var t=document.querySelector(".input-search")?document.querySelector(".input-search").value:"";fetch("https://api-v1.kenzap.cloud/",{method:"post",headers:s,body:JSON.stringify({query:{data:{type:"find",key:e,fields:"*",search:{s:t},sortby:{field:"updated",order:"DESC"},offset:t.length>0?0:d()*u.state.limit-u.state.limit,limit:u.state.limit}}})}).then((function(e){return e.json()})).then((function(t){t.success&&(u.state.responseKey=t,u.viewDataSets(e,t),console.log(t))})).catch((function(e){i(e)}))},initListeners:function(){u.state.firstLoad&&(l(".btn-publish",u.listeners.publish),l(".domain-list li a",u.listeners.domainChange),l(".btn-modal",u.listeners.modalSuccessBtn))},listeners:{modalSuccessBtn:function(e){u.listeners.modalSuccessBtnFunc(e)},modalSuccessBtnFunc:null},viewDataSets:function(t,a){u.state.key=t,u.state.modalCont&&u.state.modal||(u.state.modal=document.querySelector(".modal"),u.state.modalCont=new bootstrap.Modal(u.state.modal),history.pushState({pageID:"Data"},"Data",window.location.pathname+window.location.search+"#editing"),u.state.modal.querySelector(".modal-dialog").classList.add("modal-fullscreen"),u.state.modal.querySelector(".modal-header .modal-title").innerHTML='\n            <div class="d-flex align-items-center">\n                <input type="text" style="width:320px;" placeholder="'.concat(n("Search in %1$",t),'" class="form-control fs-6 border-top-0 border-start-0 input-search border-end-0 rounded-0 ms-2" aria-label="').concat(n("Search"),'" aria-describedby="inputGroup-sizing-sm" >\n                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="ms-2 bi bi-list po restart-table d-none" viewBox="0 0 16 16">\n                    <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>\n                </svg>\n            </div>\n            '),u.state.modal.querySelector(".modal-footer").innerHTML='\n                <button type="button" class="btn btn-primary btn-modal btn-update-record d-none">'.concat(n("Update"),'</button>\n                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">').concat(n("Close"),"</button>\n            "),((e,t)=>{if(document.querySelector(e))for(let n of document.querySelectorAll(e))n.removeEventListener("keyup",t,!0),n.addEventListener("keyup",t,!0)})(".input-search",(function(e){e.preventDefault(),u.state.timeout&&clearTimeout(u.state.timeout),u.state.timeout=setTimeout((function(e){e.getKeyData(t)}),600,u)})),u.state.modal.querySelector(".restart-table").addEventListener("click",(function(e){u.state.modal.querySelector(".restart-table").classList.add("d-none"),u.state.modal.querySelector(".btn-update-record").classList.add("d-none"),u.getKeyData(t)})),u.state.modal.querySelector(".btn-update-record").addEventListener("click",(function(e){fetch("https://api-v1.kenzap.cloud/",{method:"post",headers:s,body:JSON.stringify({query:{record:{type:"update",key:u.state.key,id:u.state._id,data:JSON.parse(u.state.editor.json.getValue())}}})}).then((function(e){return e.json()})).then((function(e){e.success?((e=>{if(!document.querySelector(".toast")){let e='\n        <div class="position-fixed bottom-0 p-2 m-4 end-0 align-items-center">\n            <div class="toast hide align-items-center text-white bg-dark border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="3000">\n                <div class="d-flex">\n                    <div class="toast-body"></div>\n                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>\n                </div>\n            </div>\n        </div>';document.querySelector("body > div")&&document.querySelector("body > div").insertAdjacentHTML("afterend",e)}let t=new bootstrap.Toast(document.querySelector(".toast"));document.querySelector(".toast .toast-body").innerHTML=e,t.show()})(n("Record updated")),u.state.modal.querySelector(".restart-table").classList.add("d-none"),u.state.modal.querySelector(".btn-update-record").classList.add("d-none"),u.getKeyData(t)):i(e)})).catch((function(e){i(e)}))}))),u.state.modal.querySelector(".modal-body").innerHTML='\n            <div class="row">\n                <div class="col-sm-12">\n                    <div id="editor" class="editor d-none" style="min-height:2000px;">\n\n\n                    </div>\n                    <div class="table-responsive">\n                        <table class="table table-hover table-borderless align-middle table-striped table-p-list">\n                            <thead>\n                                <tr>\n                                    <th id="table-id-header">'.concat(n("_id"),"</th>\n                                    <th>").concat(n("data"),"</th>\n                                </tr>\n                            </thead>\n                            <tbody>\n                            ").concat(0==a.data.length?'<tr><td colspan="2" class="text-muted">'.concat(n("no data to display"),"</td>"):"","\n\n                            ").concat(a.data.map((function(e,t){return'\n                                    <tr>\n                                        <td id="table-id'.concat(t,'" class="table-obj table-id font-monospace">').concat(e._id,'</td>\n                                        <td id="table-obj').concat(t,'" data-id="').concat(e._id,'" class="elipsized table-data font-monospace table-obj" style="">').concat((n=JSON.stringify(e),0===(n=String(n)).length?"":n.replace(/[&<>'"]/g,(e=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&apos;",'"':"&quot;"}[e])))),"</td>\n                                    </tr>\n                                    ");var n})).join(""),"\n                            </tbody>\n                        </table>\n                    </div>\n                </div>\n            </div>\n        "),u.state.modalCont.show(),e(document.querySelectorAll(".table-data")).forEach((function(e,t){e.addEventListener("click",(function(e){e.preventDefault();var t=u.state.responseKey.data.filter((function(t){return t._id==e.currentTarget.dataset.id}))[0];document.querySelector(".restart-table").classList.remove("d-none"),document.querySelector("#editor").classList.remove("d-none"),document.querySelector(".table-p-list").classList.add("d-none"),document.querySelector(".btn-update-record").classList.remove("d-none"),u.state._id=e.currentTarget.dataset.id,u.state.editor.json=ace.edit("editor"),ace.config.set("basePath","https://account.kenzap.com/js/ace/"),u.state.editor.json.getSession().setMode("ace/mode/json"),u.state.editor.json.setValue(JSON.stringify(t,null,2),-1)}))})),!u.state.modalCont||u.state.modal},loadHomeStructure:function(){u.state.firstLoad&&(document.querySelector("#contents").innerHTML=function(e){return'\n        <div class="container p-edit">\n            <div class="d-flex justify-content-between bd-highlight mb-3">\n                <nav class="bc" aria-label="breadcrumb"></nav>\n                <div class="d-none">\n                    <a style="margin-right:16px;" class="preview-link nounderline" target="_blank" href="#">'.concat(e("preview"),'<i class="mdi mdi-monitor"></i></a>\n                    <button class="btn btn-primary btn-publish" type="button">').concat(e("Publish menu"),'</button>\n                </div>\n            </div>\n            <div class="row">\n                <div id="mydata-chart"></div>\n            </div>\n        </div>\n\n        <div class="modal" tabindex="-1">\n            <div class="modal-dialog">\n                <div class="modal-content">\n                    <div class="modal-header">\n                        <h5 class="modal-title"></h5>\n                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>\n                    </div>\n                    <div class="modal-body p-0">\n\n                    </div>\n                    <div class="modal-footer">\n                        <button type="button" class="btn btn-primary btn-modal"></button>\n                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"></button>\n                    </div>\n                </div>\n            </div>\n        </div>\n        \n    ')}(__))},initFooter:function(){var e,t;e=__("Created by %1$Kenzap%2$. ❤️ Licensed %3$GPL3%4$.",'<a class="text-muted" href="https://kenzap.com/" target="_blank">',"</a>",'<a class="text-muted" href="https://github.com/kenzap/mydata" target="_blank">',"</a>"),t="",document.querySelector("footer .row").innerHTML=`\n    <div class="d-sm-flex justify-content-center justify-content-sm-between">\n        <span class="text-muted text-center text-sm-left d-block d-sm-inline-block">${e}</span>\n        <span class="float-none float-sm-right d-block mt-1 mt-sm-0 text-center text-muted">${t}</span>\n    </div>`}};u.init()}();