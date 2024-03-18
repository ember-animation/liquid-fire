define("~fastboot/app-factory",["docs/app","docs/config/environment"],(function(e,t){return e=e.default,t=t.default,{default:function(){return e.create(t.APP)}}})),define("docs/initializers/ajax",["exports","ember"],(function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
const{get:o}=t.default
var r=function(e){let t=o(this,"fastboot.request.protocol")
if(/^\/\//.test(e.url))e.url=t+e.url
else if(!/^https?:\/\//.test(e.url))try{e.url=t+"//"+o(this,"fastboot.request.host")+e.url}catch(r){throw new Error("You are using Ember Data with no host defined in your adapter. This will attempt to use the host of the FastBoot request, which is not configured for the current host of this request. Please set the hostWhitelist property for in your environment.js. FastBoot Error: "+r.message)}if(!najax)throw new Error("najax does not seem to be defined in your app. Did you override it via `addOrOverrideSandboxGlobals` in the fastboot server?")
najax(e)},i={name:"ajax-service",initialize:function(e){e.register("ajax:node",r,{instantiate:!1})}}
e.default=i})),define("docs/initializers/error-handler",["exports","ember"],(function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var o={name:"error-handler",initialize:function(){t.default.onerror||(t.default.onerror=function(e){const t=`There was an error running your app in fastboot. More info about the error: \n ${e.stack||e}`
console.error(t)})}}
e.default=o})),define("docs/instance-initializers/setup-fetch",["exports","fetch"],(function(e,t){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var o={name:"fetch",initialize:function(e){const o=e.lookup("service:fastboot");(0,t.setupFastboot)(o.get("request"))}}
e.default=o}))
