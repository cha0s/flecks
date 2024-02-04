"use strict";(self.webpackChunkflecks_docusaurus=self.webpackChunkflecks_docusaurus||[]).push([[6911],{1039:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>d,contentTitle:()=>o,default:()=>m,frontMatter:()=>i,metadata:()=>u,toc:()=>p});var a=r(5893),t=r(1151),l=r(3200),s=r(4283),c=r(6569);const i={title:"REPL",description:"Start a REPL server and connect to it."},o=void 0,u={id:"repl",title:"REPL",description:"Start a REPL server and connect to it.",source:"@site/docs/repl.mdx",sourceDirName:".",slug:"/repl",permalink:"/flecks/docs/repl",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"REPL",description:"Start a REPL server and connect to it."},sidebar:"flecksSidebar",previous:{title:"Redux",permalink:"/flecks/docs/redux"},next:{title:"Generated details",permalink:"/flecks/docs/category/generated-details"}},d={},p=[{value:"Prerequisites",id:"prerequisites",level:2},{value:"Play with a REPL",id:"play-with-a-repl",level:2},{value:"Extend the REPL",id:"extend-the-repl",level:2}];function h(e){const n={a:"a",admonition:"admonition",code:"code",h2:"h2",p:"p",pre:"pre",...(0,t.a)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)(n.p,{children:["flecks provides ",(0,a.jsx)(n.code,{children:"@flecks/repl"})," to make it easy to run a\n",(0,a.jsx)(n.a,{href:"https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop",children:"REPL"})," inside your running\napplication. ",(0,a.jsx)(n.code,{children:"@flecks/repl"})," provides a ",(0,a.jsx)(n.a,{href:"./cli#repl",children:"command"})," to easily connect to your application."]}),"\n",(0,a.jsx)(n.h2,{id:"prerequisites",children:"Prerequisites"}),"\n",(0,a.jsxs)(n.p,{children:["In order to use it you will need to have ",(0,a.jsx)(n.a,{href:"https://manpages.org/socat",children:"socat"}),"."]}),"\n",(0,a.jsx)(n.h2,{id:"play-with-a-repl",children:"Play with a REPL"}),"\n",(0,a.jsx)(n.p,{children:"Let's create an application to test the REPL:"}),"\n",(0,a.jsx)(l.Z,{type:"app",pkg:"repl-test"}),"\n",(0,a.jsx)(s.Z,{headless:!0,cmd:"flecks add -d @flecks/repl"}),"\n",(0,a.jsx)(c.Z,{headless:!0,cmd:"start",children:(0,a.jsx)(n.p,{children:"Start your application:"})}),"\n",(0,a.jsx)(n.p,{children:"It will just sit there. Open another terminal in the project directory and run the command:"}),"\n",(0,a.jsx)(s.Z,{headless:!0,cmd:"flecks repl"}),"\n",(0,a.jsxs)(n.admonition,{type:"tip",children:[(0,a.jsx)(n.p,{children:"For a more ergonomic experience, you may use:"}),(0,a.jsx)(s.Z,{headless:!0,cmd:"flecks repl -r"}),(0,a.jsxs)(n.p,{children:["If you have ",(0,a.jsx)(n.a,{href:"https://manpages.org/rlwrap",children:"rlwrap"})," installed."]})]}),"\n",(0,a.jsx)(n.p,{children:"and you will be greeted with a prompt:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:"repl-test>\n"})}),"\n",(0,a.jsx)(n.p,{children:"That's our application ID! We can run commands:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-js",children:"repl-test> flecks.get('@flecks/core')\n{ id: 'repl-test' }\n"})}),"\n",(0,a.jsx)(n.p,{children:"Confirm we're actually in our application by killing it:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:"repl-test> process.exit(0)\n"})}),"\n",(0,a.jsx)(n.p,{children:"That will kick us back out to the terminal. If we try to run the command again, we'll get an error\nthat looks something like this:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:'[...] socat[...] E connect(5, AF=1 "/tmp/flecks/repl-test/repl/repl-test-[...].sock", 57): Connection refused\n'})}),"\n",(0,a.jsx)(n.p,{children:"This is because there's no application to connect to anymore."}),"\n",(0,a.jsx)(n.h2,{id:"extend-the-repl",children:"Extend the REPL"}),"\n",(0,a.jsxs)(n.p,{children:["Your flecks can implement ",(0,a.jsx)(n.a,{href:"./flecks/hooks#flecksreplcommands",children:"@flecks/repl.commands"})," and/or\n",(0,a.jsx)(n.a,{href:"./flecks/hooks#flecksreplcontext",children:"@flecks/repl.context"})," to add context or commands to the REPL."]}),"\n",(0,a.jsxs)(n.p,{children:["For instance, ",(0,a.jsx)(n.code,{children:"@flecks/passport-local"})," implements a command to easily create a user account in\nthe REPL."]})]})}function m(e={}){const{wrapper:n}={...(0,t.a)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(h,{...e})}):h(e)}},3200:(e,n,r)=>{r.d(n,{Z:()=>c});var a=r(9286),t=r(4866),l=r(5162),s=r(5893);function c(e){let{children:n,headless:r=!1,pkg:c,type:i}=e;return(0,s.jsxs)(t.Z,{className:r&&"headless",groupId:"package-manager",children:[(0,s.jsxs)(l.Z,{value:"npm",label:"npm",children:[n,(0,s.jsxs)(a.Z,{language:"bash",children:["npm init @flecks/",i," ",c]})]}),(0,s.jsxs)(l.Z,{value:"yarn",label:"Yarn",children:[n,(0,s.jsxs)(a.Z,{language:"bash",children:["yarn create @flecks/",i," ",c]})]}),(0,s.jsxs)(l.Z,{value:"pnpm",label:"pnpm",children:[n,(0,s.jsxs)(a.Z,{language:"bash",children:["pnpm create @flecks/",i," ",c]})]}),(0,s.jsxs)(l.Z,{value:"bun",label:"Bun",children:[n,(0,s.jsxs)(a.Z,{language:"bash",children:["bun create @flecks/",i," ",c]})]})]})}},4283:(e,n,r)=>{r.d(n,{Z:()=>c});var a=r(9286),t=r(4866),l=r(5162),s=r(5893);function c(e){let{children:n,cmd:r,headless:c=!1}=e;const i=Array.isArray(r)?r:[r],o=e=>i.map((n=>`${e} ${n}`)).join("\n");return(0,s.jsxs)(t.Z,{className:c&&"headless",groupId:"package-manager",children:[(0,s.jsxs)(l.Z,{value:"npm",label:"npm",children:[n,(0,s.jsx)(a.Z,{language:"bash",children:o("npx")})]}),(0,s.jsxs)(l.Z,{value:"yarn",label:"Yarn",children:[n,(0,s.jsx)(a.Z,{language:"bash",children:o("yarn")})]}),(0,s.jsxs)(l.Z,{value:"pnpm",label:"pnpm",children:[n,(0,s.jsx)(a.Z,{language:"bash",children:o("pnpx")})]}),(0,s.jsxs)(l.Z,{value:"bun",label:"Bun",children:[n,(0,s.jsx)(a.Z,{language:"bash",children:o("bunx")})]})]})}},6569:(e,n,r)=>{r.d(n,{Z:()=>c});var a=r(9286),t=r(4866),l=r(5162),s=r(5893);function c(e){let{children:n,cmd:r,headless:c=!1}=e;return(0,s.jsxs)(t.Z,{className:c&&"headless",groupId:"package-manager",children:[(0,s.jsxs)(l.Z,{value:"npm",label:"npm",children:[n,(0,s.jsxs)(a.Z,{language:"bash",children:["npm run ",r]})]}),(0,s.jsxs)(l.Z,{value:"yarn",label:"Yarn",children:[n,(0,s.jsxs)(a.Z,{language:"bash",children:["yarn run ",r]})]}),(0,s.jsxs)(l.Z,{value:"pnpm",label:"pnpm",children:[n,(0,s.jsxs)(a.Z,{language:"bash",children:["pnpm run ",r]})]}),(0,s.jsxs)(l.Z,{value:"bun",label:"Bun",children:[n,(0,s.jsxs)(a.Z,{language:"bash",children:["bun run ",r]})]})]})}},5162:(e,n,r)=>{r.d(n,{Z:()=>s});r(7294);var a=r(512);const t={tabItem:"tabItem_Ymn6"};var l=r(5893);function s(e){let{children:n,hidden:r,className:s}=e;return(0,l.jsx)("div",{role:"tabpanel",className:(0,a.Z)(t.tabItem,s),hidden:r,children:n})}},4866:(e,n,r)=>{r.d(n,{Z:()=>y});var a=r(7294),t=r(512),l=r(2466),s=r(6550),c=r(469),i=r(1980),o=r(7392),u=r(12);function d(e){return a.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,a.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function p(e){const{values:n,children:r}=e;return(0,a.useMemo)((()=>{const e=n??function(e){return d(e).map((e=>{let{props:{value:n,label:r,attributes:a,default:t}}=e;return{value:n,label:r,attributes:a,default:t}}))}(r);return function(e){const n=(0,o.l)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,r])}function h(e){let{value:n,tabValues:r}=e;return r.some((e=>e.value===n))}function m(e){let{queryString:n=!1,groupId:r}=e;const t=(0,s.k6)(),l=function(e){let{queryString:n=!1,groupId:r}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!r)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return r??null}({queryString:n,groupId:r});return[(0,i._X)(l),(0,a.useCallback)((e=>{if(!l)return;const n=new URLSearchParams(t.location.search);n.set(l,e),t.replace({...t.location,search:n.toString()})}),[l,t])]}function f(e){const{defaultValue:n,queryString:r=!1,groupId:t}=e,l=p(e),[s,i]=(0,a.useState)((()=>function(e){let{defaultValue:n,tabValues:r}=e;if(0===r.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!h({value:n,tabValues:r}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${r.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const a=r.find((e=>e.default))??r[0];if(!a)throw new Error("Unexpected error: 0 tabValues");return a.value}({defaultValue:n,tabValues:l}))),[o,d]=m({queryString:r,groupId:t}),[f,x]=function(e){let{groupId:n}=e;const r=function(e){return e?`docusaurus.tab.${e}`:null}(n),[t,l]=(0,u.Nk)(r);return[t,(0,a.useCallback)((e=>{r&&l.set(e)}),[r,l])]}({groupId:t}),b=(()=>{const e=o??f;return h({value:e,tabValues:l})?e:null})();(0,c.Z)((()=>{b&&i(b)}),[b]);return{selectedValue:s,selectValue:(0,a.useCallback)((e=>{if(!h({value:e,tabValues:l}))throw new Error(`Can't select invalid tab value=${e}`);i(e),d(e),x(e)}),[d,x,l]),tabValues:l}}var x=r(2389);const b={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var g=r(5893);function j(e){let{className:n,block:r,selectedValue:a,selectValue:s,tabValues:c}=e;const i=[],{blockElementScrollPositionUntilNextRender:o}=(0,l.o5)(),u=e=>{const n=e.currentTarget,r=i.indexOf(n),t=c[r].value;t!==a&&(o(n),s(t))},d=e=>{let n=null;switch(e.key){case"Enter":u(e);break;case"ArrowRight":{const r=i.indexOf(e.currentTarget)+1;n=i[r]??i[0];break}case"ArrowLeft":{const r=i.indexOf(e.currentTarget)-1;n=i[r]??i[i.length-1];break}}n?.focus()};return(0,g.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,t.Z)("tabs",{"tabs--block":r},n),children:c.map((e=>{let{value:n,label:r,attributes:l}=e;return(0,g.jsx)("li",{role:"tab",tabIndex:a===n?0:-1,"aria-selected":a===n,ref:e=>i.push(e),onKeyDown:d,onClick:u,...l,className:(0,t.Z)("tabs__item",b.tabItem,l?.className,{"tabs__item--active":a===n}),children:r??n},n)}))})}function v(e){let{lazy:n,children:r,selectedValue:t}=e;const l=(Array.isArray(r)?r:[r]).filter(Boolean);if(n){const e=l.find((e=>e.props.value===t));return e?(0,a.cloneElement)(e,{className:"margin-top--md"}):null}return(0,g.jsx)("div",{className:"margin-top--md",children:l.map(((e,n)=>(0,a.cloneElement)(e,{key:n,hidden:e.props.value!==t})))})}function k(e){const n=f(e);return(0,g.jsxs)("div",{className:(0,t.Z)("tabs-container",b.tabList),children:[(0,g.jsx)(j,{...e,...n}),(0,g.jsx)(v,{...e,...n})]})}function y(e){const n=(0,x.Z)();return(0,g.jsx)(k,{...e,children:d(e.children)},String(n))}}}]);