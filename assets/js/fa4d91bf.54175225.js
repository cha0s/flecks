"use strict";(self.webpackChunkflecks_docusaurus=self.webpackChunkflecks_docusaurus||[]).push([[5930],{4099:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>i,metadata:()=>u,toc:()=>d});var r=n(5893),a=n(1151),l=n(3200),s=n(6569);const i={title:"Installation",description:"How to get started with your first flecks project."},o="Installation",u={id:"installation",title:"Installation",description:"How to get started with your first flecks project.",source:"@site/docs/installation.mdx",sourceDirName:".",slug:"/installation",permalink:"/flecks/docs/installation",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{title:"Installation",description:"How to get started with your first flecks project."},sidebar:"flecksSidebar",previous:{title:"Getting Started",permalink:"/flecks/docs/category/getting-started"},next:{title:"Configuration",permalink:"/flecks/docs/configuration"}},c={},d=[{value:"Start your application",id:"start-your-application",level:2},{value:"Do something interesting",id:"do-something-interesting",level:2}];function p(e){const t={code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",...(0,a.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.h1,{id:"installation",children:"Installation"}),"\n",(0,r.jsx)(t.p,{children:"The first step toward creating an application with flecks is to use the built-in\ncreation utility:"}),"\n",(0,r.jsx)(l.Z,{type:"app",pkg:"hello-world"}),"\n",(0,r.jsx)(t.h2,{id:"start-your-application",children:"Start your application"}),"\n",(0,r.jsx)(t.p,{children:"Now, move into your new project directory and"}),"\n",(0,r.jsx)(s.Z,{headless:!0,cmd:"start"}),"\n",(0,r.jsx)(t.p,{children:"You'll see a bunch of output, but the important thing is the last line:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{children:"  @flecks/server/entry up! +7ms\n"})}),"\n",(0,r.jsx)(t.p,{children:"That means we've got an application up and running!"}),"\n",(0,r.jsx)(t.h2,{id:"do-something-interesting",children:"Do something interesting"}),"\n",(0,r.jsx)(t.p,{children:"The only problem is that it doesn't do a single\nthing except sit there. Let's get into how to configure our application to do something interesting\nand start working on creating a fleck of our own."})]})}function h(e={}){const{wrapper:t}={...(0,a.a)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(p,{...e})}):p(e)}},3200:(e,t,n)=>{n.d(t,{Z:()=>i});var r=n(9286),a=n(4866),l=n(5162),s=n(5893);function i(e){let{children:t,headless:n=!0,pkg:i,type:o}=e;return(0,s.jsx)(a.Z,{className:n&&"headless",groupId:"package-manager",children:(0,s.jsxs)(l.Z,{value:"npm",label:"npm",children:[t,(0,s.jsx)(r.Z,{language:"bash",children:"fleck"===o?`npm init @flecks/${o} -w ${i}`:`npm init @flecks/${o} ${i}`})]})})}},6569:(e,t,n)=>{n.d(t,{Z:()=>i});var r=n(9286),a=n(4866),l=n(5162),s=n(5893);function i(e){let{children:t,cmd:n,headless:i=!0}=e;return(0,s.jsx)(a.Z,{className:i&&"headless",groupId:"package-manager",children:(0,s.jsxs)(l.Z,{value:"npm",label:"npm",children:[t,(0,s.jsxs)(r.Z,{language:"bash",children:["npm run ",n]})]})})}},5162:(e,t,n)=>{n.d(t,{Z:()=>s});n(7294);var r=n(512);const a={tabItem:"tabItem_Ymn6"};var l=n(5893);function s(e){let{children:t,hidden:n,className:s}=e;return(0,l.jsx)("div",{role:"tabpanel",className:(0,r.Z)(a.tabItem,s),hidden:n,children:t})}},4866:(e,t,n)=>{n.d(t,{Z:()=>y});var r=n(7294),a=n(512),l=n(2466),s=n(6550),i=n(469),o=n(1980),u=n(7392),c=n(12);function d(e){return r.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,r.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function p(e){const{values:t,children:n}=e;return(0,r.useMemo)((()=>{const e=t??function(e){return d(e).map((e=>{let{props:{value:t,label:n,attributes:r,default:a}}=e;return{value:t,label:n,attributes:r,default:a}}))}(n);return function(e){const t=(0,u.l)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,n])}function h(e){let{value:t,tabValues:n}=e;return n.some((e=>e.value===t))}function f(e){let{queryString:t=!1,groupId:n}=e;const a=(0,s.k6)(),l=function(e){let{queryString:t=!1,groupId:n}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!n)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return n??null}({queryString:t,groupId:n});return[(0,o._X)(l),(0,r.useCallback)((e=>{if(!l)return;const t=new URLSearchParams(a.location.search);t.set(l,e),a.replace({...a.location,search:t.toString()})}),[l,a])]}function m(e){const{defaultValue:t,queryString:n=!1,groupId:a}=e,l=p(e),[s,o]=(0,r.useState)((()=>function(e){let{defaultValue:t,tabValues:n}=e;if(0===n.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!h({value:t,tabValues:n}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${n.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const r=n.find((e=>e.default))??n[0];if(!r)throw new Error("Unexpected error: 0 tabValues");return r.value}({defaultValue:t,tabValues:l}))),[u,d]=f({queryString:n,groupId:a}),[m,g]=function(e){let{groupId:t}=e;const n=function(e){return e?`docusaurus.tab.${e}`:null}(t),[a,l]=(0,c.Nk)(n);return[a,(0,r.useCallback)((e=>{n&&l.set(e)}),[n,l])]}({groupId:a}),b=(()=>{const e=u??m;return h({value:e,tabValues:l})?e:null})();(0,i.Z)((()=>{b&&o(b)}),[b]);return{selectedValue:s,selectValue:(0,r.useCallback)((e=>{if(!h({value:e,tabValues:l}))throw new Error(`Can't select invalid tab value=${e}`);o(e),d(e),g(e)}),[d,g,l]),tabValues:l}}var g=n(2389);const b={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var v=n(5893);function k(e){let{className:t,block:n,selectedValue:r,selectValue:s,tabValues:i}=e;const o=[],{blockElementScrollPositionUntilNextRender:u}=(0,l.o5)(),c=e=>{const t=e.currentTarget,n=o.indexOf(t),a=i[n].value;a!==r&&(u(t),s(a))},d=e=>{let t=null;switch(e.key){case"Enter":c(e);break;case"ArrowRight":{const n=o.indexOf(e.currentTarget)+1;t=o[n]??o[0];break}case"ArrowLeft":{const n=o.indexOf(e.currentTarget)-1;t=o[n]??o[o.length-1];break}}t?.focus()};return(0,v.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,a.Z)("tabs",{"tabs--block":n},t),children:i.map((e=>{let{value:t,label:n,attributes:l}=e;return(0,v.jsx)("li",{role:"tab",tabIndex:r===t?0:-1,"aria-selected":r===t,ref:e=>o.push(e),onKeyDown:d,onClick:c,...l,className:(0,a.Z)("tabs__item",b.tabItem,l?.className,{"tabs__item--active":r===t}),children:n??t},t)}))})}function w(e){let{lazy:t,children:n,selectedValue:a}=e;const l=(Array.isArray(n)?n:[n]).filter(Boolean);if(t){const e=l.find((e=>e.props.value===a));return e?(0,r.cloneElement)(e,{className:"margin-top--md"}):null}return(0,v.jsx)("div",{className:"margin-top--md",children:l.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==a})))})}function x(e){const t=m(e);return(0,v.jsxs)("div",{className:(0,a.Z)("tabs-container",b.tabList),children:[(0,v.jsx)(k,{...e,...t}),(0,v.jsx)(w,{...e,...t})]})}function y(e){const t=(0,g.Z)();return(0,v.jsx)(x,{...e,children:d(e.children)},String(t))}}}]);