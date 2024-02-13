"use strict";(self.webpackChunkflecks_docusaurus=self.webpackChunkflecks_docusaurus||[]).push([[4639],{3839:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>o,default:()=>p,frontMatter:()=>i,metadata:()=>c,toc:()=>u});var a=t(5893),l=t(1151),s=t(4283),r=(t(385),t(6569));const i={title:"Adding flecks",description:"Add flecks to your application to extend its functionality."},o="Adding flecks",c={id:"adding-flecks",title:"Adding flecks",description:"Add flecks to your application to extend its functionality.",source:"@site/docs/adding-flecks.mdx",sourceDirName:".",slug:"/adding-flecks",permalink:"/flecks/docs/adding-flecks",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"Adding flecks",description:"Add flecks to your application to extend its functionality."},sidebar:"flecksSidebar",previous:{title:"Creating a fleck",permalink:"/flecks/docs/creating-a-fleck"},next:{title:"Building your application",permalink:"/flecks/docs/building-your-application"}},d={},u=[{value:"Finally... a white page?",id:"finally-a-white-page",level:2},{value:"Proceed with the hooking",id:"proceed-with-the-hooking",level:2},{value:"Everything so far... plus Electron!",id:"everything-so-far-plus-electron",level:2}];function h(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",img:"img",p:"p",pre:"pre",...(0,l.a)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.h1,{id:"adding-flecks",children:"Adding flecks"}),"\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.code,{children:"@flecks/web"})," is a fleck that builds and serves a webpage. You can add it to your application\nusing the CLI:"]}),"\n",(0,a.jsx)(s.Z,{cmd:"flecks add @flecks/web"}),"\n",(0,a.jsx)(n.admonition,{title:"Fast and dynamic",type:"danger",children:(0,a.jsx)(n.p,{children:"If your application was still running when you added that fleck, you will see the application\nautomatically restart!"})}),"\n",(0,a.jsx)(n.p,{children:"Otherwise, if you run:"}),"\n",(0,a.jsx)(r.Z,{headless:!0,cmd:"start"}),"\n",(0,a.jsx)(n.p,{children:"you'll see a line in the output:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:"  @flecks/web/server/http HTTP server up @ 0.0.0.0:32340!\n"})}),"\n",(0,a.jsx)(n.h2,{id:"finally-a-white-page",children:"Finally... a white page?"}),"\n",(0,a.jsxs)(n.p,{children:["If you visit ",(0,a.jsx)(n.code,{children:"localhost:32340"})," in your browser, you should now see... a blank white page! Don't fret\nthough; if you open the devtools in your browser, you will see a little messaging from your\napplication that will look something like:"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:"[webpack-dev-server] Server started: Hot Module Replacement enabled, Live Reloading enabled, Progress disabled, Overlay enabled.\n[HMR] Waiting for update signal from WDS...\nflecks client v3.1.5 loading runtime...\n"})}),"\n",(0,a.jsx)(n.p,{children:"This is a good sign! This means we successfully added a web server with HMR enabled by default.\nOh, the possibilities..."}),"\n",(0,a.jsx)(n.h2,{id:"proceed-with-the-hooking",children:"Proceed with the hooking"}),"\n",(0,a.jsxs)(n.p,{children:["Let's make our fleck ",(0,a.jsx)(n.code,{children:"say-hello"})," hook into ",(0,a.jsx)(n.code,{children:"@flecks/web"})," client to do something when the client\ncomes up (e.g. the browser loads the page)."]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-javascript",metastring:'title="packages/say-hello/src/index.js"',children:"export const hooks = {\n  // highlight-start\n  '@flecks/web/client.up': async (container) => {\n    container.append('hello world');\n  },\n  // highlight-end\n  '@flecks/server.up': async (flecks) => {\n    const {id} = flecks.get('@flecks/core');\n    process.stdout.write(`  hello server: ID ${id}\\n`);\n  },\n};\n"})}),"\n",(0,a.jsx)(n.admonition,{title:"And another one",type:"danger",children:(0,a.jsx)(n.p,{children:"Just like before, saving that file will automatically reload your webpage and show you the message\nimmediately!"})}),"\n",(0,a.jsx)(n.p,{children:"Glorious, isn't it?"}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"An image of our simple hello world application running inside a Chromium browser window",src:t(2562).Z+"",width:"628",height:"509"})}),"\n",(0,a.jsx)(n.h2,{id:"everything-so-far-plus-electron",children:"Everything so far... plus Electron!"}),"\n",(0,a.jsxs)(n.p,{children:["Let's add another core fleck. flecks ships with a core fleck ",(0,a.jsx)(n.code,{children:"@flecks/electron"}),". This runs your\napplication inside of an instance of ",(0,a.jsx)(n.a,{href:"https://www.electronjs.org/",children:"Electron"}),". You'll add the fleck:"]}),"\n",(0,a.jsx)(s.Z,{headless:!0,cmd:"flecks add -d @flecks/electron"}),"\n",(0,a.jsx)(n.p,{children:"You will almost immediately see something like this:"}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"An image of our simple hello world application running inside an Electron window",src:t(3322).Z+"",width:"820",height:"655"})}),"\n",(0,a.jsxs)(n.p,{children:["Isn't it beautiful? ","\ud83d\ude0c"]}),"\n",(0,a.jsx)(n.admonition,{type:"note",children:(0,a.jsxs)(n.p,{children:["We used the ",(0,a.jsx)(n.code,{children:"-d"})," option with ",(0,a.jsx)(n.code,{children:"flecks add"})," to add ",(0,a.jsx)(n.code,{children:"@flecks/electron"})," to\n",(0,a.jsx)(n.a,{href:"https://docs.npmjs.com/specifying-dependencies-and-devdependencies-in-a-package-json-file",children:(0,a.jsx)(n.code,{children:"devDependencies"})}),"\nsince it's only needed for development."]})}),"\n",(0,a.jsx)(n.p,{children:"Next, we'll go over some of the nuts and bolts of how your application is built."})]})}function p(e={}){const{wrapper:n}={...(0,l.a)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(h,{...e})}):h(e)}},4283:(e,n,t)=>{t.d(n,{Z:()=>i});var a=t(9286),l=t(4866),s=t(5162),r=t(5893);function i(e){let{children:n,cmd:t,headless:i=!0}=e;const o=Array.isArray(t)?t:[t];return(0,r.jsx)(l.Z,{className:i&&"headless",groupId:"package-manager",children:(0,r.jsxs)(s.Z,{value:"npm",label:"npm",children:[n,(0,r.jsx)(a.Z,{language:"bash",children:(c="npx",o.map((e=>`${c} ${e}`)).join("\n"))})]})});var c}},385:(e,n,t)=>{t.d(n,{Z:()=>i});var a=t(9286),l=t(4866),s=t(5162),r=t(5893);function i(e){let{children:n,headless:t=!0,pkg:i}=e;return(0,r.jsx)(l.Z,{className:t&&"headless",groupId:"package-manager",children:(0,r.jsxs)(s.Z,{value:"npm",label:"npm",children:[n,(0,r.jsxs)(a.Z,{language:"bash",children:["npm install ",i]})]})})}},6569:(e,n,t)=>{t.d(n,{Z:()=>i});var a=t(9286),l=t(4866),s=t(5162),r=t(5893);function i(e){let{children:n,cmd:t,headless:i=!0}=e;return(0,r.jsx)(l.Z,{className:i&&"headless",groupId:"package-manager",children:(0,r.jsxs)(s.Z,{value:"npm",label:"npm",children:[n,(0,r.jsxs)(a.Z,{language:"bash",children:["npm run ",t]})]})})}},5162:(e,n,t)=>{t.d(n,{Z:()=>r});t(7294);var a=t(512);const l={tabItem:"tabItem_Ymn6"};var s=t(5893);function r(e){let{children:n,hidden:t,className:r}=e;return(0,s.jsx)("div",{role:"tabpanel",className:(0,a.Z)(l.tabItem,r),hidden:t,children:n})}},4866:(e,n,t)=>{t.d(n,{Z:()=>y});var a=t(7294),l=t(512),s=t(2466),r=t(6550),i=t(469),o=t(1980),c=t(7392),d=t(12);function u(e){return a.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,a.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:n,children:t}=e;return(0,a.useMemo)((()=>{const e=n??function(e){return u(e).map((e=>{let{props:{value:n,label:t,attributes:a,default:l}}=e;return{value:n,label:t,attributes:a,default:l}}))}(t);return function(e){const n=(0,c.l)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,t])}function p(e){let{value:n,tabValues:t}=e;return t.some((e=>e.value===n))}function f(e){let{queryString:n=!1,groupId:t}=e;const l=(0,r.k6)(),s=function(e){let{queryString:n=!1,groupId:t}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:n,groupId:t});return[(0,o._X)(s),(0,a.useCallback)((e=>{if(!s)return;const n=new URLSearchParams(l.location.search);n.set(s,e),l.replace({...l.location,search:n.toString()})}),[s,l])]}function g(e){const{defaultValue:n,queryString:t=!1,groupId:l}=e,s=h(e),[r,o]=(0,a.useState)((()=>function(e){let{defaultValue:n,tabValues:t}=e;if(0===t.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!p({value:n,tabValues:t}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${t.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const a=t.find((e=>e.default))??t[0];if(!a)throw new Error("Unexpected error: 0 tabValues");return a.value}({defaultValue:n,tabValues:s}))),[c,u]=f({queryString:t,groupId:l}),[g,m]=function(e){let{groupId:n}=e;const t=function(e){return e?`docusaurus.tab.${e}`:null}(n),[l,s]=(0,d.Nk)(t);return[l,(0,a.useCallback)((e=>{t&&s.set(e)}),[t,s])]}({groupId:l}),b=(()=>{const e=c??g;return p({value:e,tabValues:s})?e:null})();(0,i.Z)((()=>{b&&o(b)}),[b]);return{selectedValue:r,selectValue:(0,a.useCallback)((e=>{if(!p({value:e,tabValues:s}))throw new Error(`Can't select invalid tab value=${e}`);o(e),u(e),m(e)}),[u,m,s]),tabValues:s}}var m=t(2389);const b={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var k=t(5893);function v(e){let{className:n,block:t,selectedValue:a,selectValue:r,tabValues:i}=e;const o=[],{blockElementScrollPositionUntilNextRender:c}=(0,s.o5)(),d=e=>{const n=e.currentTarget,t=o.indexOf(n),l=i[t].value;l!==a&&(c(n),r(l))},u=e=>{let n=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const t=o.indexOf(e.currentTarget)+1;n=o[t]??o[0];break}case"ArrowLeft":{const t=o.indexOf(e.currentTarget)-1;n=o[t]??o[o.length-1];break}}n?.focus()};return(0,k.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":t},n),children:i.map((e=>{let{value:n,label:t,attributes:s}=e;return(0,k.jsx)("li",{role:"tab",tabIndex:a===n?0:-1,"aria-selected":a===n,ref:e=>o.push(e),onKeyDown:u,onClick:d,...s,className:(0,l.Z)("tabs__item",b.tabItem,s?.className,{"tabs__item--active":a===n}),children:t??n},n)}))})}function x(e){let{lazy:n,children:t,selectedValue:l}=e;const s=(Array.isArray(t)?t:[t]).filter(Boolean);if(n){const e=s.find((e=>e.props.value===l));return e?(0,a.cloneElement)(e,{className:"margin-top--md"}):null}return(0,k.jsx)("div",{className:"margin-top--md",children:s.map(((e,n)=>(0,a.cloneElement)(e,{key:n,hidden:e.props.value!==l})))})}function w(e){const n=g(e);return(0,k.jsxs)("div",{className:(0,l.Z)("tabs-container",b.tabList),children:[(0,k.jsx)(v,{...e,...n}),(0,k.jsx)(x,{...e,...n})]})}function y(e){const n=(0,m.Z)();return(0,k.jsx)(w,{...e,children:u(e.children)},String(n))}},3322:(e,n,t)=>{t.d(n,{Z:()=>a});const a=t.p+"assets/images/flecks-electron-a0aa8d1371582b485c87402b0aa5b555.png"},2562:(e,n,t)=>{t.d(n,{Z:()=>a});const a=t.p+"assets/images/flecks-web-4d794c79b53faa14d140b2dde7e51709.png"}}]);