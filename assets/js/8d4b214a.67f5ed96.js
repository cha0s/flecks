"use strict";(self.webpackChunkflecks_docusaurus=self.webpackChunkflecks_docusaurus||[]).push([[4639],{3839:(e,n,l)=>{l.r(n),l.d(n,{assets:()=>u,contentTitle:()=>c,default:()=>f,frontMatter:()=>o,metadata:()=>d,toc:()=>h});var s=l(5893),a=l(1151),r=l(4283),t=l(385),i=l(6569);const o={title:"Adding flecks",description:"Add flecks to your application to extend its functionality."},c="Adding flecks",d={id:"adding-flecks",title:"Adding flecks",description:"Add flecks to your application to extend its functionality.",source:"@site/docs/adding-flecks.mdx",sourceDirName:".",slug:"/adding-flecks",permalink:"/flecks/docs/adding-flecks",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"Adding flecks",description:"Add flecks to your application to extend its functionality."},sidebar:"flecksSidebar",previous:{title:"Building your application",permalink:"/flecks/docs/building-your-application"},next:{title:"Guides",permalink:"/flecks/docs/category/guides"}},u={},h=[{value:"Finally... a white page?",id:"finally-a-white-page",level:2},{value:"Proceed with the hooking",id:"proceed-with-the-hooking",level:2},{value:"Everything so far... plus Electron!",id:"everything-so-far-plus-electron",level:2}];function p(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",img:"img",p:"p",pre:"pre",...(0,a.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"adding-flecks",children:"Adding flecks"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"@flecks/web"})," is a fleck that builds and serves a webpage. You can add it to your application\nusing the CLI:"]}),"\n",(0,s.jsx)(r.Z,{cmd:"flecks add @flecks/web"}),"\n",(0,s.jsxs)(n.admonition,{title:"Really, a command just to add a fleck?",type:"tip",children:[(0,s.jsx)(t.Z,{headless:!0,pkg:"@flecks/web",children:(0,s.jsx)(n.p,{children:"Yep! This is only for your convenience however, as it is equivalent to doing:"})}),(0,s.jsx)(n.p,{children:"and then adding:"}),(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"'@flecks/web': {}\n"})}),(0,s.jsxs)(n.p,{children:["to your ",(0,s.jsx)(n.code,{children:"build/flecks.yml"}),"; that's all it does!"]})]}),"\n",(0,s.jsx)(n.p,{children:"Now, if you run:"}),"\n",(0,s.jsx)(i.Z,{headless:!0,cmd:"start"}),"\n",(0,s.jsx)(n.p,{children:"you'll see a line in the output:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"  @flecks/web/server/http HTTP server up @ 0.0.0.0:32340!\n"})}),"\n",(0,s.jsx)(n.h2,{id:"finally-a-white-page",children:"Finally... a white page?"}),"\n",(0,s.jsxs)(n.p,{children:["If you visit ",(0,s.jsx)(n.code,{children:"localhost:32340"})," in your browser, you should now see... a blank white page! Don't fret\nthough; if you open the devtools in your browser, you will see a little messaging from your\napplication that will look something like:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"[webpack-dev-server] Server started: Hot Module Replacement enabled, Live Reloading enabled, Progress disabled, Overlay enabled.\n[HMR] Waiting for update signal from WDS...\nflecks client v3.1.5 loading runtime...\n"})}),"\n",(0,s.jsx)(n.p,{children:"This is a good sign! This means we successfully added a web server with HMR enabled by default.\nOh, the possibilities..."}),"\n",(0,s.jsx)(n.h2,{id:"proceed-with-the-hooking",children:"Proceed with the hooking"}),"\n",(0,s.jsxs)(n.p,{children:["Let's make our fleck ",(0,s.jsx)(n.code,{children:"say-hello"})," hook into ",(0,s.jsx)(n.code,{children:"@flecks/web"})," client to do something when the client\ncomes up (e.g. the browser loads the page)."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",metastring:'title="packages/say-hello/src/index.js"',children:"export const hooks = {\n  // highlight-start\n  '@flecks/web/client.up': async () => {\n    window.document.body.append('hello world');\n  },\n  // highlight-end\n  '@flecks/server.up': async (flecks) => {\n    const {id} = flecks.get('@flecks/core');\n    process.stdout.write(`  hello server: ID ${id}\\n`);\n  },\n};\n"})}),"\n",(0,s.jsx)(n.p,{children:"Now, restart your application and refresh your website. Glorious, isn't it?"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"An image of our simple hello world application running inside a Chromium browser window",src:l(7929).Z+"",width:"628",height:"509"})}),"\n",(0,s.jsx)(n.h2,{id:"everything-so-far-plus-electron",children:"Everything so far... plus Electron!"}),"\n",(0,s.jsx)(r.Z,{cmd:"flecks add -d @flecks/electron",children:(0,s.jsxs)(n.p,{children:["Let's add another core fleck. flecks ships with a core fleck ",(0,s.jsx)(n.code,{children:"@flecks/electron"}),". This runs your\napplication inside of an instance of ",(0,s.jsx)(n.a,{href:"https://www.electronjs.org/",children:"Electron"}),". You'll add the fleck:"]})}),"\n",(0,s.jsx)(n.p,{children:"Finally,"}),"\n",(0,s.jsx)(i.Z,{headless:!0,cmd:"start"}),"\n",(0,s.jsx)(n.p,{children:"and you will see something like this:"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"An image of our simple hello world application running inside an Electron window",src:l(6323).Z+"",width:"820",height:"655"})}),"\n",(0,s.jsxs)(n.p,{children:["Isn't it beautiful? ","\ud83d\ude0c"]}),"\n",(0,s.jsx)(n.admonition,{type:"note",children:(0,s.jsxs)(n.p,{children:["We used the ",(0,s.jsx)(n.code,{children:"-d"})," option with ",(0,s.jsx)(n.code,{children:"flecks add"})," to add ",(0,s.jsx)(n.code,{children:"@flecks/electron"})," to\n",(0,s.jsx)(n.a,{href:"https://docs.npmjs.com/specifying-dependencies-and-devdependencies-in-a-package-json-file",children:(0,s.jsx)(n.code,{children:"devDependencies"})}),"\nsince it's only needed for development."]})})]})}function f(e={}){const{wrapper:n}={...(0,a.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(p,{...e})}):p(e)}},4283:(e,n,l)=>{l.d(n,{Z:()=>i});var s=l(9286),a=l(4866),r=l(5162),t=l(5893);function i(e){let{children:n,cmd:l,headless:i=!1}=e;const o=Array.isArray(l)?l:[l],c=e=>o.map((n=>`${e} ${n}`)).join("\n");return(0,t.jsxs)(a.Z,{className:i&&"headless",groupId:"package-manager",children:[(0,t.jsxs)(r.Z,{value:"npm",label:"npm",children:[n,(0,t.jsx)(s.Z,{language:"bash",children:c("npx")})]}),(0,t.jsxs)(r.Z,{value:"yarn",label:"Yarn",children:[n,(0,t.jsx)(s.Z,{language:"bash",children:c("yarn")})]}),(0,t.jsxs)(r.Z,{value:"pnpm",label:"pnpm",children:[n,(0,t.jsx)(s.Z,{language:"bash",children:c("pnpx")})]}),(0,t.jsxs)(r.Z,{value:"bun",label:"Bun",children:[n,(0,t.jsx)(s.Z,{language:"bash",children:c("bunx")})]})]})}},385:(e,n,l)=>{l.d(n,{Z:()=>i});var s=l(9286),a=l(4866),r=l(5162),t=l(5893);function i(e){let{children:n,headless:l,pkg:i}=e;return(0,t.jsxs)(a.Z,{className:l&&"headless",groupId:"package-manager",children:[(0,t.jsxs)(r.Z,{value:"npm",label:"npm",children:[n,(0,t.jsxs)(s.Z,{language:"bash",children:["npm install ",i]})]}),(0,t.jsxs)(r.Z,{value:"yarn",label:"Yarn",children:[n,(0,t.jsxs)(s.Z,{language:"bash",children:["yarn add ",i]})]}),(0,t.jsxs)(r.Z,{value:"pnpm",label:"pnpm",children:[n,(0,t.jsxs)(s.Z,{language:"bash",children:["pnpm add ",i]})]}),(0,t.jsxs)(r.Z,{value:"bun",label:"Bun",children:[n,(0,t.jsxs)(s.Z,{language:"bash",children:["bun add ",i]})]})]})}},6569:(e,n,l)=>{l.d(n,{Z:()=>i});var s=l(9286),a=l(4866),r=l(5162),t=l(5893);function i(e){let{children:n,cmd:l,headless:i=!1}=e;return(0,t.jsxs)(a.Z,{className:i&&"headless",groupId:"package-manager",children:[(0,t.jsxs)(r.Z,{value:"npm",label:"npm",children:[n,(0,t.jsxs)(s.Z,{language:"bash",children:["npm run ",l]})]}),(0,t.jsxs)(r.Z,{value:"yarn",label:"Yarn",children:[n,(0,t.jsxs)(s.Z,{language:"bash",children:["yarn run ",l]})]}),(0,t.jsxs)(r.Z,{value:"pnpm",label:"pnpm",children:[n,(0,t.jsxs)(s.Z,{language:"bash",children:["pnpm run ",l]})]}),(0,t.jsxs)(r.Z,{value:"bun",label:"Bun",children:[n,(0,t.jsxs)(s.Z,{language:"bash",children:["bun run ",l]})]})]})}},5162:(e,n,l)=>{l.d(n,{Z:()=>t});l(7294);var s=l(512);const a={tabItem:"tabItem_Ymn6"};var r=l(5893);function t(e){let{children:n,hidden:l,className:t}=e;return(0,r.jsx)("div",{role:"tabpanel",className:(0,s.Z)(a.tabItem,t),hidden:l,children:n})}},4866:(e,n,l)=>{l.d(n,{Z:()=>y});var s=l(7294),a=l(512),r=l(2466),t=l(6550),i=l(469),o=l(1980),c=l(7392),d=l(12);function u(e){return s.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,s.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:n,children:l}=e;return(0,s.useMemo)((()=>{const e=n??function(e){return u(e).map((e=>{let{props:{value:n,label:l,attributes:s,default:a}}=e;return{value:n,label:l,attributes:s,default:a}}))}(l);return function(e){const n=(0,c.l)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,l])}function p(e){let{value:n,tabValues:l}=e;return l.some((e=>e.value===n))}function f(e){let{queryString:n=!1,groupId:l}=e;const a=(0,t.k6)(),r=function(e){let{queryString:n=!1,groupId:l}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!l)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return l??null}({queryString:n,groupId:l});return[(0,o._X)(r),(0,s.useCallback)((e=>{if(!r)return;const n=new URLSearchParams(a.location.search);n.set(r,e),a.replace({...a.location,search:n.toString()})}),[r,a])]}function g(e){const{defaultValue:n,queryString:l=!1,groupId:a}=e,r=h(e),[t,o]=(0,s.useState)((()=>function(e){let{defaultValue:n,tabValues:l}=e;if(0===l.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!p({value:n,tabValues:l}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${l.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const s=l.find((e=>e.default))??l[0];if(!s)throw new Error("Unexpected error: 0 tabValues");return s.value}({defaultValue:n,tabValues:r}))),[c,u]=f({queryString:l,groupId:a}),[g,b]=function(e){let{groupId:n}=e;const l=function(e){return e?`docusaurus.tab.${e}`:null}(n),[a,r]=(0,d.Nk)(l);return[a,(0,s.useCallback)((e=>{l&&r.set(e)}),[l,r])]}({groupId:a}),m=(()=>{const e=c??g;return p({value:e,tabValues:r})?e:null})();(0,i.Z)((()=>{m&&o(m)}),[m]);return{selectedValue:t,selectValue:(0,s.useCallback)((e=>{if(!p({value:e,tabValues:r}))throw new Error(`Can't select invalid tab value=${e}`);o(e),u(e),b(e)}),[u,b,r]),tabValues:r}}var b=l(2389);const m={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var x=l(5893);function j(e){let{className:n,block:l,selectedValue:s,selectValue:t,tabValues:i}=e;const o=[],{blockElementScrollPositionUntilNextRender:c}=(0,r.o5)(),d=e=>{const n=e.currentTarget,l=o.indexOf(n),a=i[l].value;a!==s&&(c(n),t(a))},u=e=>{let n=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const l=o.indexOf(e.currentTarget)+1;n=o[l]??o[0];break}case"ArrowLeft":{const l=o.indexOf(e.currentTarget)-1;n=o[l]??o[o.length-1];break}}n?.focus()};return(0,x.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,a.Z)("tabs",{"tabs--block":l},n),children:i.map((e=>{let{value:n,label:l,attributes:r}=e;return(0,x.jsx)("li",{role:"tab",tabIndex:s===n?0:-1,"aria-selected":s===n,ref:e=>o.push(e),onKeyDown:u,onClick:d,...r,className:(0,a.Z)("tabs__item",m.tabItem,r?.className,{"tabs__item--active":s===n}),children:l??n},n)}))})}function v(e){let{lazy:n,children:l,selectedValue:a}=e;const r=(Array.isArray(l)?l:[l]).filter(Boolean);if(n){const e=r.find((e=>e.props.value===a));return e?(0,s.cloneElement)(e,{className:"margin-top--md"}):null}return(0,x.jsx)("div",{className:"margin-top--md",children:r.map(((e,n)=>(0,s.cloneElement)(e,{key:n,hidden:e.props.value!==a})))})}function k(e){const n=g(e);return(0,x.jsxs)("div",{className:(0,a.Z)("tabs-container",m.tabList),children:[(0,x.jsx)(j,{...e,...n}),(0,x.jsx)(v,{...e,...n})]})}function y(e){const n=(0,b.Z)();return(0,x.jsx)(k,{...e,children:u(e.children)},String(n))}},6323:(e,n,l)=>{l.d(n,{Z:()=>s});const s=l.p+"assets/images/flecks-electron-a0aa8d1371582b485c87402b0aa5b555.png"},7929:(e,n,l)=>{l.d(n,{Z:()=>s});const s=l.p+"assets/images/flecks-web-4d794c79b53faa14d140b2dde7e51709.png"}}]);