"use strict";(self.webpackChunkflecks_docusaurus=self.webpackChunkflecks_docusaurus||[]).push([[5930],{4099:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>i,metadata:()=>u,toc:()=>d});var a=n(5893),r=n(1151),s=n(3200),l=n(6569);const i={title:"Installation",description:"How to get started with your first flecks project."},o="Installation",u={id:"installation",title:"Installation",description:"How to get started with your first flecks project.",source:"@site/docs/installation.mdx",sourceDirName:".",slug:"/installation",permalink:"/flecks/docs/installation",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"Installation",description:"How to get started with your first flecks project."},sidebar:"flecksSidebar",previous:{title:"Getting Started",permalink:"/flecks/docs/category/getting-started"},next:{title:"Configuration",permalink:"/flecks/docs/configuration"}},c={},d=[{value:"Start your application",id:"start-your-application",level:2},{value:"Do something interesting",id:"do-something-interesting",level:2}];function p(e){const t={admonition:"admonition",code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",...(0,r.a)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(t.h1,{id:"installation",children:"Installation"}),"\n",(0,a.jsx)(t.p,{children:"The first step toward creating an application with flecks is to use the built-in\ncreation utility:"}),"\n",(0,a.jsx)(s.Z,{type:"app",pkg:"hello-world"}),"\n",(0,a.jsxs)(t.admonition,{type:"tip",children:[(0,a.jsx)(t.p,{children:"You may also inspect the utility command options:"}),(0,a.jsx)(s.Z,{headless:!0,type:"app",pkg:"-- --help"}),(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{children:'Usage: create-app [options] <app>\n\nArguments:\n  app                             name of the app to create\n\nOptions:\n  -pm,--package-manager <binary>  package manager binary (choices: "npm", "pnpm", "bun", "yarn")\n  -h, --help                      display help for command\n'})})]}),"\n",(0,a.jsx)(t.h2,{id:"start-your-application",children:"Start your application"}),"\n",(0,a.jsx)(t.p,{children:"Now, move into your new project directory and"}),"\n",(0,a.jsx)(l.Z,{headless:!0,cmd:"start"}),"\n",(0,a.jsx)(t.p,{children:"You'll see a bunch of output, but the important thing is the last line:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{children:"  @flecks/server/entry up! +7ms\n"})}),"\n",(0,a.jsx)(t.p,{children:"That means we've got an application up and running!"}),"\n",(0,a.jsx)(t.h2,{id:"do-something-interesting",children:"Do something interesting"}),"\n",(0,a.jsx)(t.p,{children:"The only problem is that it doesn't do a single\nthing except sit there. Let's get into how to configure our application to do something interesting\nand start working on creating a fleck of our own."})]})}function h(e={}){const{wrapper:t}={...(0,r.a)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(p,{...e})}):p(e)}},3200:(e,t,n)=>{n.d(t,{Z:()=>i});var a=n(9286),r=n(4866),s=n(5162),l=n(5893);function i(e){let{children:t,headless:n=!1,pkg:i,type:o}=e;return(0,l.jsxs)(r.Z,{className:n&&"headless",groupId:"package-manager",children:[(0,l.jsxs)(s.Z,{value:"npm",label:"npm",children:[t,(0,l.jsxs)(a.Z,{language:"bash",children:["npm init @flecks/",o," ",i]})]}),(0,l.jsxs)(s.Z,{value:"yarn",label:"Yarn",children:[t,(0,l.jsxs)(a.Z,{language:"bash",children:["yarn create @flecks/",o," ",i]})]}),(0,l.jsxs)(s.Z,{value:"pnpm",label:"pnpm",children:[t,(0,l.jsxs)(a.Z,{language:"bash",children:["pnpm create @flecks/",o," ",i]})]}),(0,l.jsxs)(s.Z,{value:"bun",label:"Bun",children:[t,(0,l.jsxs)(a.Z,{language:"bash",children:["bun create @flecks/",o," ",i]})]})]})}},6569:(e,t,n)=>{n.d(t,{Z:()=>i});var a=n(9286),r=n(4866),s=n(5162),l=n(5893);function i(e){let{children:t,cmd:n,headless:i=!1}=e;return(0,l.jsxs)(r.Z,{className:i&&"headless",groupId:"package-manager",children:[(0,l.jsxs)(s.Z,{value:"npm",label:"npm",children:[t,(0,l.jsxs)(a.Z,{language:"bash",children:["npm run ",n]})]}),(0,l.jsxs)(s.Z,{value:"yarn",label:"Yarn",children:[t,(0,l.jsxs)(a.Z,{language:"bash",children:["yarn run ",n]})]}),(0,l.jsxs)(s.Z,{value:"pnpm",label:"pnpm",children:[t,(0,l.jsxs)(a.Z,{language:"bash",children:["pnpm run ",n]})]}),(0,l.jsxs)(s.Z,{value:"bun",label:"Bun",children:[t,(0,l.jsxs)(a.Z,{language:"bash",children:["bun run ",n]})]})]})}},5162:(e,t,n)=>{n.d(t,{Z:()=>l});n(7294);var a=n(512);const r={tabItem:"tabItem_Ymn6"};var s=n(5893);function l(e){let{children:t,hidden:n,className:l}=e;return(0,s.jsx)("div",{role:"tabpanel",className:(0,a.Z)(r.tabItem,l),hidden:n,children:t})}},4866:(e,t,n)=>{n.d(t,{Z:()=>k});var a=n(7294),r=n(512),s=n(2466),l=n(6550),i=n(469),o=n(1980),u=n(7392),c=n(12);function d(e){return a.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,a.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function p(e){const{values:t,children:n}=e;return(0,a.useMemo)((()=>{const e=t??function(e){return d(e).map((e=>{let{props:{value:t,label:n,attributes:a,default:r}}=e;return{value:t,label:n,attributes:a,default:r}}))}(n);return function(e){const t=(0,u.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function h(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function m(e){let{queryString:t=!1,groupId:n}=e;const r=(0,l.k6)(),s=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,o._X)(s),(0,a.useCallback)((e=>{if(!s)return;const t=new URLSearchParams(r.location.search);t.set(s,e),r.replace({...r.location,search:t.toString()})}),[s,r])]}function f(e){const{defaultValue:t,queryString:n=!1,groupId:r}=e,s=p(e),[l,o]=(0,a.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!h({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const a=n.find((e=>e.default))??n[0];if(!a)throw new Error("Unexpected error: 0 tabValues");return a.value}({defaultValue:t,tabValues:s}))),[u,d]=m({queryString:n,groupId:r}),[f,g]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[r,s]=(0,c.Nk)(n);return[r,(0,a.useCallback)((e=>{n&&s.set(e)}),[n,s])]}({groupId:r}),b=(()=>{const e=u??f;return h({value:e,tabValues:s})?e:null})();(0,i.Z)((()=>{b&&o(b)}),[b]);return{selectedValue:l,selectValue:(0,a.useCallback)((e=>{if(!h({value:e,tabValues:s}))throw new Error(`Can't select invalid tab value=${e}`);o(e),d(e),g(e)}),[d,g,s]),tabValues:s}}var g=n(2389);const b={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var v=n(5893);function x(e){let{className:t,block:n,selectedValue:a,selectValue:l,tabValues:i}=e;const o=[],{blockElementScrollPositionUntilNextRender:u}=(0,s.o5)(),c=e=>{const t=e.currentTarget,n=o.indexOf(t),r=i[n].value;r!==a&&(u(t),l(r))},d=e=>{let t=null;switch(e.key){case"Enter":c(e);break;case"ArrowRight":{const n=o.indexOf(e.currentTarget)+1;t=o[n]??o[0];break}case"ArrowLeft":{const n=o.indexOf(e.currentTarget)-1;t=o[n]??o[o.length-1];break}}t?.focus()};return(0,v.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.Z)("tabs",{"tabs--block":n},t),children:i.map((e=>{let{value:t,label:n,attributes:s}=e;return(0,v.jsx)("li",{role:"tab",tabIndex:a===t?0:-1,"aria-selected":a===t,ref:e=>o.push(e),onKeyDown:d,onClick:c,...s,className:(0,r.Z)("tabs__item",b.tabItem,s?.className,{"tabs__item--active":a===t}),children:n??t},t)}))})}function j(e){let{lazy:t,children:n,selectedValue:r}=e;const s=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=s.find((e=>e.props.value===r));return e?(0,a.cloneElement)(e,{className:"margin-top--md"}):null}return(0,v.jsx)("div",{className:"margin-top--md",children:s.map(((e,t)=>(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==r})))})}function y(e){const t=f(e);return(0,v.jsxs)("div",{className:(0,r.Z)("tabs-container",b.tabList),children:[(0,v.jsx)(x,{...e,...t}),(0,v.jsx)(j,{...e,...t})]})}function k(e){const t=(0,g.Z)();return(0,v.jsx)(y,{...e,children:d(e.children)},String(t))}}}]);